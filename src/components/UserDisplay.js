import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { Store } from "../AppState/Store";

const UserDisplay = () => {
   const { state, dispatch } = useContext(Store);
   const { currentUser } = state;

   const navigate = useNavigate();

   const handleSignOut = () => {
      dispatch({ type: "SIGNOUT" });
      navigate("/login"); // Redirect to the login page
   };

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <div
         className="current-user"
         style={{
            position: "absolute",
            fontSize: isMobile ? "14px" : "18px",
            right: isMobile ? "-90px" : "6em",
            top: isMobile ? "-30px" : "-10px",
            padding: isMobile ? "" : "0px",
            maxWidth: isMobile ? "" : "100px",
         }}
      >
         {currentUser && (
            <>
               <span style={{ whiteSpace: isMobile ? "nowrap" : "nowrap" }}>
                  Welcome, {currentUser.email}!
               </span>
               <br />
               <span
                  style={{
                     position: "absolute",
                     fontSize: isMobile ? "12px" : "14px",
                     whiteSpace: isMobile ? "nowrap" : "nowrap",
                     right: isMobile ? "0em" : "-11.3em",
                     color: "blue",
                     textDecoration: "underline",
                     cursor: "pointer",
                  }}
                  onClick={handleSignOut}
               >
                  Sign Out
               </span>
            </>
         )}
      </div>
   );
};

export default UserDisplay;
