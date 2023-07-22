import React, { useState } from "react";
import axios from "axios";
import ReactCompareImage from "react-compare-image";
import BarChart from "../components/BarChart.js";
import ImageWrapper from "../components/ImageWrapper.js";
import Icon from "../components/Icon.js";

/**
 * App front page - upload images, view results
 * 
 * @returns {JSX.Element} The home page
 */
export default function Home() {
    let timer = null;
    const barChartSize = 300;

    const [inputImage, setInputImage] = useState(null); 
    const [inputImagePath, setInputImagePath] = useState(""); 

    const [compressionLbl, setCompressionLbl] = useState(""); 
    const [compressionPredictions, setCompressionPredictions] = useState([]); 
    const [compressionAllPredictions, setCompressionAllPredictions] = useState([]); 
    const [detectionTime, setDetectionTime] = useState(0); 

    const [resultImagePath, setResultImagePath] = useState(""); 
    const [restorationTime, setRestorationTime] = useState(0); 

    const [resultElapsedTime, setResultElapsedTime] = useState(null); 
    const [error, setError] = useState(null); 

    const [expandIcon, setExpandIcon] = useState("expand_more");

    /**
     * Displays/hides image uploaded/removed
     * @param {Event} e Event
     */
    function handleImageInput(e) {
        setError(null);

        // No image uploaded
        if (!(e.target.files[0] instanceof Blob)) {
            reset();
            return;
        }

        // Image uploaded
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setInputImagePath(reader.result);
        });
        setInputImage(e.target.files[0]);
        reader.readAsDataURL(e.target.files[0]);
    }

    /**
     * Sends uploaded image to backend for detection and restoration. Receives results.
     */
    function handleImageUpload() {
        if (!inputImage) {
            setError("Please select an image");
        } else {
            postForm("/detect_and_restore");
        }
    }

    /**
     * Sends uploaded image to backend
     */
    function handleForceRestore() {
        postForm("/force_restore");
    }

    /**
     * Display the compression level and (if relevant) the new processed image
     * @param {Object} result Result from API
     */
    function handleImageResults(result) {
        const mapping = ["No", "Single", "Double"];

        if (result.detectionTime) {
            setDetectionTime(roundNDP(result.detectionTime));
            setCompressionLbl(mapping[result.compression]);
            setCompressionPredictions(
                formatPrediction(result.compressionPredictions)
            );
            setCompressionAllPredictions(
                result.compressionAllPredictions.map(formatPrediction)
            );
        }

        setRestorationTime(roundNDP(result.restorationTime));

        if (result.imagePath) {
            setResultImagePath(`http://${result.imagePath}`);
        }
    }

    /**
     * Gets form data, posts using an API, and receives results to be handled
     * @param {String} endpoint API endpoing
     */
    function postForm(endpoint) {

        // Create form data
        const data = new FormData();
        data.append("image", inputImage);
        data.append("model", document.querySelector("#inputModel").value);

        // Send form data using POST
        setError(null);
        startTimer();
        const source = axios.CancelToken.source();
        axios
            .post(endpoint, data, {
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                },
                cancelToken: source.token
            })
            .then((res) => {
                handleImageResults(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError(err);
            })
            .finally(() => {
                stopTimer();
            });

        return () => {
            source.cancel();
            console.log("cancel")
        };
    }

    /**
     * @param {Number} num Number to round
     * @returns Number rounded to nearest N decimal places
     */
    function roundNDP(num, N = 3) {
        return parseFloat(num + Number.EPSILON).toFixed(N);
    }

    /**
     * Format compression prediction results
     * @param {Array} prediction Compression prediction results
     * @returns
     */
    function formatPrediction(prediction) {
        return [
            {
                arg: "Uncompressed",
                val: prediction[0],
            },
            {
                arg: "Single",
                val: prediction[1],
            },
            {
                arg: "Double",
                val: prediction[2],
            },
        ];
    }

    /**
     * Opens generated image in new tab
     */
    function saveImage() {
        window.open(resultImagePath);
    }

    /**
     * Start stopwatch. Time stored in resultElapsedTime
     */
    function startTimer() {
        var start = Date.now();
        timer = setInterval(() => {
            var delta = Date.now() - start;
            setResultElapsedTime(
                parseFloat(Math.floor(delta / 10) / 100).toFixed(2)
            );
        }, 31);
    }

    /**
     * Stop stopwatch
     */
    function stopTimer() {
        clearInterval(timer);
        setResultElapsedTime(null);
    }

    /**
     * Toggle hidden results
     */
    function toggleHide() {
        if (expandIcon === "expand_more") {
            setExpandIcon("expand_less");
        } else {
            setExpandIcon("expand_more");
        }

        if (expandIcon === "expand_more") {
            setTimeout(() => {
                document
                    .querySelector("#collapseResults")
                    .scrollIntoView({ block: "start" });
            }, 100);
        }
    }

    /**
     * Reset state variables
     */
    function reset() {
        setInputImage(null);
        setInputImagePath("");
        setResultImagePath("");
        setCompressionLbl("");
        setError(null);
        setCompressionPredictions([]);
        setCompressionAllPredictions([]);
        setDetectionTime(0);
        setRestorationTime(0);
        setExpandIcon("expand_more");
        document.querySelector("#inputImage").value = "";
    }

    return (
        <div className="col-12 col-md-8 col-lg-6 mx-auto">

            {/* If inputting an image - DOM elements will only be hidden for reference later */}
            <div className="mb-3" hidden={compressionLbl}>

                {/* Title */}
                <h1 className="m-5 text-center">deJPEG</h1>

                {/* Select model */}
                <div className="mb-3">
                    <label htmlFor="inputModel" className="form-label">
                        Restoration model
                    </label>
                    <select
                        id="inputModel"
                        className="form-select"
                        aria-label="Select restoration model"
                        defaultValue="postGAN"
                    >
                        <option value="postGAN">Small-PostGAN</option>
                        <option value="preGAN">Small-PreGAN</option>
                        <option value="resize">Small-PostGAN-Resize</option>
                        <option value="zhaopostGAN">Zhao-PostGAN</option>
                        <option value="zhaoproposed">Zhao-Original</option>
                    </select>
                </div>

                {/* Upload image */}
                <div className="mb-3">
                    <label htmlFor="inputImage" className="form-label">
                        Upload an image
                    </label>
                    <input
                        className="form-control"
                        type="file"
                        id="inputImage"
                        accept="image/png, image/jpg, image/tiff"
                        onChange={handleImageInput}
                    />
                </div>
            </div>

            {/* If inputting an image */}
            {!compressionLbl && (
                <div className="w-100 text-center">

                    {/* If image inputted */}
                    {inputImagePath && (
                        <ImageWrapper
                            image={
                                <img
                                    id="imageInputted"
                                    src={inputImagePath}
                                    alt="Input"
                                    className="img-fluid"
                                />
                            }
                            buttonHandler={handleImageUpload}
                            buttonIcon="file_upload"
                            elapsedTime={resultElapsedTime}
                        />
                    )}
                </div>
            )}

            {/* If have image results */}
            {compressionLbl && (
                <div className="w-100 text-center">
                    <p className="fw-bold">
                        {compressionLbl} compression detected
                    </p>

                    {/* If no compression detected */}
                    {!resultImagePath && (
                        <ImageWrapper
                            image={
                                <img 
                                    id="imageInputted" 
                                    src={inputImagePath} 
                                    alt="Input" 
                                    className="img-fluid"
                                />
                            }
                            buttonHandler={handleForceRestore}
                            buttonIcon="file_upload"
                            isDangerous={true}
                            elapsedTime={resultElapsedTime}
                        />
                    )}

                    {/* If compression detected */}
                    {resultImagePath && (
                        <ImageWrapper
                            image={
                                <ReactCompareImage
                                    leftImage={inputImagePath}
                                    leftImageLabel="Original"
                                    rightImage={resultImagePath}
                                    rightImageLabel="Generated"
                                    skeleton={
                                        <img
                                            id="imageInputted"
                                            src={inputImagePath}
                                            alt="Input"
                                            className="img-fluid"
                                        />
                                    }
                                />
                            }
                            buttonHandler={saveImage}
                            buttonIcon="file_download"
                            hasFullscreen={true}
                        />
                    )}

                    {/* Collapse detailed results */}
                    <div>
                        <button
                            onClick={toggleHide}
                            className="btn-clear toolbar w-100"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseResults"
                            aria-expanded="false"
                            aria-controls="collapseResults"
                        >
                            <Icon icon={expandIcon} addClass="text-primary fs-1 m-3" />
                        </button>
                    </div>

                    {/* Detailed results */}
                    <div className="collapse" id="collapseResults">
                        <p className="fw-bold p-0 m-3">Elapsed time</p>
                        <p className="p-0 m-0">
                            Detection: <code>{detectionTime}s</code>
                        </p>
                        <p className="p-0 m-0">
                            Restoration: <code>{restorationTime}s</code>
                        </p>

                        <p className="fw-bold p-0 m-3">All detection results</p>
                        <div
                            style={{
                                width: barChartSize + "px",
                                height: barChartSize + "px",
                            }}
                            className="m-auto"
                        >
                            <BarChart
                                data={compressionPredictions}
                                width={barChartSize}
                                height={barChartSize}
                            />
                        </div>

                        <p className="p-0 m-0 mt-3">
                            Individual square results
                        </p>

                        <div className="d-flex flex-wrap justify-content-center w-100">
                            {compressionAllPredictions.map((pred, index) => (
                                <div key={index} className="m-3">
                                    <BarChart
                                        data={pred}
                                        width={barChartSize / 4}
                                        height={barChartSize / 4}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="back">
                        <button
                            className="btn-clear text-primary"
                            onClick={reset}
                        >   
                            <Icon icon="arrow_back_ios" addClass="fs-7" />{" "}
                            <span className="fw-light">Back</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Error label */}
            {error && (
                <div className="text-center">
                    <p className="m-2 text-danger">
                        {error.message ? error.message : error}
                    </p>
                </div>
            )}
        </div>
    );
}
