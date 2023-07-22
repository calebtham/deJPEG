import React from "react";
import { Link } from "react-router-dom";

/**
 * Page navbar
 * 
 * @returns {JSX.Element} The navbar
 */
export default function Navbar() {
    return (
        <nav className="fixed-top navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                {/* Logo */}
                <a className="navbar-brand" href="/">
                    deJPEG
                </a>

                {/* Toggler */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
