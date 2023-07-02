/* eslint-disable no-console  */
import axios from "axios";
import { findIndex } from "lodash";
import Error from "../util/error";

export const useActions = (state, dispatch) => {
   // Creates a new user
   const addUser = (newUser) => {
      const newUsers = [...state.users];
      newUsers.push(newUser);
      dispatch({
         type: "ADD_USER",
         payload: newUsers,
      });
   };

   // Attempts to login with provided credentials
   const logIn = async (credentials) => {
      const { email, password } = credentials;

      try {
         // Fetch user data from MongoDB using email and password
         const response = await axios.get(
            "https://badbankmit-cdb124d9b6ac.herokuapp.com/login",

            // "http://localhost:5000/login",

            {
               params: {
                  email: email,
                  password: password,
               },
            }
         );

         const user = response.data;

         if (user) {
            // Update the user object with an empty transactions array if it doesn't exist
            if (!user.transactions) {
               user.transactions = [];
            }

            dispatch({
               type: "LOGIN",
               payload: user,
            });
         } else {
            // User not found or invalid credentials
            throw new Error("Invalid email or password");
         }
      } catch (error) {
         if (error.response && error.response.status === 404) {
            console.error("User not found");
         }
      }
   };

   const logOut = () => {
      dispatch({
         type: "SIGNOUT",
      });
   };

   const withdraw = async (amount) => {
      try {
         let email = state.currentUser.email;
         console.log(amount);

         const response = await axios.post(
            "https://badbankmit-cdb124d9b6ac.herokuapp.com/accounts/withdraw",

            // "http://localhost:5000/accounts/withdraw",
            { amount, email }
         );

         if (response.status) {
            const updatedUsers = [state.currentUser];
            const userIndex = findIndex(
               updatedUsers,
               (element) => element.email === state.currentUser.email
            );

            const currentUser = updatedUsers[userIndex];

            const newTransaction = {
               type: "WITHDRAW",
               amount: amount,
               date: new Date(),
            };
            currentUser.transactions.push(newTransaction);
            currentUser.balance -= amount;

            dispatch({
               type: "UPDATE_USERS",
               payload: updatedUsers,
            });

            dispatch({
               type: "UPDATE_USER",
               payload: currentUser,
            });
         } else {
            console.log("WIthdraw failed");
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };

   const deposit = async (amount) => {
      try {
         const email = state.currentUser.email;
         console.log(amount);

         const response = await axios.post(
            "https://badbankmit-cdb124d9b6ac.herokuapp.com/accounts/deposit",
            // "http://localhost:5000/accounts/deposit",
            { amount, email }
         );

         if (response.status) {
            // Deposit successful
            const updatedUsers = [state.currentUser];
            const userIndex = findIndex(
               updatedUsers,
               (element) => element.email === state.currentUser.email
            );

            const currentUser = updatedUsers[userIndex];

            if (!currentUser.transactions) {
               currentUser.transactions = [];
            }

            const newTransaction = {
               type: "DEPOSIT",
               amount: amount,
               date: new Date(),
            };

            currentUser.transactions.push(newTransaction);
            currentUser.balance += amount;

            updatedUsers[userIndex] = currentUser;

            dispatch({
               type: "UPDATE_USERS",
               payload: updatedUsers,
            });

            dispatch({
               type: "UPDATE_USER",
               payload: currentUser,
            });
         } else {
            console.log("Deposit failed");
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };

   const setSuccess = (value) => {
      dispatch({
         type: "SET_SUCCESS",
         payload: value,
      });
   };

   const setError = (value) => {
      dispatch({
         type: "SET_ERROR",
         payload: value,
      });
   };

   return {
      logOut,
      addUser,
      logIn,
      withdraw,
      deposit,
      setSuccess,
      setError,
   };
};
