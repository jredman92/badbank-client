import axios from "axios";
import { useFormik } from "formik";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";
import "./pages.css";

export default function CreateAccount() {
   const [show, setShow] = useState(true);
   const [showGoogleLogin, setShowGoogleLogin] = useState(true);

   const { actions } = useContext(Store);

   function handleCallbackResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      var userObject = jwt_decode(response.credential);
      console.log(userObject);
      setShowGoogleLogin(false);

      // Automatically create an account for the user if logging in with Google
      const { email, name } = userObject;
      actions.addUser({ email, name, balance: 0 }); // Set balance to 0
      actions.logIn({ email }); // Log in the user after creating the account

      actions.setSuccess(true); // Show the success message
      setShow(false); // Hide the form
   }

   useEffect(() => {
      if (typeof google !== "undefined") {
         /* global google */
         google.accounts.id.initialize({
            client_id:
               "1094822492534-djacotkfujd830p2b2l28s25dat8cjfc.apps.googleusercontent.com",
            callback: handleCallbackResponse,
         });

         google.accounts.id.renderButton(document.getElementById("signInDiv"), {
            theme: "outline",
            size: "large",
         });
      }
      // eslint-disable-next-line
   }, []);

   const formik = useFormik({
      initialValues: {
         name: "",
         email: "",
         password: "",
      },
      onSubmit: async (values, { resetForm }) => {
         try {
            // Add the user to the global state
            actions.addUser({ ...values, balance: 0 });
            // Send a POST request to create a new account
            const response = await axios.post(
               "https://badbank-jredman-38dc8ea94c94.herokuapp.com/accounts",
               // "http://localhost:5000/accounts",
               values
            );

            // Account creation successful
            console.log(response); // You can handle the response data as needed

            resetForm();
            setShow(false); // Hide the form
         } catch (error) {
            // Account creation failed
            if (error.response) {
               // The request was made and the server responded with a status code
               console.log("Response status:", error.response.status);
               console.log("Response data:", error.response.data);
               // Handle specific errors based on the status code
               if (error.response.status === 400) {
                  // Handle validation errors
                  const validationErrors = error.response.data.errors;
                  console.log("Validation errors:", validationErrors);
                  // Display user-friendly error messages for validation errors
               } else if (error.response.status === 401) {
                  // Handle unauthorized errors
                  console.log("Unauthorized error");
                  // Display user-friendly error message for unauthorized error
               } else {
                  // Handle other HTTP errors
                  console.log(
                     "Account creation failed with status:",
                     error.response.status
                  );
                  // Display a generic error message for other errors
               }
            } else if (error.request) {
               // The request was made but no response was received
               console.log("No response received:", error.request);
               // Handle the error condition when no response is received
            } else {
               // Other error occurred during the request
               console.log("Error:", error.message);
               // Handle other types of errors
            }
         }
      },
      onReset: (values) => {
         // Reset the form and show it again
         setShow(true);
         actions.setSuccess(false);
      },
      validate: (values) => {
         // Validation logic
      },
   });

   return (
      <>
         <br />
         <hr className="solid" />
         <h3>CREATE ACCOUNT</h3>

         <Card
            maxWidth="25em"
            header="Create New Account"
            bgcolor="primary"
            body={
               show ? (
                  <form onSubmit={formik.handleSubmit}>
                     Name
                     <br />
                     <input
                        type="input"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter Name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                     />
                     <br />
                     {formik.errors.name ? (
                        <Error
                           position={{ top: "3.6em", left: "21em" }}
                           message={formik.errors.name}
                        />
                     ) : null}
                     Email Address
                     <br />
                     <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                     />
                     <br />
                     {formik.errors.email ? (
                        <Error
                           position={{ top: "9.5em", left: "21em" }}
                           message={formik.errors.email}
                        />
                     ) : null}
                     Password
                     <br />
                     <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                     />
                     <br />
                     {formik.errors.password ? (
                        <Error
                           position={{ top: "15.2em", left: "21em" }}
                           message={formik.errors.password}
                        />
                     ) : null}
                     <button
                        type="submit"
                        className="btn btn-light"
                        id="submitBtn"
                        disabled={!(formik.isValid && formik.dirty)}
                     >
                        Create Account
                     </button>
                  </form>
               ) : (
                  <>
                     <h5>Success</h5>
                     <button
                        type="submit"
                        className="btn btn-light"
                        onClick={formik.handleReset}
                     >
                        Add Another Account
                     </button>
                  </>
               )
            }
         />
         {showGoogleLogin && (
            <div className="google-account">
               <h6>Create Account With Google</h6>
               <div id="signInDiv"></div>
            </div>
         )}
         <br />
      </>
   );
}
