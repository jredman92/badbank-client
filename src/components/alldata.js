import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Store } from "../AppState/Store";
import Card from "../util/card";

export default function AllData() {
   const { state } = useContext(Store);

   const isMobile = useMediaQuery({ maxWidth: 768 });

   return (
      <>
         <hr className="solid"></hr>
         <h3>ALL DATA</h3>
         <Card
            maxWidth={isMobile ? "100%" : "800px"} // Adjust the maxWidth property to make the card responsive
            header="List of all user credentials and balances"
            bgcolor="secondary"
            body={
               <div style={{ overflow: "auto" }}>
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
               </div>
            }
         />
         <br />
      </>
   );
}
