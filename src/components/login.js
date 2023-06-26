import { useFormik } from "formik";
import jwt_decode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";

export default function Login() {
   const { state, actions } = useContext(Store);
   const [showGoogleLogin, setShowGoogleLogin] = useState(true);

   function handleCallbackResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      var userObject = jwt_decode(response.credential);
      console.log(userObject);
      setShowGoogleLogin(false);

      // Automatically create an account for the user if logging in with Google
      const { email } = userObject;

      actions.logIn({ email }); // Log in the user after creating the account
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
         email: "",
         password: "",
      },
      onSubmit: async (values) => {
         try {
            await actions.logIn(values);
         } catch (error) {
            if (error.response && error.response.status === 404) {
               // User does not exist
               formik.setFieldError("email", "User does not exist");
            } else {
               // Other error occurred, handle it as needed
            }
         }
      },
      validate: (values) => {
         const errors = {};
         if (!values.email) {
            errors.email = "Required";
         } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
         ) {
            errors.email = "Invalid email address";
         }
         return errors;
      },
   });

   return (
      <>
         <br />
         <hr className="solid"></hr>
         <h3>{state.currentUser ? "PROFILE" : "LOGIN"}</h3>
         <Card
            bgcolor="primary"
            maxWidth="25em"
            header={
               state.currentUser
                  ? "Profile"
                  : "Login Using Existing Credentials"
            }
            body={
               !state.currentUser ? (
                  <div>
                     <form
                        onSubmit={formik.handleSubmit}
                        data-testid="login-form"
                     >
                        <div className="mb-3">
                           <div>Email</div>
                           <input
                              type="input"
                              className="form-control"
                              id="emlField"
                              name="email"
                              placeholder="Email"
                              onChange={formik.handleChange}
                              value={formik.values.email}
                              aria-label="email-field"
                           />
                           {formik.errors.email ? (
                              <Error
                                 maxWidth="10em"
                                 position={{ top: "3.5em", left: "21em" }}
                                 id="emailError"
                                 message={formik.errors.email}
                              />
                           ) : null}
                        </div>
                        <div className="mb-3">
                           <label htmlFor="pswField">Password</label>
                           <input
                              type="password"
                              className="form-control"
                              id="pswField"
                              name="password"
                              placeholder="Password"
                              onChange={formik.handleChange}
                              value={formik.values.password}
                              aria-label="password-field"
                           />
                           {formik.errors.password ? (
                              <Error
                                 id="emailError"
                                 message={formik.errors.password}
                              />
                           ) : null}
                        </div>
                        <button
                           type="submit"
                           className="btn btn-secondary"
                           id="submitBtn"
                           aria-label="login-button"
                        >
                           Login
                        </button>
                     </form>
                  </div>
               ) : (
                  // Success if a registered user
                  <div>
                     <div id="login-message">Login Successful!</div>
                     <br /> Hello, {state.currentUser.name}
                  </div>
               )
            }
         />

         <br />
         {showGoogleLogin && (
            <div className="google-account">
               <h6>Log In With Google</h6>
               <div id="signInDiv"></div>
            </div>
         )}
      </>
   );
}
