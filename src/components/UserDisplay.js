import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";

const UserDisplay = () => {
   const { state, dispatch } = useContext(Store);
   const { currentUser } = state;

   const handleSignOut = () => {
      dispatch({ type: "SIGNOUT" });
   };

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <div
         className="current-user"
         style={{
            position: "absolute",
            fontSize: isMobile ? "14px" : "18px",
            right: isMobile ? "-90px" : "5em",
            top: isMobile ? "-30px" : "-1.5em",
            padding: isMobile ? "" : "0px",
         }}
      >
         {currentUser && (
            <>
               <span
                  style={{
                     position: "absolute",
                     whiteSpace: isMobile ? "nowrap" : "nowrap",
                     right: isMobile ? "0em" : "-9em",
                  }}
               >
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
