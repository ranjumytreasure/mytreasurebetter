import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Daily Collection Customer Contexts
import { CompanySubscriberProvider } from '../../context/companysubscriber_context';

// Daily Collection Customer Components
import DailyCollectionCustomerNavbar from './DailyCollectionCustomerNavbar';

// Daily Collection Customer Pages (Placeholder for now)
const DailyCollectionCustomerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Daily Collection Customer Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Loans</h2>
                        <p className="text-gray-600">View your active and closed loans</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
                        <p className="text-gray-600">Track your payment records</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>
                        <p className="text-gray-600">Manage your account information</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DailyCollectionCustomerLayout = () => {
    return (
        <CompanySubscriberProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Daily Collection Customer Navbar */}
                <DailyCollectionCustomerNavbar />

                {/* Main Content Area */}
                <div className="min-h-[calc(100vh-128px)]">
                    <Switch>
                        {/* Daily Collection Customer Routes */}
                        <Route path="/daily-collection/customer" exact>
                            <Redirect to="/daily-collection/customer/dashboard" />
                        </Route>
                        <Route path="/daily-collection/customer/dashboard" component={DailyCollectionCustomerDashboard} />
                        <Route path="/daily-collection/customer/loans" component={DailyCollectionCustomerDashboard} />
                        <Route path="/daily-collection/customer/payments" component={DailyCollectionCustomerDashboard} />
                        <Route path="/daily-collection/customer/profile" component={DailyCollectionCustomerDashboard} />
                    </Switch>
                </div>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            © 2024 Daily Collection Customer. Part of MyTreasure Finance Hub.
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

export default DailyCollectionCustomerLayout;
