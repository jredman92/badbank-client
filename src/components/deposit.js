import { useFormik } from "formik";
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";
import Card from "../util/card";
import Error from "../util/error";

export default function Deposit() {
   const { state, actions } = useContext(Store);
   const isMobile = useMediaQuery({ maxWidth: 768 });

   const formik = useFormik({
      initialValues: {
         amount: 0,
      },

      onSubmit: async (values) => {
         const amount = parseFloat(values.amount);
         actions.deposit(amount);
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
                                          right: isMobile ? "8em" : "37.3em",
                                          top: isMobile ? "11.7em" : "14.9em",
                                       }}
                                       id="emailError"
                                       message={formik.errors.amount}
                                    />
                                 ) : null}
                              </div>
                           </div>
                        </div>
                        <br />
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
