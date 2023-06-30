import bank from "./bank.png";
import "./pages.css";

export default function Home() {
   return (
      <div className="home-container">
         <hr className="solid"></hr>
         <br />
         <div className="home-card">
            <div className="row g-0">
               <div className="col-md-4">
                  <img
                     src={bank}
                     className="img-fluid rounded-start"
                     alt="..."
                  />
               </div>
               <div className="col-md-8">
                  <div className="card-body">
                     <h5
                        style={{ textDecoration: "underline" }}
                        className="card-title"
                     >
                        Bad Bank
                     </h5>
                     <p className="card-text">Welcome to your Bad Bank</p>
                  </div>
               </div>
            </div>
         </div>
         <br />
      </div>
   );
}
