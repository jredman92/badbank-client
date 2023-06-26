import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
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

         try {
            const response = await axios.post(
               "https://badbankmit-e7fce5c065f0.herokuapp.com/accounts/withdraw",
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

   return (
      <>
         <br />
         <hr className="solid"></hr>
         <h3>WITHDRAW</h3>
         <Card
            maxWidth="40em"
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
                                    fontSize: "100px",
                                    marginTop: "-40px",
                                 }}
                              >
                                 Balance:{" "}
                              </div>
                              <div
                                 className="col"
                                 id="user-balance"
                                 style={{
                                    fontSize: "100px",
                                    marginTop: "-40px",
                                 }}
                              >
                                 {state.currentUser.balance}
                              </div>
                           </div>
                           <div className="amount-container">
                              <div className="row">
                                 <h4>Withdraw Amount</h4>
                              </div>
                              <div className="fields">
                                 <input
                                    style={{ width: "300px" }}
                                    type="text"
                                    className="form-control"
                                    id="amountField"
                                    name="amount"
                                    onChange={formik.handleChange}
                                    value={formik.values.amount}
                                    aria-label="withdraw-field"
                                 />
                                 <br />
                                 {formik.errors.amount ? (
                                    <Error
                                       position={{
                                          top: "11.2em",
                                          left: "21em",
                                       }}
                                       id="emailError"
                                       message={formik.errors.amount}
                                    />
                                 ) : null}
                                 <button
                                    type="submit"
                                    className="btn btn-primary"
                                    id="submitBtn"
                                    disabled={!(formik.isValid && formik.dirty)}
                                 >
                                    Withdraw
                                 </button>
                              </div>
                           </div>
                        </div>
                     </form>
                  )}
                  {!state.currentUser && <div>Must Be Logged-In</div>}
               </>
            }
         />
         <br />
         {state.success && (
            <div
               className={"alert alert-success mx-auto w-25 p-2"}
               role="alert"
               style={{ height: "110px" }}
            >
               <p className="fs-1 text-center">Success!</p>
            </div>
         )}
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
