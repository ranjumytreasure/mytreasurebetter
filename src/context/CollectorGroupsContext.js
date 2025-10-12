import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { useCollector } from './CollectorProvider';
import { API_BASE_URL } from '../utils/apiConfig';
import { toast } from 'react-toastify';

/**
 * CollectorGroupsContext - Manages groups and subscribers for collector app
 * Uses parent_membership_id for all operations
 * Reuses existing backend APIs from user app
 */

const CollectorGroupsContext = createContext();

const initialState = {
    groups: [],                    // All groups list
    selectedGroupDetails: {},      // Single group detail with subscribers
    groupSubscribers: [],          // Extracted from selectedGroupDetails.groupSubcriberResult
    isLoading: false,
    error: null,
};

const ACTIONS = {
    FETCH_START: 'FETCH_START',
    FETCH_ALL_GROUPS_SUCCESS: 'FETCH_ALL_GROUPS_SUCCESS',
    FETCH_SINGLE_GROUP_SUCCESS: 'FETCH_SINGLE_GROUP_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
    CLEAR_GROUP_SELECTION: 'CLEAR_GROUP_SELECTION',
};

function collectorGroupsReducer(state, action) {
    switch (action.type) {
        case ACTIONS.FETCH_START:
            return { ...state, isLoading: true, error: null };

        case ACTIONS.FETCH_ALL_GROUPS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                groups: action.payload.groups || [],
            };

        case ACTIONS.FETCH_SINGLE_GROUP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                selectedGroupDetails: action.payload?.results || {},
                // Extract subscribers from groupSubcriberResult
                groupSubscribers: action.payload?.results?.groupSubcriberResult || [],
            };

        case ACTIONS.FETCH_ERROR:
            return { ...state, isLoading: false, error: action.payload };

        case ACTIONS.CLEAR_GROUP_SELECTION:
            return {
                ...state,
                selectedGroupDetails: {},
                groupSubscribers: [],
            };

        default:
            return state;
    }
}

export const CollectorGroupsProvider = ({ children }) => {
    const { user } = useCollector();
    const [state, dispatch] = useReducer(collectorGroupsReducer, initialState);

    // Fetch all groups for the organization
    // Uses collector's token - backend filters by parent_membership_id automatically
    const fetchAllGroups = useCallback(async () => {
        const token = user?.token || user?.results?.token;
        if (!token) {
            console.log('❌ No token found, cannot fetch groups');
            return;
        }

        dispatch({ type: ACTIONS.FETCH_START });

        try {
            console.log('🔄 Fetching all groups for collector');
            console.log('🔄 API URL:', `${API_BASE_URL}/users/groups`);

            const response = await fetch(`${API_BASE_URL}/users/groups`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) throw new Error('Failed to fetch groups');

            const data = await response.json();
            console.log('✅ Groups response:', data);
            console.log('✅ Groups array:', data.results?.groups);

            dispatch({
                type: ACTIONS.FETCH_ALL_GROUPS_SUCCESS,
                payload: data.results || { groups: [] },
            });
        } catch (error) {
            console.log('❌ Fetch groups error:', error);
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
            toast.error('Failed to fetch groups');
        }
    }, [user]);

    // Fetch single group by ID to get subscribers
    // Returns group details with groupSubcriberResult array
    const fetchGroupById = useCallback(async (groupId) => {
        const token = user?.token || user?.results?.token;
        if (!token) {
            console.log('❌ No token found, cannot fetch group details');
            return;
        }

        if (!groupId) {
            console.log('❌ No groupId provided');
            dispatch({ type: ACTIONS.CLEAR_GROUP_SELECTION });
            return;
        }

        dispatch({ type: ACTIONS.FETCH_START });

        try {
            console.log('🔄 Fetching group details for groupId:', groupId);
            console.log('🔄 API URL:', `${API_BASE_URL}/users/groups/${groupId}`);

            const response = await fetch(`${API_BASE_URL}/users/groups/${groupId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) throw new Error('Failed to fetch group details');

            const data = await response.json();
            console.log('✅ Group details response:', data);
            console.log('✅ Group subscribers (groupSubcriberResult):', data.results?.groupSubcriberResult);

            dispatch({
                type: ACTIONS.FETCH_SINGLE_GROUP_SUCCESS,
                payload: data,
            });
        } catch (error) {
            console.log('❌ Fetch group details error:', error);
            dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
            toast.error('Failed to fetch group subscribers');
        }
    }, [user]);

    // Clear group selection
    const clearGroupSelection = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_GROUP_SELECTION });
    }, []);

    return (
        <CollectorGroupsContext.Provider
            value={{
                groups: state.groups,
                selectedGroupDetails: state.selectedGroupDetails,
                groupSubscribers: state.groupSubscribers,
                isLoading: state.isLoading,
                error: state.error,
                fetchAllGroups,
                fetchGroupById,
                clearGroupSelection,
            }}
        >
            {children}
        </CollectorGroupsContext.Provider>
    );
};

export const useCollectorGroups = () => {
    const context = useContext(CollectorGroupsContext);
    if (!context) {
        throw new Error('useCollectorGroups must be used within CollectorGroupsProvider');
    }
    return context;
};






