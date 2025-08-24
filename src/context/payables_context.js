import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useUserContext } from "./user_context";
import { API_BASE_URL } from "../utils/apiConfig";

const PayablesContext = createContext();

const initialState = {
  payables: [],
  isLoading: false,
  error: null,
};

function payablesReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, payables: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export const PayablesProvider = ({ children }) => {
  const { user } = useUserContext();
  const [state, dispatch] = useReducer(payablesReducer, initialState);

  const fetchPayables = async () => {
    if (!user?.results?.token) return;

    const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
    if (!membershipId) {
      dispatch({ type: "FETCH_ERROR", payload: "Membership ID not found" });
      return;
    }

    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch(`${API_BASE_URL}/payables`, {
        headers: {
          Authorization: `Bearer ${user.results.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch payables");
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data.results.payablesResult || [] });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    if (user?.results?.token) {
      fetchPayables();
    }
  }, [user]);

  return (
    <PayablesContext.Provider
      value={{
        payables: state.payables,
        isLoading: state.isLoading,
        error: state.error,
        fetchPayables
      }}
    >
      {children}
    </PayablesContext.Provider>
  );
};

export const usePayablesContext = () => {
  return useContext(PayablesContext);
};
