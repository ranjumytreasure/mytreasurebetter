import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CollectorProvider, useCollector } from '../../context/CollectorProvider';
import { CollectorLedgerProvider } from '../../context/CollectorLedgerContext';
import { CollectorGroupsProvider } from '../../context/CollectorGroupsContext';
import CollectorHeader from './CollectorHeader';
import CollectorLogin from '../../pages/collector/CollectorLogin';
import CollectorReceivables from '../../pages/collector/CollectorReceivables';
import CollectorDashboard from '../../pages/collector/CollectorDashboard';
import CollectorAdvanceHistory from '../../pages/collector/CollectorAdvanceHistory';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useCollector();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Redirect to="/collector/login" />;
    }

    return children;
};

const CollectorLayout = () => {
    return (
        <CollectorProvider>
            <CollectorLedgerProvider>
                <CollectorGroupsProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Switch>
                            {/* Login Route - Must come first */}
                            <Route path="/collector/login" component={CollectorLogin} />

                            {/* Protected Routes with Header */}
                            <Route path="/collector/dashboard">
                                <ProtectedRoute>
                                    <CollectorHeader />
                                    <div className="pt-16">
                                        <CollectorDashboard />
                                    </div>
                                </ProtectedRoute>
                            </Route>
                            <Route path="/collector/receivables">
                                <ProtectedRoute>
                                    <CollectorHeader />
                                    <div className="pt-16">
                                        <CollectorReceivables />
                                    </div>
                                </ProtectedRoute>
                            </Route>
                            <Route path="/collector/advance-history">
                                <ProtectedRoute>
                                    <CollectorHeader />
                                    <div className="pt-16">
                                        <CollectorAdvanceHistory />
                                    </div>
                                </ProtectedRoute>
                            </Route>

                            {/* Default redirect for /collector */}
                            <Redirect from="/collector" to="/collector/login" />
                        </Switch>

                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </CollectorGroupsProvider>
            </CollectorLedgerProvider>
        </CollectorProvider>
    );
};

export default CollectorLayout;
