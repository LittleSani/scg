from fastapi import UploadFile
import torch
import numpy as np
from PIL import Image
import io
import cv2
import base64

from config import RELATIONSHIPS
from relationships import get_plausible_relationship

async def process_image(file: UploadFile, models: dict):
    yolo_model = models["yolo_model"]
    summarizer = models["summarizer"]

    contents = await file.read()
    original_image = Image.open(io.BytesIO(contents)).convert("RGB")
    original_width, original_height = original_image.size
    image = original_image.resize((640, 640))

    results = yolo_model(image)
    predictions = results.pandas().xyxy[0]
    
    object_counts = {}
    scaled_bboxes = []
    for _, row in predictions.iterrows():
        obj_name = row['name']
        if obj_name not in object_counts:
            object_counts[obj_name] = 0
        object_counts[obj_name] += 1
        unique_id = f"{obj_name}_{object_counts[obj_name]}"
        
        xmin, ymin, xmax, ymax = row['xmin'], row['ymin'], row['xmax'], row['ymax']
        
        # Scale bounding box coordinates back to original image size
        scale_x = original_width / 640
        scale_y = original_height / 640
        scaled_xmin = int(xmin * scale_x)
        scaled_ymin = int(ymin * scale_y)
        scaled_xmax = int(xmax * scale_x)
        scaled_ymax = int(ymax * scale_y)

        scaled_bboxes.append((unique_id, obj_name, row['confidence'], scaled_xmin, scaled_ymin, scaled_xmax, scaled_ymax))

    initial_relationships = []
    for i in range(len(scaled_bboxes)):
        for j in range(i + 1, len(scaled_bboxes)):
            relationship = get_plausible_relationship(scaled_bboxes[i], scaled_bboxes[j])
            if relationship:
                initial_relationships.append(relationship)

    refined_relationships = list(initial_relationships)
    for rel1 in initial_relationships:
        obj1_id = rel1.split(" ", 1)[0]
        obj2_id = rel1.rsplit(" ", 1)[-1]
        for rel2 in initial_relationships:
            obj3_id = rel2.split(" ", 1)[0]
            obj4_id = rel2.rsplit(" ", 1)[-1]
            if obj2_id == obj3_id:
                new_rel = f"{obj1_id} is near {obj4_id}"
                if new_rel not in refined_relationships:
                    refined_relationships.append(new_rel)

    scene_graph = {
        "objects": [{
            "id": box[0],
            "x": box[3],
            "y": box[4],
            "width": box[5] - box[3],
            "height": box[6] - box[4]
        } for box in scaled_bboxes],
        "relationships": list(set(refined_relationships)),
    }

    description = generate_description(scene_graph, summarizer)

    processed_image_b64 = draw_scene_graph_on_image(original_image, scaled_bboxes)

    return {"scene_graph": scene_graph, "description": description, "processed_image": processed_image_b64}

def draw_scene_graph_on_image(image, bboxes):
    img_np = np.array(image)
    img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

    for unique_id, name, confidence, xmin, ymin, xmax, ymax in bboxes:
        p1 = (xmin, ymin)
        p2 = (xmax, ymax)
        color = (0, 255, 0)  # Green color for bounding box
        thickness = 2
        cv2.rectangle(img_cv, p1, p2, color, thickness)
        cv2.putText(img_cv, f'{unique_id} ({name}) {confidence:.2f}', (xmin, ymin - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    img_pil = Image.fromarray(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
    buffered = io.BytesIO()
    img_pil.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def generate_description(scene_graph, summarizer):
    if not scene_graph["relationships"]:
        return "No clear relationships found between the objects."

    text_to_summarize = ". ".join(scene_graph["relationships"]) + "."
    summary = summarizer(text_to_summarize, max_length=50, min_length=10, do_sample=False)
    return summary[0]["summary_text"]
