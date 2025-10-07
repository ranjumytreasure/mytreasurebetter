import React, { createContext, useReducer, useContext } from "react";
import { useUserContext } from "./user_context";
import { API_BASE_URL } from "../utils/apiConfig";

const CollectorAreaContext = createContext();

const initialState = {
    assignedAreas: [],
    isLoading: false,
    error: null,
};

const collectorAreaReducer = (state, action) => {
    switch (action.type) {
        case "COLLECTOR_AREA_FETCH_START":
            return { ...state, isLoading: true, error: null };
        case "COLLECTOR_AREA_FETCH_SUCCESS":
            return { ...state, isLoading: false, assignedAreas: action.payload };
        case "COLLECTOR_AREA_FETCH_ERROR":
            return { ...state, isLoading: false, error: action.payload };
        case "COLLECTOR_AREA_RESET":
            return initialState;
        default:
            return state;
    }
};

export const CollectorAreaProvider = ({ children }) => {
    const [state, dispatch] = useReducer(collectorAreaReducer, initialState);
    const { user } = useUserContext();

    const fetchCollectorAreas = async (collectorId) => {
        dispatch({ type: "COLLECTOR_AREA_FETCH_START" });
        try {
            const res = await fetch(`${API_BASE_URL}/collector-area/${collectorId}`, {
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                },
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch collector areas");
            }

            const assignedAreas = data.results?.assignedAreas || [];
            dispatch({
                type: "COLLECTOR_AREA_FETCH_SUCCESS",
                payload: assignedAreas,
            });
        } catch (err) {
            dispatch({
                type: "COLLECTOR_AREA_FETCH_ERROR",
                payload: err.message || "Unknown error",
            });
        }
    };

    const assignAreasToCollector = async (collectorId, areaIds) => {
        dispatch({ type: "COLLECTOR_AREA_FETCH_START" });

        // Input validation
        if (!collectorId || !areaIds || !Array.isArray(areaIds) || areaIds.length === 0) {
            dispatch({ type: "COLLECTOR_AREA_FETCH_ERROR", payload: "Invalid input parameters" });
            return { success: false, message: "Invalid input parameters" };
        }

        // Add debouncing to prevent rapid successive calls
        const requestId = `${collectorId}-${areaIds.join(',')}-${Date.now()}`;
        if (window.collectorAreaRequests && window.collectorAreaRequests[requestId]) {
            console.log('🚫 DEBOUNCING: Request already in progress');
            return {
                success: false,
                message: "Request already in progress. Please wait.",
                isDuplicate: true
            };
        }

        // Mark request as in progress
        if (!window.collectorAreaRequests) window.collectorAreaRequests = {};
        window.collectorAreaRequests[requestId] = true;

        try {
            // First, get the most current assigned areas from the database
            let currentAssignedAreas = [];
            const currentRes = await fetch(`${API_BASE_URL}/collector-area/${collectorId}`, {
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                },
            });
            const currentData = await currentRes.json();

            console.log('=== DUPLICATE CHECK DEBUG ===');
            console.log('GET API Response:', currentData);
            console.log('Response Status:', currentRes.status);

            if (currentRes.ok) {
                // Extract assigned areas from your backend response format
                currentAssignedAreas = currentData.results?.assignedAreas || [];
                console.log('Extracted assigned areas:', currentAssignedAreas);
            } else {
                console.error('GET API failed:', currentData);
                dispatch({ type: "COLLECTOR_AREA_FETCH_ERROR", payload: "Failed to fetch current assignments" });
                return { success: false, message: "Failed to fetch current assignments" };
            }

            // Check for duplicates and filter them out
            const currentlyAssignedAreaIds = currentAssignedAreas.map(area => area.area_id || area.id);
            console.log('Currently assigned area IDs:', currentlyAssignedAreaIds);
            console.log('Requested area IDs:', areaIds);

            const duplicateAreaIds = areaIds.filter(areaId => currentlyAssignedAreaIds.includes(areaId));
            const newAreaIds = areaIds.filter(areaId => !currentlyAssignedAreaIds.includes(areaId));

            console.log('Duplicate area IDs found:', duplicateAreaIds);
            console.log('New area IDs to assign:', newAreaIds);

            // If all areas are duplicates, return early
            if (newAreaIds.length === 0) {
                console.log('🚫 BLOCKING: All areas are duplicates');
                dispatch({ type: "COLLECTOR_AREA_FETCH_ERROR", payload: null });
                return {
                    success: false,
                    message: "All selected areas are already assigned to this collector.",
                    isDuplicate: true,
                    data: {
                        totalRequested: areaIds.length,
                        alreadyAssigned: duplicateAreaIds.length,
                        newlyAssigned: 0
                    }
                };
            }

            // If some areas are duplicates, show warning but continue with new areas
            if (duplicateAreaIds.length > 0) {
                console.log('⚠️ FILTERING: Some areas are duplicates, continuing with new areas only');
                areaIds = newAreaIds;
            }

            console.log('Final area IDs to send to API:', areaIds);

            // Final safety check - if no areas to assign, don't make API call
            if (areaIds.length === 0) {
                console.log('🚫 FINAL BLOCK: No areas to assign after filtering');
                dispatch({ type: "COLLECTOR_AREA_FETCH_ERROR", payload: null });
                return {
                    success: false,
                    message: "No new areas to assign.",
                    isDuplicate: true,
                    data: {
                        totalRequested: areaIds.length,
                        alreadyAssigned: duplicateAreaIds.length,
                        newlyAssigned: 0
                    }
                };
            }

            const res = await fetch(`${API_BASE_URL}/collector-area/assign`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    collectorId,
                    areaIds,
                    membershipId: user?.results?.userAccounts?.[0]?.parent_membership_id,
                }),
            });

            const data = await res.json();

            console.log('POST API Response:', data);
            console.log('POST Response Status:', res.status);

            if (!res.ok) {
                // Handle duplicate error specifically
                if (res.status === 409 || (res.status === 500 && (data.message?.includes('duplicate') || data.message?.includes('unique constraint')))) {
                    console.log('🚫 DUPLICATE ERROR: Backend caught duplicate');
                    // Refresh the assigned areas to show current state
                    await fetchCollectorAreas(collectorId);
                    return {
                        success: false,
                        message: "Some areas are already assigned to this collector. The list has been refreshed.",
                        isDuplicate: true,
                        data: data.data
                    };
                }
                throw new Error(data.message || "Failed to assign areas");
            }

            console.log('✅ SUCCESS: Areas assigned successfully');
            // Refresh the assigned areas after successful assignment
            await fetchCollectorAreas(collectorId);

            // Show success message with info about duplicates if any
            let message = data.message || "Areas assigned successfully!";
            if (duplicateAreaIds.length > 0) {
                message = `${newAreaIds.length} new area(s) assigned successfully. ${duplicateAreaIds.length} area(s) were already assigned.`;
            }

            return {
                success: true,
                message,
                data: {
                    ...data.data,
                    totalRequested: areaIds.length + duplicateAreaIds.length,
                    alreadyAssigned: duplicateAreaIds.length,
                    newlyAssigned: newAreaIds.length
                }
            };
        } catch (err) {
            console.error('❌ ERROR:', err);
            dispatch({
                type: "COLLECTOR_AREA_FETCH_ERROR",
                payload: err.message || "Failed to assign areas",
            });
            return { success: false, message: err.message };
        } finally {
            // Clean up request tracking
            if (window.collectorAreaRequests) {
                delete window.collectorAreaRequests[requestId];
            }
        }
    };

    const removeCollectorArea = async (collectorId, areaId) => {
        dispatch({ type: "COLLECTOR_AREA_FETCH_START" });
        try {
            const res = await fetch(`${API_BASE_URL}/collector-area/${collectorId}/${areaId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user?.results?.token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to remove area");
            }

            // Refresh the assigned areas after successful removal
            await fetchCollectorAreas(collectorId);
            return { success: true, message: data.message };
        } catch (err) {
            dispatch({
                type: "COLLECTOR_AREA_FETCH_ERROR",
                payload: err.message || "Failed to remove area",
            });
            return { success: false, message: err.message };
        }
    };

    const resetCollectorAreas = () => {
        dispatch({ type: "COLLECTOR_AREA_RESET" });
    };

    return (
        <CollectorAreaContext.Provider
            value={{
                assignedAreas: state.assignedAreas,
                isLoading: state.isLoading,
                error: state.error,
                fetchCollectorAreas,
                assignAreasToCollector,
                removeCollectorArea,
                resetCollectorAreas,
            }}
        >
            {children}
        </CollectorAreaContext.Provider>
    );
};

export const useCollectorAreaContext = () => useContext(CollectorAreaContext);
