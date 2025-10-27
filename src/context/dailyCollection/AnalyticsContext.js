import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useUserContext } from '../user_context';
import { API_BASE_URL } from '../../utils/apiConfig';

// Analytics Context
const AnalyticsContext = createContext();

// Initial State
const initialState = {
    dashboardData: {
        totalCompanies: 0,
        totalProducts: 0,
        totalLoans: 0,
        activeLoans: 0,
        totalDisbursed: 0,
        totalCollected: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        monthlyTarget: 0,
        monthlyAchieved: 0,
        recentActivity: [],
        topProducts: [],
        loanStatusBreakdown: {},
        monthlyTrends: []
    },
    reports: [],
    isLoading: false,
    error: null,
    lastUpdated: null
};

// Reducer
function analyticsReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };

        case 'CLEAR_ERROR':
            return { ...state, error: null };

        case 'SET_DASHBOARD_DATA':
            return {
                ...state,
                dashboardData: action.payload,
                isLoading: false,
                error: null,
                lastUpdated: new Date().toISOString()
            };

        case 'SET_REPORTS':
            return {
                ...state,
                reports: action.payload,
                isLoading: false,
                error: null
            };

        case 'ADD_REPORT':
            return {
                ...state,
                reports: [...state.reports, action.payload]
            };

        case 'UPDATE_DASHBOARD_METRICS':
            return {
                ...state,
                dashboardData: {
                    ...state.dashboardData,
                    ...action.payload
                }
            };

        default:
            return state;
    }
}

// Analytics Provider
export function AnalyticsProvider({ children }) {
    const [state, dispatch] = useReducer(analyticsReducer, initialState);
    const { user } = useUserContext();

    // Fetch Dashboard Data
    const fetchDashboardData = useCallback(async (period = '30') => {
        if (!user?.results?.token) {
            dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
            return { success: false, error: 'User not authenticated' };
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const response = await fetch(`${API_BASE_URL}/dc/dashboard?parent_membership_id=${membershipId}&period=${period}`, {
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'SET_DASHBOARD_DATA', payload: data.results || {} });
                return { success: true, data: data.results };
            } else {
                throw new Error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    }, [user]);

    // Generate Report
    const generateReport = useCallback(async (reportType, filters = {}) => {
        if (!user?.results?.token) {
            dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
            return { success: false, error: 'User not authenticated' };
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const response = await fetch(`${API_BASE_URL}/dc/reports/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reportType,
                    filters,
                    membershipId
                })
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'ADD_REPORT', payload: data.results });
                return { success: true, data: data.results };
            } else {
                throw new Error('Failed to generate report');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    }, [user]);

    // Fetch Reports
    const fetchReports = useCallback(async (filters = {}) => {
        if (!user?.results?.token) {
            dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
            return { success: false, error: 'User not authenticated' };
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const queryParams = new URLSearchParams({
                parent_membership_id: membershipId,
                ...filters
            });

            const response = await fetch(`${API_BASE_URL}/dc/reports?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: 'SET_REPORTS', payload: data.results || [] });
                return { success: true, data: data.results };
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    }, [user]);

    // Export Report
    const exportReport = useCallback(async (reportId, format = 'pdf') => {
        if (!user?.results?.token) {
            dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
            return { success: false, error: 'User not authenticated' };
        }

        try {
            const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
            const response = await fetch(`${API_BASE_URL}/dc/reports/${reportId}/export`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.results.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    format,
                    membershipId
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report-${reportId}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return { success: true };
            } else {
                throw new Error('Failed to export report');
            }
        } catch (error) {
            console.error('Error exporting report:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message });
            return { success: false, error: error.message };
        }
    }, [user]);

    // Update Metrics
    const updateMetrics = useCallback((metrics) => {
        dispatch({ type: 'UPDATE_DASHBOARD_METRICS', payload: metrics });
    }, []);

    // Clear Error
    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    // Refresh Data
    const refreshData = useCallback(async (period = '30') => {
        await fetchDashboardData(period);
    }, [fetchDashboardData]);

    const value = {
        // State
        dashboardData: state.dashboardData,
        reports: state.reports,
        isLoading: state.isLoading,
        error: state.error,
        lastUpdated: state.lastUpdated,

        // Actions
        fetchDashboardData,
        generateReport,
        fetchReports,
        exportReport,
        updateMetrics,
        clearError,
        refreshData
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
}

// Hook to use Analytics Context
export const useAnalyticsContext = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
    }
    return context;
};

export default AnalyticsContext;







