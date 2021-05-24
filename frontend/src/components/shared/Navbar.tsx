import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar: React.FC = () => {

    const logo = "https://uploads-ssl.webflow.com/6006f58a9bc1bb84abf7f9b6/607f2886229e2c2762d97f79_Logo.png";

    return <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                <img src={logo} alt="logo-melonn" width="150" />
            </Link>
            {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/sell-orders" className="nav-link active" aria-current="page">Create</Link>
                    </li>
                </ul>
            </div> */}
        </div>
    </nav>
}
