import React from "react";
import Icon from "./Icon";

/**
 * FullscreenModal - display component as a bootstrap fullscreen modal
 *
 * @param {object} props The props object
 * @param {string} props.id HTML id of the component
 * @param {JSX.Element} props.component Component to be displayed as fullscreen
 * 
 * @returns {JSX.Element} The component in fullscreen
 */
export default function FullscreenModal({ id, component }) {
    return (
        <div
            className="modal"
            id={id}
            tabIndex="-1"
            aria-labelledby={id}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header p-2">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body p-0">{component}</div>
                </div>
            </div>
        </div>
    );
}

/**
 * FullscreenModalButton - Button to toggle fullscreen mode
 *
 * @param {object} props The props object
 * @param {string} props.id HTML id of the component to fullscreen
 * 
 * @returns {JSX.Element} The button toggler
 */
export function FullscreenModalButton({ id }) {
    return (
        <button
            className="btn-clear p-0 mt-2 mb-1"
            data-bs-toggle="modal"
            data-bs-target={`#${id}`}
        >
            <Icon icon="fullscreen" addClass="fs-2 text-secondary" />
        </button>
    );
}
