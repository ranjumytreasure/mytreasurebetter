import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Daily Collection Admin Contexts
import { DailyCollectionProvider } from '../../context/dailyCollection/DailyCollectionContext';
import { DcLedgerProvider } from '../../context/dailyCollection/dcLedgerContext';
import { AnalyticsProvider } from '../../context/dailyCollection/AnalyticsContext';
import { CompanySubscriberProvider } from '../../context/companysubscriber_context';
import { DcSubscriberProvider } from '../../context/dailyCollection/DcSubscriberContext';

// Daily Collection Admin Components
import DailyCollectionNavbar from './DailyCollectionNavbar';

// Daily Collection Admin Pages
import DailyCollectionHome from '../../pages/dailyCollection/DailyCollectionHome';
import CompanyManagement from '../../pages/dailyCollection/CompanyManagement';
import SubscribersPage from '../../pages/dailyCollection/SubscribersPage';
import ProductManagement from '../../pages/dailyCollection/ProductManagement';
import LoansPage from '../../pages/dailyCollection/LoansPage';
import DcLedgerPage from '../../pages/dailyCollection/dcLedgerPage';
import CollectionsPage from '../../pages/dailyCollection/CollectionsPage';
import DashboardPage from '../../pages/dailyCollection/DashboardPage';
import ReportsPage from '../../pages/dailyCollection/ReportsPage';
import PrivateRoute from '../../pages/PrivateRoute';

console.log('DailyCollectionAdminLayout: CompanySubscriberProvider imported:', CompanySubscriberProvider);

// Placeholder component for future pages
const PlaceholderPage = () => {
    return (
        <div className="min-h-[calc(100vh-128px)] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-400">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Under Development</h2>
                <p className="text-gray-600 mb-4">
                    This feature is currently being built and will be available soon.
                </p>
                <p className="text-sm text-gray-500">
                    Thank you for your patience!
                </p>
            </div>
        </div>
    );
};

const DailyCollectionAdminLayout = () => {
    console.log('DailyCollectionAdminLayout: Rendering with providers');

    return (
        <CompanySubscriberProvider>
            <DcSubscriberProvider>
                <DailyCollectionProvider>
                    <DcLedgerProvider>
                        <AnalyticsProvider>
                            <div className="min-h-screen bg-gray-50">
                                {/* Daily Collection Admin Navbar */}
                                <DailyCollectionNavbar />

                                {/* Main Content Area */}
                                <div className="min-h-[calc(100vh-56px)]">
                                    <Switch>
                                        {/* Daily Collection User Routes */}
                                        <PrivateRoute exact path="/daily-collection/user" component={DailyCollectionHome} />
                                        <PrivateRoute exact path="/daily-collection/user/home" component={DailyCollectionHome} />
                                        <PrivateRoute exact path="/daily-collection/user/dashboard" component={DashboardPage} />
                                        <PrivateRoute exact path="/daily-collection/user/companies" component={CompanyManagement} />
                                        <PrivateRoute exact path="/daily-collection/user/company" component={CompanyManagement} />
                                        <PrivateRoute exact path="/daily-collection/user/subscribers" component={SubscribersPage} />
                                        <PrivateRoute exact path="/daily-collection/user/products" component={ProductManagement} />
                                        <PrivateRoute exact path="/daily-collection/user/loans" component={LoansPage} />
                                        <PrivateRoute exact path="/daily-collection/user/ledger" component={DcLedgerPage} />
                                        <PrivateRoute exact path="/daily-collection/user/collections" component={CollectionsPage} />
                                        <PrivateRoute exact path="/daily-collection/user/reports" component={ReportsPage} />

                                        {/* Default redirect to home */}
                                        <Route path="/daily-collection/user">
                                            <DailyCollectionHome />
                                        </Route>
                                    </Switch>
                                </div>

                                {/* Footer */}
                                <footer className="bg-white border-t border-gray-200 py-4">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                        <p className="text-center text-sm text-gray-500">
                                            © 2024 Daily Collection Admin. Part of MyTreasure Finance Hub.
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
                        </AnalyticsProvider>
                    </DcLedgerProvider>
                </DailyCollectionProvider>
            </DcSubscriberProvider>
        </CompanySubscriberProvider>
    );
};

export default DailyCollectionAdminLayout;
