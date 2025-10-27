import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Daily Collection Collector Contexts
import { CompanySubscriberProvider } from '../../context/companysubscriber_context';

// Daily Collection Collector Components
import DailyCollectionCollectorNavbar from './DailyCollectionCollectorNavbar';

// Daily Collection Collector Pages (Placeholder for now)
const DailyCollectionCollectorDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Daily Collection Collector Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Collections</h2>
                        <p className="text-gray-600">Manage daily collections</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customers</h2>
                        <p className="text-gray-600">View assigned customers</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
                        <p className="text-gray-600">Generate collection reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DailyCollectionCollectorLayout = () => {
    return (
        <CompanySubscriberProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Daily Collection Collector Navbar */}
                <DailyCollectionCollectorNavbar />

                {/* Main Content Area */}
                <div className="min-h-[calc(100vh-128px)]">
                    <Switch>
                        {/* Daily Collection Collector Routes */}
                        <Route path="/daily-collection/collector" exact>
                            <Redirect to="/daily-collection/collector/dashboard" />
                        </Route>
                        <Route path="/daily-collection/collector/dashboard" component={DailyCollectionCollectorDashboard} />
                        <Route path="/daily-collection/collector/collections" component={DailyCollectionCollectorDashboard} />
                        <Route path="/daily-collection/collector/customers" component={DailyCollectionCollectorDashboard} />
                        <Route path="/daily-collection/collector/reports" component={DailyCollectionCollectorDashboard} />
                    </Switch>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            © 2024 Daily Collection Collector. Part of MyTreasure Finance Hub.
                        </p>
                    </div>
                </footer>

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
        </CompanySubscriberProvider>
    );
};

export default DailyCollectionCollectorLayout;
