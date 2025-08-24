import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useUserContext } from "./user_context";
import { API_BASE_URL } from "../utils/apiConfig";

const AobContext = createContext();

const initialState = {
  aobs: [],
  isLoading: false,
  error: null,
};

const aobReducer = (state, action) => {
  switch (action.type) {
    case "AOB_FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "AOB_FETCH_SUCCESS":
      return { ...state, isLoading: false, aobs: action.payload };
    case "AOB_FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "AOB_ADD_SUCCESS":
      return { ...state, aobs: [action.payload, ...state.aobs] };
    case "AOB_DELETE_SUCCESS":
      return {
        ...state,
        aobs: state.aobs.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export const AobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aobReducer, initialState);
  const { user } = useUserContext();

  const fetchAobs = async () => {
    dispatch({ type: "AOB_FETCH_START" });
    try {
      const res = await fetch(`${API_BASE_URL}/aob/all`, {
        headers: {
          Authorization: `Bearer ${user?.results?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch AOBs");

      dispatch({
        type: "AOB_FETCH_SUCCESS",
        payload: data.results || [],
      });
    } catch (err) {
      dispatch({
        type: "AOB_FETCH_ERROR",
        payload: err.message || "Unknown error",
      });
    }
  };

  const addAob = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/aob`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.results?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add AOB");

      dispatch({
        type: "AOB_ADD_SUCCESS",
        payload: data.results,
      });
      fetchAobs();

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteAob = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/aob/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.results?.token}`,
        },
      });

      // Check if response is OK (status 2xx)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      // Parse response once, no need for `.json()` twice
      const data = await res.json();

      // Dispatch Redux action
      dispatch({ type: "AOB_DELETE_SUCCESS", payload: id });

      return { success: true, message: data.message || "Deleted successfully" };
    } catch (err) {
      return { success: false, message: err.message || "Something went wrong" };
    }
  };


  // Automatically fetch AOBs on mount or when user logs in
  useEffect(() => {
    if (user?.results?.token) {
      fetchAobs();
    }
  }, [user]);

  return (
    <AobContext.Provider
      value={{
        aobs: state.aobs,
        isLoading: state.isLoading,
        error: state.error,
        fetchAobs,
        addAob,
        deleteAob,
      }}
    >
      {children}
    </AobContext.Provider>
  );
};

export const useAobContext = () => useContext(AobContext);

