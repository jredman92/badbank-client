import React, { useContext } from "react";
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

   return (
      <div>
         {currentUser && (
            <div>
               Welcome, {currentUser.email}!
               <span
                  style={{
                     marginLeft: "1em",
                     color: "blue",
                     textDecoration: "underline",
                     cursor: "pointer",
                  }}
                  onClick={handleSignOut}
               >
                  Sign Out
               </span>
            </div>
         )}
      </div>
   );
};

export default UserDisplay;
