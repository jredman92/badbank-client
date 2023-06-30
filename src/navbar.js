import React from "react";
import { NavLink } from "react-router-dom";
import UserDisplay from "./components/UserDisplay";

export default function Navbar() {
   const navLinkStyles = ({ isActive }) => {
      return {
         fontWeight: isActive ? "bold" : "normal",
         textDecoration: isActive ? "underline" : "none",
      };
   };

   return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <div className="container-fluid">
            <NavLink
               style={navLinkStyles}
               title="Bad Bank Home"
               className="navbar-brand"
               to="/"
            >
               Bad Bank
            </NavLink>
            <button
               className="navbar-toggler"
               type="button"
               data-bs-toggle="collapse"
               data-bs-target="#navbarNavAltMarkup"
               aria-controls="navbarNavAltMarkup"
               aria-expanded="false"
               aria-label="Toggle navigation"
            >
               <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
               <div className="navbar-nav">
                  <NavLink
                     style={navLinkStyles}
                     title="Welcome to the home page of the Bad Bank"
                     className="nav-link"
                     to="/"
                  >
                     Home
                  </NavLink>
                  <NavLink
                     title="Login to your account"
                     style={navLinkStyles}
                     className="nav-link"
                     to="/login"
                  >
                     Login
                  </NavLink>
                  <NavLink
                     title="Withdraw money from your account"
                     style={navLinkStyles}
                     className="nav-link"
                     to="/withdraw"
                  >
                     Withdraw
                  </NavLink>
                  <NavLink
                     title="Deposit money into your account"
                     style={navLinkStyles}
                     className="nav-link"
                     to="/deposit"
                  >
                     Deposit
                  </NavLink>
                  <NavLink
                     title="You'll find a list of all registered users here"
                     style={navLinkStyles}
                     className="nav-link"
                     to="/alldata"
                  >
                     All Data
                  </NavLink>
                  <NavLink
                     title="Create an account with us"
                     style={navLinkStyles}
                     className="nav-link"
                     to="/createaccount"
                  >
                     Create Account
                  </NavLink>
               </div>
            </div>
         </div>
         <div className="user-display-container">
            <UserDisplay />
         </div>
      </nav>
   );
}
