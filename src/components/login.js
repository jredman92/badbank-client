import { useFormik } from "formik";
import jwt_decode from "jwt-decode";
import { useContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";

export default function Login() {
   const { state, actions } = useContext(Store);

   function handleCallbackResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      const userObject = jwt_decode(response.credential);
      console.log(userObject);

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
         actions.logIn(values);
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
         if (!values.password) {
            errors.password = "Must enter password";
         }

         return errors;
      },
   });

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <>
         <hr className="solid"></hr>
         <h3>{state.currentUser ? "WELCOME!" : "LOGIN"}</h3>

         <Card
            bgcolor="primary"
            maxWidth={isMobile ? "20em" : "30em"}
            header={
               state.currentUser ? "Login" : "Login Using Existing Credentials"
            }
            body={
               !state.currentUser ? (
                  <div>
                     <form
                        onSubmit={formik.handleSubmit}
                        data-testid="login-form"
                     >
                        <div className="mb-3">
                           <label htmlFor="email">Email</label>
                           <input
                              type="text"
                              id="emlField"
                              name="email"
                              placeholder="Email"
                              onChange={formik.handleChange}
                              value={formik.values.email}
                              aria-label="email-field"
                              autoComplete="username"
                           />
                           <div style={{ height: "10px" }} />

                           {formik.errors.email ? (
                              <Error
                                 maxWidth="10em"
                                 position={{ top: "8.3em", right: "1em" }}
                                 id="emailError"
                                 message={formik.errors.email}
                              />
                           ) : null}
                        </div>
                        <div className="mb-3">
                           <label htmlFor="pswField">Password</label>
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

                           <div style={{ height: "40px" }}></div>

                           {formik.errors.password ? (
                              <Error
                                 maxWidth="10em"
                                 position={{ top: "13.9em", right: "1em" }}
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

         <div className="google-account">
            <h6>Log In With Google</h6>
            <div id="signInDiv"></div>
            <br />
         </div>
      </>
   );
}
