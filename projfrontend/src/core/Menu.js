import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/helper';

const currentTab = (history, path) => {
    if(history.location.pathname === path){
        return {color: "#2ecc72"}
    } else {
        return {color: "#ffffff"}
    }
};

const Menu = ({history}) => {
    return(
        <div>
            <ul className="nav nav-tabs bg-dark">
                <li className="nav-item">
                    <Link to="/" className="nav-link" style={currentTab(history, "/")}>
                        Home
                    </Link> 
                </li>
                <li className="nav-item">
                    <Link to="/cart" className="nav-link" style={currentTab(history, "/cart")}>
                        Cart
                    </Link> 
                </li>
                <li className="nav-item">
                    <Link to="/user/dashboard" className="nav-link" style={currentTab(history, "/user/dashboard")}>
                        Dashboard
                    </Link> 
                </li>
                <li className="nav-item">
                    <Link to="/admin/dashboard" className="nav-link" style={currentTab(history, "/admin/dashboard")}>
                        Admin Dashboard
                    </Link> 
                </li>
                <li className="nav-item">
                    <Link to="/signup" className="nav-link" style={currentTab(history, "/signup")}>
                        Signup
                    </Link> 
                </li>
                <li className="nav-item">
                    <Link to="/signin" className="nav-link" style={currentTab(history, "/signin")}>
                        Sign in
                    </Link> 
                </li>
                {isAuthenticated() && (
                    <li className="nav-item">
                        <span className="nav-link text-warning" onClick={() => {
                            signout(() => {
                                history.push('/')
                            })
                        }}>
                            Signout
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default withRouter(Menu);