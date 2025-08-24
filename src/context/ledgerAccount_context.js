import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useUserContext } from "./user_context"; // Your user context hook
import { API_BASE_URL } from "../utils/apiConfig"; // Your API base URL config

const LedgerAccountContext = createContext();

const initialState = {
  ledgerAccounts: [],
  isLoading: false,
  error: null,
};

function ledgerAccountReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, ledgerAccounts: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "RESET_ACCOUNTS":
      return initialState;
    default:
      return state;
  }
}

export const LedgerAccountProvider = ({ children }) => {
  const { user } = useUserContext();
  const [state, dispatch] = useReducer(ledgerAccountReducer, initialState);

  const resetLedgerAccounts = () => {
  dispatch({ type: "RESET_ACCOUNTS" });
};


  const fetchLedgerAccounts = async () => {
    if (!user?.results?.token) return;
    
    const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
    if (!membershipId) {
      dispatch({ type: "FETCH_ERROR", payload: "Membership ID not found" });
      return;
    }
  
    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/accounts/${membershipId}`, {
        headers: {
          Authorization: `Bearer ${user.results.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch ledger accounts");
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data.results || [] });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };
  

  useEffect(() => {
    if (user?.results?.token) {
      fetchLedgerAccounts();
    }
  }, [user]);

  const addLedgerAccount = async (newAccount) => {
    if (!user?.results?.token) return { success: false, message: "User not authenticated" };
    
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/accounts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        return { success: false, message: result.message || "Failed to add ledger account" };
      }
  
      await fetchLedgerAccounts();
      return { success: true, message: result.message || "Ledger account added successfully" };
  
    } catch (error) {
      console.error("Add ledger account error:", error);
      return { success: false, message: error.message || "Unknown error occurred" };
    }
  };
  
  const deleteLedgerAccount = async (accountId) => {
    if (!user?.results?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/ledger/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete ledger account");
      await fetchLedgerAccounts();
    } catch (error) {
      console.error("Delete ledger account error:", error);
    }
  };

  return (
    <LedgerAccountContext.Provider
      value={{
        ledgerAccounts: state.ledgerAccounts,
        isLoading: state.isLoading,
        error: state.error,
        fetchLedgerAccounts,
        addLedgerAccount,
        deleteLedgerAccount,
        resetLedgerAccounts,
      }}
    >
      {children}
    </LedgerAccountContext.Provider>
  );
};

export const useLedgerAccountContext = () => {
  return useContext(LedgerAccountContext);
};
