import React from "react";

/**
 * Spinner
 * 
 * @param {object} props The props object
 * @param {number} props.width Width of spinner
 * @param {number} props.height Height of spinner
 * @param {string} props.addClass Additional classes to add to spinner
 * 
 * @returns {JSX.Element} Spinner element
 */
export default function Spinner({
    width = 25,
    height = 25,
    addClass = "my-1 p-0 text-secondary",
}) {
    return (
        <span
            className={`spinner-border ${addClass}`}
            style={{ width: `${width}px`, height: `${height}px` }}
            role="status"
            aria-hidden="true"
        />
    );
}
