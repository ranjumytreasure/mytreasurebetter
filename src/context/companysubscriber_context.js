import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from './user_context';

// 1. Create Context
const CompanySubscriberContext = createContext(null);
console.log('CompanySubscriberContext created:', CompanySubscriberContext);

// 2. Context Hook
export const useCompanySubscriberContext = () => {
  const context = useContext(CompanySubscriberContext);
  console.log('useCompanySubscriberContext called, returning:', context);

  if (!context) {
    console.error('useCompanySubscriberContext: Context is undefined! This means the component is not wrapped in CompanySubscriberProvider');
    throw new Error('useCompanySubscriberContext must be used within a CompanySubscriberProvider');
  }

  return context;
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
  console.log('CompanySubscriberProvider children:', children);

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
      console.log('Fetched subscribers data:', data);
      dispatch({ type: 'FETCH_SUCCESS', payload: data?.results || [] });
    } catch (err) {
      console.error('Error fetching company subscribers:', err.message);
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, [user]);

  // Automatically fetch subscribers when user is available
  useEffect(() => {
    if (user?.results?.token && state.companySubscribers.length === 0) {
      console.log('Auto-fetching subscribers for user:', user);
      fetchCompanySubscribers();
    }
  }, [user, fetchCompanySubscribers, state.companySubscribers.length]);


  const contextValue = {
    companySubscribers: state.companySubscribers,
    isLoading: state.isLoading,
    error: state.error,
    fetchCompanySubscribers,
    dispatch,
  };

  console.log('CompanySubscriberProvider providing context value:', contextValue);

  return (
    <CompanySubscriberContext.Provider value={contextValue}>
      {children}
    </CompanySubscriberContext.Provider>
  );
};
