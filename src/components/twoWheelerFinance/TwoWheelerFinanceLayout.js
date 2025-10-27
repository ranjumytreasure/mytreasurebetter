import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Two Wheeler Finance Components
import TwoWheelerFinanceNavbar from './TwoWheelerFinanceNavbar';

// Two Wheeler Finance Pages (Placeholder for now)
const TwoWheelerFinanceDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Two Wheeler Finance Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loans</h2>
                        <p className="text-gray-600">Manage two-wheeler loans</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Customers</h2>
                        <p className="text-gray-600">Customer management</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports</h2>
                        <p className="text-gray-600">Generate finance reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TwoWheelerFinanceLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Two Wheeler Finance Navbar */}
            <TwoWheelerFinanceNavbar />

            {/* Main Content Area */}
            <div className="min-h-[calc(100vh-128px)]">
                <Switch>
                    {/* Two Wheeler Finance Routes */}
                    <Route path="/two-wheeler-finance" exact>
                        <Redirect to="/two-wheeler-finance/dashboard" />
                    </Route>
                    <Route path="/two-wheeler-finance/dashboard" component={TwoWheelerFinanceDashboard} />
                    <Route path="/two-wheeler-finance/loans" component={TwoWheelerFinanceDashboard} />
                    <Route path="/two-wheeler-finance/customers" component={TwoWheelerFinanceDashboard} />
                    <Route path="/two-wheeler-finance/reports" component={TwoWheelerFinanceDashboard} />
                </Switch>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © 2024 Two Wheeler Finance. Part of MyTreasure Finance Hub.
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
    );
};

export default TwoWheelerFinanceLayout;













