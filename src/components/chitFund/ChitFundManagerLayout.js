import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Chit Fund Manager Contexts (Limited access for manager role)
import { SubscriberProvider } from '../../context/subscriber/SubscriberContext';
import { GroupsDetailsProvider } from '../../context/groups_context';
import { GroupDetailsProvider } from '../../context/group_context';
import { CompanySubscriberProvider } from '../../context/companysubscriber_context';
import { DashboardProvider } from '../../context/dashboard_context';

// Chit Fund Manager Components
import ChitFundManagerNavbar from './ChitFundManagerNavbar';

// Chit Fund Manager Pages (Limited access - no billing, employees, etc.)
import HomePage from '../../pages/HomePage';
import GroupsPage from '../../pages/GroupsPage';
import GroupAccountDetails from '../../pages/GroupAccountDetails';
import DashboardPage from '../../pages/DashboardPage';
import Subscribers from '../Subscribers';

const ChitFundManagerLayout = () => {
    return (
        <SubscriberProvider>
            <GroupsDetailsProvider>
                <GroupDetailsProvider>
                    <CompanySubscriberProvider>
                        <DashboardProvider>
                            <div className="min-h-screen bg-gray-50">
                                <ChitFundManagerNavbar />

                                <div className="pt-16">
                                    <Switch>
                                        {/* Chit Fund Manager Routes (Limited Access) */}
                                        <Route path="/chit-fund/manager" exact component={HomePage} />
                                        <Route path="/chit-fund/manager/home" component={HomePage} />
                                        <Route path="/chit-fund/manager/subscribers" component={Subscribers} />
                                        <Route path="/chit-fund/manager/groups" component={GroupsPage} />
                                        <Route path="/chit-fund/manager/groups/:groupId" component={GroupAccountDetails} />
                                        <Route path="/chit-fund/manager/dashboard" component={DashboardPage} />
                                    </Switch>
                                </div>

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
                        </DashboardProvider>
                    </CompanySubscriberProvider>
                </GroupDetailsProvider>
            </GroupsDetailsProvider>
        </SubscriberProvider>
    );
};

export default ChitFundManagerLayout;













