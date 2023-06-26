import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
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
         const email = state.currentUser.email; // Accesses state of current user

         try {
            const response = await axios.post(
               "https://badbank-jredman-38dc8ea94c94.herokuapp.com/accounts/deposit",
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

   return (
      <>
         <br />
         <hr className="solid"></hr>
         <h3>DEPOSIT</h3>
         <Card
            maxWidth="40em"
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
                                 <h4>Deposit Amount</h4>
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
                                    aria-label="deposit-field"
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
                                    Deposit
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
         <br />
      </>
   );
}
