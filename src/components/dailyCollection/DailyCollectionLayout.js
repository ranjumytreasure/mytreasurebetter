import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DailyCollectionNavbar from './DailyCollectionNavbar';
import DailyCollectionHome from '../../pages/dailyCollection/DailyCollectionHome';
import CompanyManagement from '../../pages/dailyCollection/CompanyManagement';
import SubscribersPage from '../../pages/dailyCollection/SubscribersPage';
import ProductManagement from '../../pages/dailyCollection/ProductManagement';
import LoansPage from '../../pages/dailyCollection/LoansPage';
import PrivateRoute from '../../pages/PrivateRoute';
import { DailyCollectionProvider } from '../../context/dailyCollection/DailyCollectionContext';
import { CompanySubscriberProvider } from '../../context/companysubscriber_context';

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

const DailyCollectionLayout = () => {
    return (
        <CompanySubscriberProvider>
            <DailyCollectionProvider>
                <div className="min-h-screen bg-gray-50">
                    {/* Daily Collection Navbar */}
                    <DailyCollectionNavbar />

                    {/* Main Content Area */}
                    <div className="min-h-[calc(100vh-128px)]">
                        <Switch>
                            {/* Daily Collection Routes */}
                            <PrivateRoute exact path="/daily-collection/home" component={DailyCollectionHome} />
                            <PrivateRoute exact path="/daily-collection/companies" component={CompanyManagement} />
                            <PrivateRoute exact path="/daily-collection/subscribers" component={SubscribersPage} />
                            <PrivateRoute exact path="/daily-collection/products" component={ProductManagement} />
                            <PrivateRoute exact path="/daily-collection/loans" component={LoansPage} />

                            {/* Placeholder routes for future pages */}
                            <PrivateRoute exact path="/daily-collection/collections" component={PlaceholderPage} />
                            <PrivateRoute exact path="/daily-collection/reports" component={PlaceholderPage} />

                            {/* Default redirect to home */}
                            <Route path="/daily-collection">
                                <DailyCollectionHome />
                            </Route>
                        </Switch>
                    </div>

                    {/* Footer */}
                    <footer className="bg-white border-t border-gray-200 py-4">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <p className="text-center text-sm text-gray-500">
                                © 2024 Daily Collection App. Part of MyTreasure Finance Hub.
                            </p>
                        </div>
                    </footer>
                </div>
            </DailyCollectionProvider>
        </CompanySubscriberProvider>
    );
};

export default DailyCollectionLayout;
