import { Route, Routes } from "react-router-dom";

import NavBar from "./navbar";

import AllData from "./components/alldata";
import CreateAccount from "./components/createaccount";
import Deposit from "./components/deposit";
import Home from "./components/home";
import Login from "./components/login";
import Withdraw from "./components/withdraw";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
   return (
      <>
         <NavBar />
         <div className="container">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/CreateAccount/" element={<CreateAccount />} />
               <Route path="/login/" element={<Login />} />
               <Route path="/deposit/" element={<Deposit />} />
               <Route path="/withdraw/" element={<Withdraw />} />
               <Route path="/alldata/" element={<AllData />} />
            </Routes>
            <hr className="solid"></hr>
         </div>
      </>
   );
}
