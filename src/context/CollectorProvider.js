import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../utils/apiConfig';


const CollectorContext = createContext();

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    receivables: [],
    selectedArea: null,
    areaReceivables: [],
    error: null
};

// Action types
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_RECEIVABLES: 'SET_RECEIVABLES',
    SET_AREA_RECEIVABLES: 'SET_AREA_RECEIVABLES',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const collectorReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };

        case ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                receivables: [],
                selectedArea: null,
                areaReceivables: [],
                error: null
            };

        case ACTIONS.SET_RECEIVABLES:
            return {
                ...state,
                receivables: action.payload,
                isLoading: false,
                error: null
            };

        case ACTIONS.SET_AREA_RECEIVABLES:
            return {
                ...state,
                selectedArea: action.payload.area,
                areaReceivables: action.payload.receivables,
                isLoading: false,
                error: null
            };

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };

        default:
            return state;
    }
};

// Provider component
export const CollectorProvider = ({ children }) => {
    const [state, dispatch] = useReducer(collectorReducer, initialState);

    // Check for existing token on mount
    useEffect(() => {
        console.log('🔍 CollectorProvider: Checking for existing auth...');
        const token = localStorage.getItem('collector_token');
        const user = localStorage.getItem('collector_user');

        console.log('  - token exists:', !!token);
        console.log('  - user exists:', !!user);

        if (token && user) {
            try {
                const userData = JSON.parse(user);
                console.log('  - parsed userData:', userData);
                dispatch({
                    type: ACTIONS.LOGIN_SUCCESS,
                    payload: { user: userData, token }
                });
                console.log('  - ✅ User authenticated from localStorage');
            } catch (error) {
                console.log('  - ❌ Error parsing user data:', error);
                localStorage.removeItem('collector_token');
                localStorage.removeItem('collector_user');
            }
        } else {
            console.log('  - ❌ No auth data found in localStorage');
        }
    }, []);

    // Login function
    const login = async (credentials) => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            const response = await fetch(`${API_BASE_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.error === false && data.results) {
                // Check if user has Collector role
                const hasCollectorRole = data.results.userAccounts?.some(
                    account => account.accountName?.toLowerCase().includes('collector')
                );

                if (hasCollectorRole) {
                    console.log('✅ Login successful, storing user data:', data.results);
                    // Store in localStorage
                    localStorage.setItem('collector_token', data.results.token);
                    localStorage.setItem('collector_user', JSON.stringify(data.results));

                    dispatch({
                        type: ACTIONS.LOGIN_SUCCESS,
                        payload: { user: data.results, token: data.results.token }
                    });

                    console.log('✅ User data stored and dispatched');
                    toast.success('Login successful!');
                    return { success: true };
                } else {
                    console.log('❌ User does not have collector role');
                    throw new Error('Access denied. Collector role required.');
                }
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            toast.error(error.message);
            return { success: false, error: error.message };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('collector_token');
        localStorage.removeItem('collector_user');
        dispatch({ type: ACTIONS.LOGOUT });
        toast.success('Logged out successfully');
    };

    // Fetch receivables for collector (using same API as admin modal)
    const fetchReceivables = useCallback(async () => {
        console.log('🔍 fetchReceivables called');
        console.log('  - state.user:', state.user);
        console.log('  - state.user?.id:', state.user?.id);
        console.log('  - state.user?.userId:', state.user?.userId);

        // Use the same field as admin modal: collector.id
        const collectorId = state.user?.id || state.user?.userId;
        if (!collectorId) {
            console.log('❌ No collector ID found, cannot fetch receivables');
            return;
        }

        console.log('🔄 Fetching receivables for collector:', collectorId);
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            console.log('🔄 API URL:', `${API_BASE_URL}/collector-area/${collectorId}/receivables`);
            const response = await fetch(`${API_BASE_URL}/collector-area/${collectorId}/receivables`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${state.token}`,
                },
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ API Response:', data);

                // Check for success (either data.success === true OR data.error === false)
                if (data.success === true || data.error === false) {
                    const receivablesData = data.results?.receivables || [];
                    console.log('✅ Setting receivables:', receivablesData);
                    dispatch({
                        type: ACTIONS.SET_RECEIVABLES,
                        payload: receivablesData
                    });
                } else {
                    console.log('❌ API returned success: false or error: true');
                    throw new Error(data.message || 'Failed to fetch receivables');
                }
            } else {
                console.log('❌ Response not ok, status:', response.status);
                const errorData = await response.json();
                console.log('❌ Error data:', errorData);
                throw new Error(errorData.message || 'Failed to fetch receivables');
            }
        } catch (error) {
            console.log('❌ Fetch receivables error:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
            toast.error('Failed to fetch receivables');
        }
    }, [state.user?.id, state.user?.userId, state.token]);

    // Fetch receivables for specific area
    const fetchAreaReceivables = useCallback((areaName) => {
        if (!state.receivables.length) return;

        const areaReceivables = state.receivables.filter(
            receivable => receivable.aob === areaName
        );

        dispatch({
            type: ACTIONS.SET_AREA_RECEIVABLES,
            payload: { area: areaName, receivables: areaReceivables }
        });
    }, [state.receivables]);

    // Get area summary
    const getAreaSummary = useCallback(() => {
        if (!state.receivables.length) return {};

        const areaGroups = state.receivables.reduce((acc, receivable) => {
            const area = receivable.aob;
            if (!acc[area]) {
                acc[area] = {
                    totalAmount: 0,
                    collected: 0,
                    pending: 0,
                    count: 0
                };
            }

            // Use rbtotal, rbpaid, rbdue (with fallback to old field names)
            acc[area].totalAmount += parseFloat(receivable.rbtotal || receivable.total_amount || 0);
            acc[area].collected += parseFloat(receivable.rbpaid || receivable.collected_amount || 0);
            acc[area].pending += parseFloat(receivable.rbdue || receivable.pending_amount || 0);
            acc[area].count += 1;

            return acc;
        }, {});

        return areaGroups;
    }, [state.receivables]);

    // Get overall summary
    const getOverallSummary = useCallback(() => {
        if (!state.receivables.length) {
            return { totalAmount: 0, collected: 0, pending: 0, collectionRate: 0 };
        }

        const summary = state.receivables.reduce((acc, receivable) => {
            // Use rbtotal, rbpaid, rbdue (with fallback to old field names)
            acc.totalAmount += parseFloat(receivable.rbtotal || receivable.total_amount || 0);
            acc.collected += parseFloat(receivable.rbpaid || receivable.collected_amount || 0);
            acc.pending += parseFloat(receivable.rbdue || receivable.pending_amount || 0);
            return acc;
        }, { totalAmount: 0, collected: 0, pending: 0 });

        summary.collectionRate = summary.totalAmount > 0
            ? ((summary.collected / summary.totalAmount) * 100).toFixed(1)
            : 0;

        return summary;
    }, [state.receivables]);

    const value = {
        ...state,
        login,
        logout,
        fetchReceivables,
        fetchAreaReceivables,
        getAreaSummary,
        getOverallSummary
    };

    return (
        <CollectorContext.Provider value={value}>
            {children}
        </CollectorContext.Provider>
    );
};

// Custom hook
export const useCollector = () => {
    const context = useContext(CollectorContext);
    if (!context) {
        throw new Error('useCollector must be used within a CollectorProvider');
    }
    return context;
};
