import tensorflow as tf
import numpy as np
from ml.util import tile_image, next_n

# Generator models
generator = {
    "postGAN": tf.keras.models.load_model('ml/models/gan/10/small-postgan'),
    "preGAN": tf.keras.models.load_model('ml/models/gan/10/small-pregan'),
    "resize": tf.keras.models.load_model('ml/models/gan/10/small-resize'),
    "zhaopostGAN": tf.keras.models.load_model('ml/models/gan/10/zhao-postgan'),
    "zhaoproposed": tf.keras.models.load_model('ml/models/gan/10/zhao-proposed')
}


def generate_restored_image(model, img):
    '''Returns the restored image from generator'''
    global postGAN, preGAN

    # Reshape image so it can be input
    h, w = img.shape[0], img.shape[1]
    tile_h = next_n(h, 16)
    tile_w = next_n(w, 16)
    img = tile_image(img, min_width=tile_w, min_height=tile_h, mode="RGB")

    # Normalize
    img = normalize(img[np.newaxis, ...])

    # Get prediction and denormalize
    prediction = generator[model](img, training=True)
    return denormalize(np.array(prediction[0])[:h, :w])


def normalize(images):
    '''Returns normalized images converting from [0,255] to [-1,1]'''
    images = (images / 127.5) - 1
    return images


def denormalize(images):
    '''Returns denormalized images (values from [0,256])'''
    images = (images + 1) * 127.5
    return images
