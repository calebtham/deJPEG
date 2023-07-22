import React from "react";
import Chart, { Legend, Series, Animation, Size } from "devextreme-react/chart";

/**
 * BarChart
 * 
 * @param {object} props The props object
 * @param {string} props.title Chart title
 * @param {Array} props.data  Chart data
 * @param {number} props.width Chart width
 * @param {number} props.height Chart height
 * @param {color} props.color Chart colour
 * 
 * @returns {JSX.Element} The barchart
 */
export default function BarChart({
    title,
    data,
    width = undefined,
    height = undefined,
    color = "#0d6efd",
}) {
    return (
        <Chart title={title} dataSource={data} id="chart">
            <Series type="bar" color={color} />
            <Legend visible={false} />
            <Animation enabled={false} />
            <Size height={height} width={width} />
        </Chart>
    );
}
