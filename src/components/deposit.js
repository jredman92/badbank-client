import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";

export default function Deposit() {
   const { state, actions } = useContext(Store);

   const formik = useFormik({
      initialValues: {
         amount: 0,
      },

      onSubmit: async (values) => {
         const amount = parseFloat(values.amount);
         let email;
         console.log(amount);

         if (state.currentUser) {
            // If the user is logged in with a regular account
            email = state.currentUser.email;
         } else if (state.googleUser) {
            // If the user is logged in with a Google account
            email = state.googleUser.email;
         } else {
            // Handle the case where no user is logged in
            console.log("No user logged in");
            return;
         }

         try {
            const response = await axios.post(
               "https://badbankmit-630937f70977.herokuapp.com//accounts/deposit",
               // "http://localhost:5000/accounts/deposit",
               { amount, email }
            );

            if (response.status) {
               // Deposit successful, perform any necessary actions
               actions.deposit(amount);
               actions.setSuccess(true);

               setTimeout(() => {
                  actions.setSuccess(false);
               }, 3000);
            } else {
               // Handle deposit failure
               console.log("Deposit failed");
            }
         } catch (error) {
            // Handle network or other errors
            console.log("Error:", error);
            actions.setSuccess(false); // Set success to false
            actions.setError(true); // Set error to true

            setTimeout(() => {
               actions.setError(false);
            }, 3000);
         }
      },

      validate: (values) => {
         const errors = {};
         if (!values.amount || values.amount === "")
            errors.amount = "Field Required";
         if (values.amount !== "" && isNaN(parseFloat(values.amount)))
            errors.amount = "Numerical Values Only";
         if (values.amount < 0) errors.amount = "Positive Numbers Only";
         return errors;
      },
   });

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <>
         <hr className="solid"></hr>
         <h3>DEPOSIT</h3>
         <Card
            maxWidth="50em"
            bgcolor="secondary"
            body={
               <>
                  {state.currentUser && (
                     <form onSubmit={formik.handleSubmit} id="deposit-form">
                        <div className="mb-3">
                           <div className="row">
                              <div
                                 className="col"
                                 style={{
                                    display: "flex",
                                    fontSize: isMobile ? "2em" : "4em",
                                    justifyContent: "center",
                                 }}
                              >
                                 Balance: {state.currentUser.balance}
                              </div>
                           </div>
                           <br />
                           <div className="amount-container">
                              <div className="row">
                                 <h4>Deposit Amount</h4>
                              </div>
                              <div className="fields">
                                 <input
                                    style={{ width: "210px" }}
                                    type="text"
                                    className="form-control"
                                    id="amountField"
                                    name="amount"
                                    onChange={formik.handleChange}
                                    value={formik.values.amount}
                                    aria-label="deposit-field"
                                 />
                                 <br />
                                 {formik.errors.amount ? (
                                    <Error
                                       position={{
                                          top: "17.3em",
                                          right: "38em",
                                       }}
                                       id="emailError"
                                       message={formik.errors.amount}
                                    />
                                 ) : null}
                              </div>
                           </div>
                        </div>
                        <button
                           type="submit"
                           className="btn btn-primary submitBtn"
                           disabled={!(formik.isValid && formik.dirty)}
                        >
                           Deposit
                        </button>
                     </form>
                  )}
                  {!state.currentUser && <div>Must Be Logged-In</div>}
               </>
            }
         />
         <br />
         <br />
      </>
   );
}
