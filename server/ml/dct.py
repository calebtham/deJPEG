# Acknowledgements:
#  Code based on: https://github.com/plok5308/DJPEG/blob/master/DJPEG_net.py
#  Implements a method proposed by: https://arxiv.org/abs/1708.00930

import math
import numpy as np
import tensorflow as tf


def cal_scale(p, q):
    if p == 0:
        ap = 1/(math.sqrt(8))
    else:
        ap = math.sqrt(0.25)
    if q == 0:
        aq = 1/(math.sqrt(8))
    else:
        aq = math.sqrt(0.25)

    return ap, aq


def cal_basis(p, q):
    basis = np.zeros((8, 8))
    ap, aq = cal_scale(p, q)
    for m in range(0, 8):
        for n in range(0, 8):
            basis[m, n] = ap*aq * \
                math.cos(math.pi*(2*m+1)*p/16)*math.cos(math.pi*(2*n+1)*q/16)

    return basis


def load_DCT_basis_64():
    basis_64 = np.zeros((8, 8, 64))
    idx = 0
    for i in range(8):
        for j in range(8):
            basis_64[:, :, idx] = cal_basis(i, j)
            idx = idx + 1
    return basis_64


def conv2d_8(x, W):
    return tf.nn.conv2d(x, W, strides=[1, 8, 8, 1], padding="SAME")


def get_DCT_features(imgs):
    x2 = conv2d_8(imgs, w_basis)  # Nx32x32x64

    gamma = 1e+06
    for b in range(-60, 61):
        x3 = tf.divide(tf.reduce_sum(tf.sigmoid(
            tf.scalar_mul(gamma, tf.subtract(x2, b))), [1, 2]), 1024)
        x3 = tf.reshape(x3, [-1, 1, 64])

        if b == -60:
            x4 = x3
        else:
            x4 = tf.concat([x4, x3], 1)

    x5 = x4[:, 0:120, :] - x4[:, 1:121, :]
    x6 = tf.reshape(x5, [-1, 120, 64, 1])  # Input for CNN

    return x6


DCT_basis_64 = load_DCT_basis_64()
np_basis = np.zeros((8, 8, 1, 64))
for i in range(64):
    np_basis[:, :, 0, i] = DCT_basis_64[:, :, i]

w_basis = tf.constant(np_basis)
