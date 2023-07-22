import React from "react";

/**
 * About page
 * @returns {JSX.Element} The about page
 */
export default function About() {
    return (
        <div className="w-50 main">
            <h1 className="m-5 p-3">About</h1>
            <p>
                deJPEG is a tool that allows you to upload an image to detect
                whether it has undergone single, double, or no JPEG compression.
                If the image has been compressed, the image is subject to a JPEG
                artifact removal process to generated a new image that is more
                visually appealing image.
            </p>
            <h4 className="m-4">Detector</h4>
            <p>
                The JPEG compression detector is a convolutional neural network
                trained on images compressed with QFs from 10 to 90
                (specifically: 10, 30, 50, 70, and 90), including images that
                are double compressed (with the first compression being with
                QF=50). Therefore the detector is accurate for these QFs.
            </p>
            <h4 className="m-4">Restorer</h4>
            <p>
                The JPEG artifact remover is a generative adversarial network.
                For the website, we only include the generator network, since
                the discriminator network is used solely for training. From our
                research, we found that a restorer trained on both single and
                double compressed images resulted in a restorer that was
                effective for both types of compression, thus the restorer can
                handle both. However, we also found that a generalized restorer
                trained on a wide range of QFs was not very effective, and so we
                only include a restorer that was trained on images with QF=10.
                Therefore, it is most effective for QF=10.
            </p>
            <p>
                For experimental purposes, we also include different versions of
                the restorer. They are as follows:
                <br />
                <ul>
                    <li>
                        <b>Small-PostGAN</b>: Our proposed restorer, with
                        G_small architecture and our novel loss function, as
                        defined in our report, and trained with a NoGAN method
                        (after training with the discriminator).
                    </li>
                    <li>
                        <b>Small-PreGAN</b>: A NoGAN trained G_small model prior
                        to training with the discriminator. This means the model
                        is essentially a stand-alone generative CNN model.
                    </li>
                    <li>
                        <b>Small-Resize</b>: Similar to Small-PostGAN, but with
                        resize-convolution layers in place of transposed
                        convolution layers.
                    </li>
                    <li>
                        <b>Zhao-PostGAN</b>: Similar to Small-PostGAN, but with
                        G_Zhao architecture instead.
                    </li>
                    <li>
                        <b>Zhao-Original</b>: The model proposed by Zhao et al.,
                        although slightly modified to accept RGB images.
                    </li>
                </ul>
            </p>
        </div>
    );
}
