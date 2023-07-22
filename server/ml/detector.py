import random
import numpy as np
from scipy import stats
import cv2
import tensorflow as tf
from ml.dct import get_DCT_features
from ml.util import tile_image, next_n

NUM_SQUARES = 21
SQUARE_SIZE = 256
detector = tf.keras.models.load_model('ml/models/cnn/detector')


def detect_compression(img):
    '''Returns the compression level prediction and model prediction information'''
    global detector

    # Preprocess image
    img = get_YUV_image(img)
    img, n = get_squares(img)
    img = get_DCT_features(img)

    # Get prediction and map results
    prediction = detector.predict(img, verbose=0)
    return (
        int(stats.mode(np.argmax(prediction, axis=1))[0]),
        (np.sum(prediction, axis=0) / n).tolist(),
        np.array(prediction).tolist()
    )


def get_YUV_image(img):
    '''Returns Y component of an RGB image'''
    img = cv2.cvtColor(img, cv2.COLOR_RGB2YUV)
    img = img[:, :, :1]
    return img


def get_squares(img):
    '''Returns up to 21 random 256x256 squares from img, and the number of images returned'''
    height = img.shape[0]
    width = img.shape[1]

    assert height >= 8 and width >= 8, "Minimum image width or height is 8"

    #  If image smaller than 256, pad image
    if height < SQUARE_SIZE or width < SQUARE_SIZE:

        # Crop to multiple of 8
        cropped_img = img[:next_n(height-7, 8), :next_n(width-7, 8), :]

        #  Tile image
        return tile_image(cropped_img, min_width=SQUARE_SIZE, min_height=SQUARE_SIZE)[np.newaxis, ...], 1

    # If image larger than 256, partition image
    n = min((height // SQUARE_SIZE) * (width // SQUARE_SIZE), NUM_SQUARES)

    # Get partitions
    coords = [(x, y) for x in range(0, width-SQUARE_SIZE+1, SQUARE_SIZE)
              for y in range(0, height-SQUARE_SIZE+1, SQUARE_SIZE)]

    # Randomly shuffle the partitions
    random.shuffle(coords)

    # Get the first n partitions
    squares = [img[y:y+SQUARE_SIZE, x:x+SQUARE_SIZE] for x, y in coords[:n]]

    return np.array(squares), n
