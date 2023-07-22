import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

/**
 * 404 Not found page
 * 
 * @returns {JSX.Element} The 404 page
 */
export default function NotFound() {
    const history = useHistory();

    useEffect(() => {
        history.replace("/404"); // Redirect URL
    }, []);

    return (
        <div>
            <div>Not Found</div>
            <Link to="/">Back to home...</Link>
        </div>
    );
}
