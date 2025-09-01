import numpy as np

# Expanded set of relationships
from config import RELATIONSHIPS, SEMANTIC_LIKELIHOOD

def get_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - intersection

    return intersection / union if union > 0 else 0

def predict_relationship(obj1, obj2):
    _, name1, _, xmin1, ymin1, xmax1, ymax1 = obj1
    _, name2, _, xmin2, ymin2, xmax2, ymax2 = obj2

    box1 = (xmin1, ymin1, xmax1, ymax1)
    box2 = (xmin2, ymin2, xmax2, ymax2)

    iou = get_iou(box1, box2)

    if iou > 0.8:
        area1 = (xmax1 - xmin1) * (ymax1 - ymin1)
        area2 = (xmax2 - xmin2) * (ymax2 - ymin2)
        if area1 < area2:
            return "inside"
        else:
            return "contains"

    y_overlap = max(0, min(ymax1, ymax2) - max(ymin1, ymin2))
    x_center1 = (xmin1 + xmax1) / 2
    x_center2 = (xmin2 + xmax2) / 2

    if y_overlap > 0:
        if abs(x_center1 - x_center2) < (xmax1 - xmin1) / 2:
            if ymax1 < ymax2:
                return "on"
            else:
                return "under"

    if xmax1 < xmin2:
        return "left of"
    elif xmin1 > xmax2:
        return "right of"

    # A simple heuristic for "next to"
    if iou == 0 and min(abs(xmax1 - xmin2), abs(xmin1 - xmax2)) < 50:
        return "next to"

    return None

def get_plausible_relationship(obj1, obj2):
    spatial_rel = predict_relationship(obj1, obj2)

    if not spatial_rel:
        return None

    name1 = obj1[1] # Use obj_name
    name2 = obj2[1] # Use obj_name

    if (name1, name2) in SEMANTIC_LIKELIHOOD:
        if spatial_rel in SEMANTIC_LIKELIHOOD[(name1, name2)]:
            return f"{obj1[0]} {spatial_rel} {obj2[0]}" # Use unique_id for relationship string
    elif (name2, name1) in SEMANTIC_LIKELIHOOD:
        reverse_rel_map = {"on": "under", "under": "on", "left of": "right of", "right of": "left of", "inside": "contains"}
        if reverse_rel_map.get(spatial_rel) in SEMANTIC_LIKELIHOOD[(name2, name1)]:
            return f"{obj1[0]} {spatial_rel} {obj2[0]}" # Use unique_id for relationship string

    # For relationships like "wearing" or "holding", the spatial logic is more complex
    # and would typically require a dedicated model. We simulate it here.
    if name1 == "person" and name2 in ["hat", "backpack"]:
        return f"{obj1[0]} wearing {obj2[0]}" # Use unique_id for relationship string
    if name1 == "person" and name2 in ["handbag", "suitcase"]:
        return f"{obj1[0]} holding {obj2[0]}" # Use unique_id for relationship string

    return f"{obj1[0]} {spatial_rel} {obj2[0]}" # Use unique_id for relationship string