import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { useUserContext } from './user_context';
import { API_BASE_URL } from '../utils/apiConfig';

const BillingContext = createContext();

const initialState = {
    subscription: null,
    payments: [],
    availablePlans: [],
    isLoading: false,
    error: null,
};

function billingReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUBSCRIPTION_SUCCESS':
            return { ...state, isLoading: false, subscription: action.payload };
        case 'FETCH_PAYMENTS_SUCCESS':
            return { ...state, isLoading: false, payments: action.payload };
        case 'FETCH_PLANS_SUCCESS':
            return { ...state, isLoading: false, availablePlans: action.payload };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'RESET_BILLING':
            return initialState;
        default:
            return state;
    }
}

export const BillingProvider = ({ children }) => {
    const { user } = useUserContext();
    const [state, dispatch] = useReducer(billingReducer, initialState);

    // Fetch billing data when user is available
    useEffect(() => {
        if (user?.results?.token) {
            fetchCurrentSubscription();
            fetchPaymentHistory();
            fetchAvailablePlans();
        }
    }, [user?.results?.token]);

    const fetchCurrentSubscription = async () => {
        if (!user?.results?.token) return;

        const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
        if (!membershipId) {
            dispatch({ type: 'FETCH_ERROR', payload: 'Membership ID not found' });
            return;
        }

        dispatch({ type: 'FETCH_START' });

        try {
            const res = await fetch(`${API_BASE_URL}/billing-subscription/${membershipId}`, {
                headers: {
                    Authorization: `Bearer ${user.results.token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch subscription: ${res.status}`);
            }

            const data = await res.json();

            if (data.success && data.data) {
                dispatch({ type: 'FETCH_SUBSCRIPTION_SUCCESS', payload: data.data.subscription });
            } else {
                dispatch({ type: 'FETCH_ERROR', payload: data.message || 'No subscription data found' });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    const fetchPaymentHistory = async () => {
        if (!user?.results?.token) return;

        const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
        if (!membershipId) {
            dispatch({ type: 'FETCH_ERROR', payload: 'Membership ID not found' });
            return;
        }


        dispatch({ type: 'FETCH_START' });

        try {
            const res = await fetch(`${API_BASE_URL}/billing-payments/${membershipId}`, {
                headers: {
                    Authorization: `Bearer ${user.results.token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch payments: ${res.status}`);
            }

            const data = await res.json();

            if (data.success && data.data) {

                // Handle different data structures from backend
                let paymentData;
                if (Array.isArray(data.data)) {
                    // If data.data is an array, wrap it in cycle_payments
                    paymentData = { cycle_payments: data.data };
                } else if (data.data.cycle_payments) {
                    // If data.data has cycle_payments property, use it as is
                    paymentData = data.data;
                } else {
                    // If data.data is an object but no cycle_payments, treat it as empty
                    paymentData = { cycle_payments: [] };
                }

                dispatch({ type: 'FETCH_PAYMENTS_SUCCESS', payload: paymentData });
            } else {
                dispatch({ type: 'FETCH_PAYMENTS_SUCCESS', payload: { cycle_payments: [] } });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_PAYMENTS_SUCCESS', payload: { cycle_payments: [] } });
        }
    };

    const fetchAvailablePlans = async () => {
        if (!user?.results?.token) return;

        dispatch({ type: 'FETCH_START' });

        try {
            const res = await fetch(`${API_BASE_URL}/billing-subscription/plans/available`, {
                headers: {
                    Authorization: `Bearer ${user.results.token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to fetch plans');
            const data = await res.json();

            if (data.success && data.data) {
                dispatch({ type: 'FETCH_PLANS_SUCCESS', payload: data.data });
            }
        } catch (error) {
            console.log('Plans fetch error:', error.message);
        }
    };


    const changePlan = async (planChangeData) => {
        if (!user?.results?.token) return { success: false, error: 'User not authenticated' };

        const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
        if (!membershipId) {
            return { success: false, error: 'Membership ID not found' };
        }

        try {
            dispatch({ type: 'FETCH_START' });

            const response = await fetch(`${API_BASE_URL}/billing-subscription/change-plan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    membership_id: membershipId,
                    ...planChangeData
                })
            });

            if (response.ok) {
                const result = await response.json();
                await fetchCurrentSubscription();
                await fetchPaymentHistory();
                return { success: true, data: result };
            } else {
                const errorData = await response.json();
                dispatch({ type: 'FETCH_ERROR', payload: errorData.message || 'Plan change failed' });
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    };

    const recordPayment = async (paymentData) => {
        if (!user?.results?.token) return { success: false, error: 'User not authenticated' };

        const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
        if (!membershipId) {
            return { success: false, error: 'Membership ID not found' };
        }

        try {
            // Ensure membership_id is included in the request body
            const requestBody = {
                membership_id: membershipId,
                ...paymentData
            };

            console.log('Recording payment with data:', requestBody);

            const response = await fetch(`${API_BASE_URL}/billing-payments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Payment recorded successfully:', result);

                // Refresh billing data after successful payment
                await fetchCurrentSubscription();
                await fetchPaymentHistory();

                return { success: true, data: result };
            } else {
                const errorData = await response.json();
                console.error('Payment failed:', errorData);
                return { success: false, error: errorData.message || 'Payment failed' };
            }
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    };

    const payCycleBill = async (cyclePaymentData) => {
        if (!user?.results?.token) return { success: false, error: 'User not authenticated' };

        const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
        if (!membershipId) {
            return { success: false, error: 'Membership ID not found' };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/billing-payments/${membershipId}/pay-cycle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cyclePaymentData)
            });

            if (response.ok) {
                const result = await response.json();
                await fetchCurrentSubscription();
                await fetchPaymentHistory();
                return { success: true, data: result };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resetBillingData = () => {
        dispatch({ type: 'RESET_BILLING' });
    };


    return (
        <BillingContext.Provider
            value={{
                subscription: state.subscription,
                payments: state.payments,
                availablePlans: state.availablePlans,
                isLoading: state.isLoading,
                error: state.error,
                fetchCurrentSubscription,
                fetchPaymentHistory,
                fetchAvailablePlans,
                changePlan,
                recordPayment,
                payCycleBill,
                resetBillingData,
            }}
        >
            {children}
        </BillingContext.Provider>
    );
};

export const useBilling = () => {
    const context = useContext(BillingContext);
    if (!context) {
        throw new Error('useBilling must be used within a BillingProvider');
    }
    return context;
};