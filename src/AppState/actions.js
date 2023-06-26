/* eslint-disable no-console  */
import { findIndex } from "lodash";

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
   const logIn = (credentials) => {
      const { email, password } = credentials;

      // Check if the provided email and password match a user
      const regularUser = state.users.find(
         (user) => user.email === email && user.password === password
      );

      if (regularUser) {
         dispatch({
            type: "LOGIN",
            payload: { ...regularUser },
         });
      } else {
         // Check if the email matches a Google OAuth user
         const googleUser = state.users.find((user) => user.email === email);

         if (googleUser) {
            dispatch({
               type: "LOGIN",
               payload: { ...googleUser },
            });
         } else {
         }
      }
   };

   const logOut = () => {
      dispatch({
         type: "SIGNOUT",
      });
   };

   const withdraw = (amount) => {
      const userIndex = findIndex(
         state.users,
         (element) => element.email === state.currentUser.email
      );
      const newUsers = [...state.users];
      const user = newUsers[userIndex];

      const newTransaction = {
         type: "WITHDRAW",
         amount: amount,
         date: new Date(),
      };
      user.transactions.push(newTransaction);
      user.balance -= amount;
      dispatch({
         type: "UPDATE_USERS",
         payload: newUsers,
      });

      dispatch({
         type: "UPDATE_USER",
         payload: {
            ...state.currentUser,
            balance: state.currentUser.balance - amount,
         },
      });
   };

   const deposit = (amount) => {
      const userIndex = findIndex(
         state.users,
         (element) => element.email === state.currentUser.email
      );
      const newUsers = [...state.users];
      const user = newUsers[userIndex];

      if (!user.transactions) user.transactions = [];

      const newTransaction = {
         type: "DEPOSIT",
         amount: amount,
         date: new Date(),
      };

      user.transactions.push(newTransaction);
      user.balance += amount;

      dispatch({
         type: "UPDATE_USERS",
         payload: newUsers,
      });

      dispatch({
         type: "UPDATE_USER",
         payload: {
            ...state.currentUser,
            balance: state.currentUser.balance + amount,
         },
      });
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
