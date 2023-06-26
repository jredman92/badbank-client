import { useContext } from "react";
import { Store } from "../AppState/Store";
import Card from "../util/card";

export default function AllData() {
   const { state } = useContext(Store);

   return (
      <>
         <br />
         <hr className="solid"></hr>
         <h3>ALL DATA</h3>
         <Card
            maxWidth="45em"
            header="List of all user credentials and balances"
            bgcolor="secondary"
            body={
               <table className="table">
                  <thead>
                     <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Password</th>
                        <th>Balance</th>
                        <th>Transactions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {state.users.map((element, userIndex) => {
                        return (
                           <tr key={userIndex} style={{ color: "white" }}>
                              <td>{element.email}</td>
                              <td>{element.name}</td>
                              <td>{element.password}</td>
                              <td>${element.balance.toLocaleString()}</td>
                              <td>
                                 {element.transactions &&
                                    element.transactions.map(
                                       (transaction, index) => (
                                          <div key={index}>
                                             {transaction.type}: $
                                             {transaction.amount.toLocaleString()}
                                             <br />
                                             {new Date(
                                                transaction.date
                                             ).toLocaleTimeString()}
                                             <br />
                                             {new Date(
                                                transaction.date
                                             ).toLocaleDateString()}
                                             <hr />
                                          </div>
                                       )
                                    )}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            }
         />
         <br />
      </>
   );
}
