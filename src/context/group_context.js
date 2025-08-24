
// import { createContext, useContext, useReducer } from 'react';
// import React from 'react';

// const GroupDetailsContext = createContext();

// const initialState = {
//     data: null,
//     // other initial state properties...
// };

// const groupDetailsReducer = (state, action) => {
//     switch (action.type) {
//         case 'SET_DATA':
//             return { ...state, data: action.payload };
//         // handle other actions as needed...
//         default:
//             return state;
//     }
// };

// export const GroupDetailsProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(groupDetailsReducer, initialState);

//     return (
//         <GroupDetailsContext.Provider value={{ state, dispatch }}>
//             {children}
//         </GroupDetailsContext.Provider>
//     );
// };


// export const useGroupDetailsContext = () => {
//     return useContext(GroupDetailsContext);
// };

// context/group_context.js
import React, { createContext, useReducer, useContext } from "react";
import { useUserContext } from "./user_context";
import { API_BASE_URL } from "../utils/apiConfig";
import { toast } from "react-toastify";

const GroupDetailsContext = createContext();

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  subscribers: [],
  noofSubscriber: 0,
  noofCompanySubscriber: 0

};

function groupDetailsReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };
    case "FETCH_SUBSCRIBERS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        subscribers: action.payload.subscriberList || [],
        noofSubscriber: action.payload.noofSubscriber || 0,
        noofCompanySubscriber: action.payload.noofCompanySubscriber || 0,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export const GroupDetailsProvider = ({ children }) => {
  const { user } = useUserContext();
  const [state, dispatch] = React.useReducer(
    groupDetailsReducer,
    initialState
  );

  const fetchGroups = async (groupId) => {
    if (!user?.results?.token || !groupId) return;

    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch(`${API_BASE_URL}/users/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  const fetchSubscribers = async (groupId) => {
    if (!user?.results?.token || !groupId) return;

    dispatch({ type: "FETCH_START" });
    try {
      const apiUrl = `${API_BASE_URL}/groups/${groupId}/subscribers`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.results?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscribers");
      }

      const data = await response.json();

      dispatch({
        type: "FETCH_SUBSCRIBERS_SUCCESS",
        payload: {
          subscriberList: data?.results?.subscriberList || [],
          noofSubscriber:
            data?.results?.subscriberCountList?.[0]?.No_of_Sub_Pending || 0,
          noofCompanySubscriber:
            data?.results?.compSubCountList?.[0]
              ?.no_of_company_subcribers || 0,
        },
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

const deleteGroupSubscriber = async (id, groupId) => {
  if (!id) {
    return { success: false, message: "Subscriber ID is required" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/groupsubscribers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.results?.token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      // Refresh group data and subscribers
      if (groupId) {
        await fetchGroups(groupId);
        
      }

      return { success: true, message: "Subscriber removed successfully" };
    } else {
      const errorRes = await res.json();
      return { success: false, message: errorRes.message || "Failed to delete subscriber" };
    }
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { success: false, message: "An error occurred while deleting subscriber" };
  }
};



 const deleteGroupSubscriberbyCompositekey = async (
  groupId,
  subscriberId,
  groupSubscriberId
) => {
  if (!groupId || !subscriberId || !groupSubscriberId) {
    return { success: false, message: "Missing required IDs for deletion" };
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/groupsubscribers/${groupId}/${subscriberId}/${groupSubscriberId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.results?.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (res.ok) {
      await fetchGroups(groupId);
      await fetchSubscribers(groupId); // refresh only subscribers
      return { success: true, message: result.message || "Subscriber removed successfully" };
    } else {
      return { success: false, message: result.message || "Failed to delete subscriber" };
    }
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { success: false, message: "An error occurred while deleting subscriber" };
  }
};


  return (
    <GroupDetailsContext.Provider
      value={{
        ...state,
        fetchGroups,
        fetchSubscribers,
        deleteGroupSubscriberbyCompositekey,
        deleteGroupSubscriber
      }}
    >
      {children}
    </GroupDetailsContext.Provider>
  );
};

export const useGroupDetailsContext = () => useContext(GroupDetailsContext);

