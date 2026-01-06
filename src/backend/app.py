import os
import torch
import torchvision.models as models
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import io
import json

app = Flask(__name__)
CORS(app)

# --- 1. FIXED MODEL LOADING ---

# The error indicated your weights (512 features) don't match ResNet50 (2048 features).
# We switch to resnet18 to match your resnet50.pth checkpoint data.
try:
    # Initialize the architecture that matches your 512-feature weights
    resnet_model = models.resnet18(weights=None)
    
    # Update the final layer to match the 100 classes in your checkpoint
    num_ftrs = resnet_model.fc.in_features # This will be 512
    resnet_model.fc = torch.nn.Linear(num_ftrs, 100) 

    # Load the weights
    checkpoint_path = "resnet50.pth" # Keeping your filename
    if os.path.exists(checkpoint_path):
        resnet_model.load_state_dict(torch.load(checkpoint_path, map_location='cpu'))
        resnet_model.eval()
        print("✅ ResNet Model loaded successfully.")
    else:
        print(f"⚠️ Warning: {checkpoint_path} not found.")
except Exception as e:
    print(f"❌ Error loading ResNet: {e}")

# --- 2. FIXED YOLO LOADING ---
# Added task="detect" to stop the warning
try:
    yolo_model = YOLO("yolov8n.pt", task="detect") 
    print("✅ YOLO Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading YOLO: {e}")

# --- 3. API ROUTES ---

@app.route('/')
def index():
    return jsonify({"status": "AeroIntel Backend Running", "project": "Airport Control"})

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    # YOLO Detection
    results = yolo_model(img)
    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                "class": r.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist()
            })

    return jsonify({
        "detections": detections,
        "message": "Detection complete"
    })

# Load class mapping at startup
with open('class_mapping.json', 'r') as f:
    CLASS_MAPPING = json.load(f)

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    # YOLO Detection
    results = yolo_model(img)
    detections = []
    
    if results and len(results) > 0:
        r = results[0]
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            img_width = img.width
            img_height = img.height
            
            detections.append({
                "class": r.names[int(box.cls)],
                "confidence": float(box.conf),
                "x": (x1 / img_width) * 100,
                "y": (y1 / img_height) * 100,
                "width": ((x2 - x1) / img_width) * 100,
                "height": ((y2 - y1) / img_height) * 100
            })

    return jsonify({
        "detections": detections,
        "count": len(detections)
    })

@app.route('/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    
    # Preprocess image for ResNet
    from torchvision import transforms
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    img_tensor = preprocess(img).unsqueeze(0)
    
    # Run inference
    with torch.no_grad():
        outputs = resnet_model(img_tensor)
        confidence = torch.nn.functional.softmax(outputs, dim=1)
        predicted_class_idx = confidence.argmax(1).item()
        confidence_score = float(confidence[0][predicted_class_idx].item())
        
        # Map to actual aircraft name
        aircraft_name = CLASS_MAPPING.get(str(predicted_class_idx), "Unknown")
    
    return jsonify({
        "variant": aircraft_name,
        "confidence": confidence_score,
        "class_id": predicted_class_idx
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)