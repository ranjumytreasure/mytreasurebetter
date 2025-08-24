import { createContext, useContext, useReducer, useCallback } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from './user_context';

// 1. Create Context
const CompanySubscriberContext = createContext();

// 2. Context Hook
export const useCompanySubscriberContext = () => {
  return useContext(CompanySubscriberContext);
};

// 3. Initial State
const initialState = {
  companySubscribers: [],
  isLoading: false,
  error: null,
};

// 4. Enhanced Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        companySubscribers: action.payload,
        error: null,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_COMPANY_SUBSCRIBER':
      return {
        ...state,
        companySubscribers: [action.payload, ...state.companySubscribers],
      };
    case 'REMOVE_COMPANY_SUBSCRIBER':
      return {
        ...state,
        companySubscribers: state.companySubscribers.filter(
          (subscriber) => subscriber.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

// 5. Provider Component
export const CompanySubscriberProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useUserContext();

  console.log('CompanySubscriberProvider rendering with state:', state);

  const fetchCompanySubscribers = useCallback(async () => {
  if (!user?.results?.token) return;

  dispatch({ type: 'FETCH_START' });

  try {
    const res = await fetch(`${API_BASE_URL}/subscribers/all`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.results.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to fetch company subscribers');
    const data = await res.json();
    dispatch({ type: 'FETCH_SUCCESS', payload: data?.results || [] });
  } catch (err) {
    console.error('Error fetching company subscribers:', err.message);
    dispatch({ type: 'FETCH_ERROR', payload: err.message });
  }
}, [user]);


  return (
   <CompanySubscriberContext.Provider
  value={{
    companySubscribers: state.companySubscribers,
    isLoading: state.isLoading,
    error: state.error,
    fetchCompanySubscribers,
    dispatch,
  }}
>
      {children}
    </CompanySubscriberContext.Provider>
  );
};



// import { createContext, useContext, useReducer } from 'react';
// import { API_BASE_URL } from '../utils/apiConfig';
// import { useUserContext } from './user_context';


// // Define the initial state and actions for the context
// const CompanySubscriberContext = createContext();

// export const useCompanySubscriberContext = () => {
//     return useContext(CompanySubscriberContext);
// };

// const initialState = {
//     companySubscribers: [],
//     isLoading: false,
//   error: null,
// };

// const reducer = (state, action) => {
//     switch (action.type) {
//         case 'ADD_COMPANY_SUBSCRIBER':
//             return {
//                 ...state,
//                 companySubscribers: [...state.companySubscribers, action.payload],
//             };
//         case 'REMOVE_COMPANY_SUBSCRIBER':
//             return {
//                 ...state,
//                 companySubscribers: state.companySubscribers.filter(
//                     (subscriber) => subscriber.id !== action.payload
//                 ),
//             };
//         case 'SET_SUBSCRIBERS':
//             return {
//                 ...state,
//                 companySubscribers: action.payload, // Set the subscribers array with the payload
//             };
//         default:
//             return state;
//     }
// };

// export const CompanySubscriberProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(reducer, initialState);
//     console.log('CompanySubscriberProvider rendering with state:', state);

   

//     return (
//         <CompanySubscriberContext.Provider value={{ state, dispatch }}>
//             {children}
//         </CompanySubscriberContext.Provider>
//     );
// };
