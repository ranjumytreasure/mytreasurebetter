import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from './user_context';

const EmployeeContext = createContext();

const initialState = {
  employeeList: [],
  isLoading: false,
  error: null,
};

function employeeReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, employeeList: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'EMPLOYEE_ADD_SUCCESS':
      return {
        ...state,
        employeeList: [action.payload, ...state.employeeList],
      };
    case 'EMPLOYEE_DELETE_SUCCESS':
      return {
        ...state,
        employeeList: state.employeeList.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
}

export const EmployeeProvider = ({ children }) => {
  const { user } = useUserContext();
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const fetchEmployees = async () => {
    if (!user?.results?.token) return;
    dispatch({ type: 'FETCH_START' });

    try {
      const res = await fetch(`${API_BASE_URL}/employee/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data?.results || [] });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  };

  const addEmployee = async (formData) => {

    console.log('mani context ');
    console.log(formData);


    if (!user?.results?.token) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/employee`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.results.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: 'EMPLOYEE_ADD_SUCCESS', payload: data?.result });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteEmployee = async (id, roleid) => {
    if (!user?.results?.token) return;

    try {
      const apiUrl = `${API_BASE_URL}/employee/${id}?roleid=${roleid}`;
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.results.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: 'EMPLOYEE_DELETE_SUCCESS', payload: id });
      }
      return { success: true, message: data.message || "Deleted successfully" };
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.results?.token) fetchEmployees();
  }, [user]);

  return (
    <EmployeeContext.Provider
      value={{
        employeeList: state.employeeList,
        isLoading: state.isLoading,
        error: state.error,
        fetchEmployees,
        addEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => useContext(EmployeeContext);
