import React from "react";
import { useState } from "react";
import FullscreenModal, { FullscreenModalButton } from "./FullscreenModal";
import Icon from "./Icon";
import Spinner from "./Spinner";

/**
 * ImageWrapper - Wrap an image element with functionality
 * 
 * @param {object} props The props object
 * @param {JSX.Element} props.image Image element
 * @param {Function} props.buttonHandler  Function for when button is pressed (main functionality of wrapper)
 * @param {string} props.buttonIcon Icon name for button
 * @param {boolean} props.isDangerous Whether the button is a dangerous action
 * @param {number} props.elapsedTime Elapsed time
 * @param {boolean} props.hasFullscreen Whether image can be fullscreened
 * 
 * @returns {JSX.Element} A React element of the image wrapped with functionality
 */
export default function ImageWrapper({
    image,
    buttonHandler = null,
    buttonIcon = "help_outline",
    isDangerous = false,
    elapsedTime = null,
    hasFullscreen = false,
}) {

    // Get HTML classes and content

    const buttonText = (() => {
        if (isDangerous) {
            return "Force restore";
        } else if (buttonIcon === "file_upload") {
            return "Detect and restore";
        } else if (buttonIcon === "file_download") {
            return "Download restored image";
        } else {
            return "";
        }
    })();

    const tooltipClass = (() => {
        let className = "";

        if (isDangerous) {
            className += "text-danger ";
        } else {
            className += "text-secondary ";
        }

        if (hasFullscreen) {
            className += "tooltip-left pt-2 m-1 mx-2";
        } else {
            className += "tooltip-right pb-2 m-1 mx-2";
        }

        return className;
    })();

    const toolbarClass = `toolbar ${
        hasFullscreen ? "d-flex flex-row-reverse" : "m-auto"
    }`;

    const buttonClass = `btn-clear mt-2 mb-1 ${hasFullscreen ? "" : "w-100"}`;

    const iconClass = `fs-2 ${isDangerous ? "text-danger" : "text-secondary"}`;

    const [tooltipText, setTooltipText] = useState(buttonText);

    /**
     * Handle when fullscreen button clicked
     */
    function handleFullscreenClick() {
        setTooltipText("");
    }

    /**
     * Handle when fullscreen button hovered
     */
    function handleFullscreenHover() {
        setTooltipText("Fullscreen");
    }

    /**
     * Handle when functionality button hovered
     */
    function handleButtonHover() {
        setTooltipText(buttonText);
    }

    return (
        <div className="shadow-sm mx-auto d-block mb-3 card card-body pb-0">
            {/* Image */}
            {image}

            {/* Toolbar */}
            {buttonHandler && (
                <div className={toolbarClass}>

                    {/* Loading */}
                    {elapsedTime && (
                        <div className="w-100 mt-2 mb-1">
                            <Spinner />
                            <Tooltip
                                addClass="tooltip-right pb-2 m-1 text-secondary"
                                mustHover={false}
                                content={
                                    <>
                                        (elapsed time:{" "}
                                        <code>{elapsedTime}s</code>)
                                    </>
                                }
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    {!elapsedTime && (
                        <>
                            {/* Fullscreen button */}
                            {hasFullscreen && (
                                <div onClick={handleFullscreenClick} onMouseEnter={handleFullscreenHover}>
                                    <FullscreenModalButton id="imageFullscreen" />
                                    <FullscreenModal
                                        id="imageFullscreen"
                                        component={image}
                                    />
                                </div>
                            )}

                            {/* Wrapper button */}
                            <button
                                onClick={buttonHandler}
                                onMouseEnter={handleButtonHover}
                                className={buttonClass}
                            >
                                <Icon icon={buttonIcon} addClass={iconClass} />
                            </button>

                            {/* Tooltip */}
                            <Tooltip
                                addClass={tooltipClass}
                                onClick={buttonHandler}
                                content={tooltipText}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Tooltip - help text on ImageWrapper
 * 
 * @param {object} props The props object
 * @param {string} props.addClass HTML class of tooltip
 * @param {string} props.content  Text of tooltip
 * @param {onClick} props.onClick Function for when tooltip is pressed
 * @param {boolean} props.mustHover Whether to add tooltip-hover class
 * 
 * @returns {JSX.Element} Tooltip for ImageWrapper
 */
function Tooltip({ addClass, content, onClick, mustHover = true }) {
    return (
        <p
            className={`${addClass} ${mustHover ? "tooltip-hover" : ""}`}
            onClick={onClick}
        >
            {content}
        </p>
    );
}
