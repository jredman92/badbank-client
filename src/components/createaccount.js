import axios from "axios";
import { useFormik } from "formik";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";
import "./pages.css";

export default function CreateAccount() {
   const [show, setShow] = useState(true);
   const [showGoogleLogin, setShowGoogleLogin] = useState(true);

   const { actions } = useContext(Store);

   async function handleCallbackResponse(response) {
      var userObject = jwt_decode(response.credential);
      console.log(userObject);
      setShowGoogleLogin(false);

      // Create Google account

      const { email, name, googleId } = userObject;

      try {
         const accountData = { email, name, googleId };
         const response = await axios.post(
            // "http://localhost:5000/accounts",
            "https://badbankmit-630937f70977.herokuapp.com/accounts",
            accountData
         );
         console.log(response.status);
         actions.addUser({ email, name, balance: 0 }); // Add the user to the global state
         actions.setSuccess(true);
         setShow(false);
      } catch (error) {
         if (error.response) {
         }
      }
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

      // Create standard account

      onSubmit: async (values) => {
         try {
            actions.addUser({ ...values, balance: 0 });

            const response = await axios.post(
               "https://badbankmit-630937f70977.herokuapp.com/accounts",
               // "http://localhost:5000/accounts",
               values
            );

            console.log(response.status);

            setShow(false);
         } catch (error) {
            if (error.response) {
            }
         }
      },
      onReset: (values) => {
         setShow(true);
         actions.setSuccess(false);
      },
      validate: (values) => {
         const errors = {};

         // Password validation
         if (!values.password || values.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
         }

         // Email validation
         if (!values.email) {
            errors.email = "E-mail is required";
         }

         // Name validation
         if (!values.name) {
            errors.name = "Name is required";
         } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Not a valid e-mail";
         }

         return errors;
      },
   });

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <>
         {!isMobile && <hr className="solid" />}
         <h3>CREATE ACCOUNT</h3>

         <Card
            maxWidth={isMobile ? "20em" : "30em"}
            header="Create New Account"
            bgcolor="primary"
            body={
               show ? (
                  <form onSubmit={formik.handleSubmit}>
                     <label htmlFor="name">Name</label>
                     <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter Name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        autoComplete="name"
                     />
                     <br />
                     {formik.errors.name && (
                        <Error
                           position={{
                              top: "8.2em",
                              right: "1em",
                           }}
                           message={formik.errors.name}
                        />
                     )}

                     <label htmlFor="email">Email Address</label>
                     <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        autoComplete="email"
                     />
                     <br />
                     {formik.errors.email && (
                        <Error
                           position={{
                              top: "13.8em",
                              right: "1em",
                           }}
                           message={formik.errors.email}
                        />
                     )}

                     <label htmlFor="password">Password</label>
                     <input
                        type="password"
                        id="pswField"
                        name="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        aria-label="password-field"
                        autoComplete="current-password"
                     />
                     <br />

                     {formik.errors.password && (
                        <Error
                           position={{
                              top: "19.4em",
                              right: "1em",
                           }}
                           message={formik.errors.password}
                        />
                     )}
                     <div style={{ height: "33px" }}></div>
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
                        style={{ width: "200px" }}
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
         <br />
         {showGoogleLogin && (
            <div className="google-account">
               <h6>Create Account With Google</h6>
               <div id="signInDiv"></div>
               <br />
            </div>
         )}
      </>
   );
}
