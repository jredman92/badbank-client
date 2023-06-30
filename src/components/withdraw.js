import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";

// import { valuesIn } from "lodash";
import "./pages.css";

export default function Withdraw() {
   const { state, actions } = useContext(Store);

   const formik = useFormik({
      initialValues: {
         amount: 0,
      },
      onSubmit: async (values) => {
         const email = state.currentUser.email;
         const amount = parseFloat(values.amount);
         console.log(amount);

         try {
            const response = await axios.post(
               "https://badbankmit-630937f70977.herokuapp.com//accounts/withdraw",
               // "http://localhost:5000/accounts/withdraw",
               { amount, email }
            );

            if (response.status === 200) {
               actions.withdraw(amount);
               actions.setSuccess(true);

               setTimeout(() => {
                  actions.setSuccess(false);
               }, 3000);
            } else {
               console.log("Withdrawal failed with status:", response.status);
            }
         } catch (error) {
            console.log("Error:", error);
            actions.setSuccess(false);
            actions.setError(true);

            setTimeout(() => {
               actions.setError(false);
            }, 3000);
         }
      },

      validate: (values) => {
         const errors = {};
         if (!values.amount || values.amount === "") {
            errors.amount = "Field Required";
         } else if (isNaN(parseFloat(values.amount))) {
            errors.amount = "Numerical Values Only";
         } else if (parseFloat(values.amount) <= 0) {
            errors.amount = "Positive Numbers Only";
         } else if (parseFloat(values.amount) > state.currentUser.balance) {
            errors.amount = "Insufficient funds";
         }
         return errors;
      },
   });

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <>
         <hr className="solid"></hr>
         <h3>WITHDRAW</h3>
         <Card
            maxWidth="50em"
            bgcolor="secondary"
            body={
               <>
                  {state.currentUser && (
                     <form onSubmit={formik.handleSubmit} id="withdraw-form">
                        <div className="mb-3">
                           <div className="row">
                              <div
                                 className="col"
                                 style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: isMobile ? "2em" : "4em",
                                 }}
                              >
                                 Balance: {state.currentUser.balance}
                              </div>
                           </div>
                           <br />
                           <div className="amount-container">
                              <div className="row">
                                 <h4>Withdraw Amount</h4>
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
                                    aria-label="withdraw-field"
                                    autoComplete="off"
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
                           Withdraw
                        </button>
                     </form>
                  )}
                  {!state.currentUser && <div>Must Be Logged-In</div>}
               </>
            }
         />
         <br />
         <div className="center">
            {state.error && (
               <Error
                  position={{
                     top: "19.2em",
                     left: "45em",
                  }}
                  message="Transaction Failed"
               />
            )}
         </div>
         <br />
      </>
   );
}
