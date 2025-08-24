import { createContext, useContext, useReducer } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useUserContext } from './user_context';


const GroupsDetailsContext = createContext();

const initialState = {
    groups: [],               // All groups list
    premium: [],              // Earned Premium
    profits: [],              // Earned Profit
    selectedGroupDetails: {}, // One group detail
    isLoading: false,
    error: null,
};

const groupsDetailsReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };

        case 'FETCH_ALL_GROUPS_SUCCESS':
            return {
                ...state,
                isLoading: false,
                groups: action.payload.groups || [],
                premium: action.payload.earnedPremium || [],
                profits: action.payload.earnedProfit || [],
            };

        case 'FETCH_SINGLE_GROUP_SUCCESS':
            return {
                ...state,
                isLoading: false,
                selectedGroupDetails: action.payload?.results || {},
            };

        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload };

        default:
            return state;
    }
};

export const GroupsDetailsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(groupsDetailsReducer, initialState);
    const { user } = useUserContext();

    // ✅ Fetch all groups
    const fetchAllGroups = async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const response = await fetch(`${API_BASE_URL}/users/groups`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch all groups');

            const data = await response.json();
            console.log("From group context")
            console.log(data)
            dispatch({ type: 'FETCH_ALL_GROUPS_SUCCESS', payload: data.results });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            console.error('Error fetching all groups:', error);
        }
    };

    // ✅ Fetch one group by ID
    const fetchGroupById = async (groupId) => {
        dispatch({ type: 'FETCH_START' });
        try {
            const response = await fetch(`${API_BASE_URL}/users/groups/${groupId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch group details');

            const data = await response.json();
            console.log('from Group details')
            console.log(data)
            dispatch({ type: 'FETCH_SINGLE_GROUP_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
            console.error('Error fetching group by ID:', error);
        }
    };

    return (
        <GroupsDetailsContext.Provider
            value={{
                state,
                dispatch,
                fetchAllGroups,
                fetchGroupById,
            }}
        >
            {children}
        </GroupsDetailsContext.Provider>
    );
};

export const useGroupsDetailsContext = () => useContext(GroupsDetailsContext);
