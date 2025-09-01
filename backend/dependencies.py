import torch
from transformers import pipeline

from yolo import YOLOv5
from transformer_model import Transformer
from graph_network import GNN
from config import RELATIONSHIPS

def get_models():
    yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5m', pretrained=True)
    transformer_model = Transformer(num_classes=len(RELATIONSHIPS))
    gnn_model = GNN(n_features=512, n_hidden=256, n_classes=len(RELATIONSHIPS), dropout=0.5)
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    return {
        "yolo_model": yolo_model,
        "transformer_model": transformer_model,
        "gnn_model": gnn_model,
        "summarizer": summarizer
    }
