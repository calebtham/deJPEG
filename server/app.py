# Imports
from flask import Flask, request
import numpy as np
import cv2
from ml.detector import detect_compression
from ml.restorer import generate_restored_image
from time import time

# Set number of images to be stored on server
MAX_IMAGES = 30
iter = MAX_IMAGES

# Initialise flask app
app = Flask(__name__, static_url_path='/static')

# ============================#
# Define API endpoints
# ============================#


@app.route("/detect_and_restore", methods=["POST"])
def detect_and_restore():
    '''Receive an image and process it'''

    model, img = get_form_data(request)

    # Compression detection
    detector_time = -time()
    compression_level, compression_predictions, compression_all_predictions = detect_compression(
        img
    )
    detector_time += time()

    # Image restoration
    restorater_time = -time()
    path = restore_image(model, img) if compression_level > 0 else ""
    restorater_time += time()

    return {
        "compressionAllPredictions": compression_all_predictions,
        "compressionPredictions": compression_predictions,
        "compression": compression_level,
        "detectionTime": detector_time,
        "imagePath": path,
        "restorationTime": restorater_time
    }


@app.route("/force_restore", methods=["POST"])
def force_restore():
    '''Receive an image and process it'''

    model, img = get_form_data(request)

    # Image restoration
    restorater_time = -time()
    path = restore_image(model, img)
    restorater_time += time()

    return {
        "imagePath": path,
        "restorationTime": restorater_time
    }


def restore_image(model, img):
    '''Restores the image with a given model and returns the image path'''

    global iter, MAX_IMAGES

    # Get restored image
    img = generate_restored_image(model, img)

    # Save image
    iter = (iter + 1) % MAX_IMAGES
    path = f"static/images/{iter}.png"
    cv2.imwrite(path, img)
    path = request.host + "/" + path

    return path


def get_form_data(request):
    '''Given a request, return the model and image input'''

    # Read form data
    model = request.form.get("model")
    imagefile = request.files.get("image").read()

    # Get image
    nparr = np.frombuffer(imagefile, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)

    return model, img


# Run program
if __name__ == "__main__":
    app.run(debug=True)
