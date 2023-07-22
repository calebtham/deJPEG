import numpy as np
import tensorflow as tf
from PIL import Image


def next_n(num, n):
    '''Returns num rounded to the next multiple of n'''
    return n * ((num-1) // n) + n


def tile_image(img, min_width=64, min_height=64, mode='L'):
    '''Returns a tiled image to fill the minimum size given'''

    if mode == 'L':
        img = img[:, :, 0]

    im = Image.fromarray(img, mode)
    width, height = im.size

    new_im = Image.new(mode, (max(width, min_width), max(height, min_height)))
    w, h = new_im.size

    for i in range(0, w, width):
        for j in range(0, h, height):
            new_im.paste(im, (i, j))

    if mode == 'L':
        return np.reshape(new_im, (w, h, 1))
    else:
        return np.array(new_im)