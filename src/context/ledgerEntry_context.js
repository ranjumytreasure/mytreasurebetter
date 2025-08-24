import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useUserContext } from "./user_context";
import { API_BASE_URL } from "../utils/apiConfig";

const LedgerEntryContext = createContext();

const initialState = {
  ledgerEntries: [],
  isLoading: false,
  error: null,
  page: 1,
  limit: 20,
  totalPages: 1,
};

function ledgerEntryReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        ledgerEntries: action.payload.entries,
        totalPages: action.payload.totalPages,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload };
    default:
      return state;
  }
}

export const LedgerEntryProvider = ({ children }) => {
  const { user } = useUserContext();
  const [state, dispatch] = useReducer(ledgerEntryReducer, initialState);

  const fetchLedgerEntries = async (filters = {}) => {
    if (!user?.results?.token) return;

    const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
    if (!membershipId) {
      dispatch({ type: "FETCH_ERROR", payload: "Membership ID not found" });
      return;
    }

    dispatch({ type: "FETCH_START" });

    try {
      const queryParams = new URLSearchParams({
      
        page: state.page,
        limit: state.limit,
        ...(filters.startDate ? { startDate: filters.startDate } : {}),
        ...(filters.endDate ? { endDate: filters.endDate } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.entryType ? { entryType: filters.entryType } : {}),
      });
      

      const res = await fetch(`${API_BASE_URL}/ledger/entry/${membershipId}?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${user.results.token}`,
        },
      });
      

      if (!res.ok) throw new Error("Failed to fetch ledger entries");
      const data = await res.json();

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          entries: data.results || [],
          totalPages: data.totalPages || 1,
        },
      });

    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    if (user?.results?.token) {
      fetchLedgerEntries();
    }
  }, [user, state.page, state.limit]);

  const addLedgerEntry = async (newEntry) => {
    if (!user?.results?.token) return { success: false, message: "User not authenticated" };

    try {
      const res = await fetch(`${API_BASE_URL}/ledger/entry`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

    
      return res;
    

    } catch (error) {
      return { success: false, message: error.message || "Unknown error occurred" };
    }
  };

  const deleteLedgerEntry = async (entryId) => {
    if (!user?.results?.token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/ledger/entry/${entryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete ledger entry");
      await fetchLedgerEntries();

    } catch (error) {
      console.error("Delete ledger entry error:", error);
    }
  };

  const setPage = (page) => dispatch({ type: "SET_PAGE", payload: page });
  const setLimit = (limit) => dispatch({ type: "SET_LIMIT", payload: limit });

  return (
    <LedgerEntryContext.Provider
      value={{
        ledgerEntries: state.ledgerEntries,
        isLoading: state.isLoading,
        error: state.error,
        page: state.page,
        limit: state.limit,
        totalPages: state.totalPages,
        fetchLedgerEntries,
        addLedgerEntry,
        deleteLedgerEntry,
        setPage,
        setLimit,
      }}
    >
      {children}
    </LedgerEntryContext.Provider>
  );
};

export const useLedgerEntryContext = () => useContext(LedgerEntryContext);



// import React, { createContext, useReducer, useContext, useEffect } from "react";
// import { useUserContext } from "./user_context";
// import { API_BASE_URL } from "../utils/apiConfig";

// const LedgerEntryContext = createContext();

// const initialState = {
//   ledgerEntries: [],
//   isLoading: false,
//   error: null,
// };

// function ledgerEntryReducer(state, action) {
//   switch (action.type) {
//     case "FETCH_START":
//       return { ...state, isLoading: true, error: null };
//     case "FETCH_SUCCESS":
//       return { ...state, isLoading: false, ledgerEntries: action.payload };
//     case "FETCH_ERROR":
//       return { ...state, isLoading: false, error: action.payload };
//     default:
//       return state;
//   }
// }

// export const LedgerEntryProvider = ({ children }) => {
//   const { user } = useUserContext();
//   const [state, dispatch] = useReducer(ledgerEntryReducer, initialState);

//   const fetchLedgerEntries = async (filters = {}, page = 1, limit = 20) => {
//     if (!user?.results?.token) return;
  
//     const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
//     if (!membershipId) {
//       dispatch({ type: "FETCH_ERROR", payload: "Membership ID not found" });
//       return;
//     }
  
//     dispatch({ type: "FETCH_START" });
  
//     try {
//       const queryParams = new URLSearchParams({
//         membershipId,
//         page,
//         limit,
//         ...filters, // dynamically adds filters like {entryType: 'Auction'}
//       });
  
//       const res = await fetch(`${API_BASE_URL}/ledger/entry?${queryParams.toString()}`, {
//         headers: {
//           Authorization: `Bearer ${user.results.token}`,
//         },
//       });
  
//       if (!res.ok) throw new Error("Failed to fetch ledger entries");
//       const data = await res.json();
  
//       dispatch({ type: "FETCH_SUCCESS", payload: data.results || [] });
  
//     } catch (error) {
//       dispatch({ type: "FETCH_ERROR", payload: error.message });
//     }
//   };
  

//   useEffect(() => {
//     if (user?.results?.token) {
//       fetchLedgerEntries();
//     }
//   }, [user]);

//   const addLedgerEntry = async (newEntry) => {
//     if (!user?.results?.token) return { success: false, message: "User not authenticated" };
//     console.log("Sending ledger entry data:", newEntry);
//     try {
//       const res = await fetch(`${API_BASE_URL}/ledger/entry`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${user.results.token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newEntry),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         return { success: false, message: result.message || "Failed to add ledger entry" };
//       }

//       await fetchLedgerEntries();
//       return { success: true, message: result.message || "Ledger entry added successfully" };

//     } catch (error) {
//       console.error("Add ledger entry error:", error);
//       return { success: false, message: error.message || "Unknown error occurred" };
//     }
//   };

//   const deleteLedgerEntry = async (entryId) => {
//     if (!user?.results?.token) return;

//     try {
//       const res = await fetch(`${API_BASE_URL}/ledger/entry/${entryId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${user.results.token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete ledger entry");
//       await fetchLedgerEntries();

//     } catch (error) {
//       console.error("Delete ledger entry error:", error);
//     }
//   };

//   return (
//     <LedgerEntryContext.Provider
//       value={{
//         ledgerEntries: state.ledgerEntries,
//         isLoading: state.isLoading,
//         error: state.error,
//         fetchLedgerEntries,
//         addLedgerEntry,
//         deleteLedgerEntry,
//       }}
//     >
//       {children}
//     </LedgerEntryContext.Provider>
//   );
// };

// export const useLedgerEntryContext = () => useContext(LedgerEntryContext);
