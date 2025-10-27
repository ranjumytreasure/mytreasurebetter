import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSubscriberContext } from '../../context/subscriber/SubscriberContext';
import { LanguageProvider } from '../../context/language_context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Chit Fund Customer Layout Components
import SubscriberHeader from '../subscriber/layout/SubscriberHeader';
import SubscriberFooter from '../subscriber/layout/SubscriberFooter';

// Chit Fund Customer Pages
import SubscriberDashboard from '../../pages/subscriber/SubscriberDashboard';
import SubscriberGroups from '../../pages/subscriber/SubscriberGroups';
import SubscriberGroupDetails from '../../pages/subscriber/SubscriberGroupDetails';
import SubscriberLiveAuction from '../../pages/subscriber/SubscriberLiveAuction';
import SubscriberTransactions from '../../pages/subscriber/SubscriberTransactions';
import SubscriberProfile from '../../pages/subscriber/SubscriberProfile';
import SubscriberLogin from '../../pages/subscriber/SubscriberLogin';

const ChitFundCustomerLayout = () => {
    const { isAuthenticated } = useSubscriberContext();

    useEffect(() => {
        // Add class to body when subscriber layout mounts
        document.body.classList.add('subscriber-app');

        // Cleanup: remove class when component unmounts
        return () => {
            document.body.classList.remove('subscriber-app');
        };
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="subscriber-layout">
                <Switch>
                    <Route path="/chit-fund/customer/login" component={SubscriberLogin} />
                    <Route path="/chit-fund/customer">
                        <Redirect to="/chit-fund/customer/login" />
                    </Route>
                </Switch>
            </div>
        );
    }

    return (
        <LanguageProvider>
            <div className="subscriber-layout">
                <SubscriberHeader />
                <main className="subscriber-main-content">
                    <Switch>
                        <Route path="/chit-fund/customer" exact>
                            <Redirect to="/chit-fund/customer/groups" />
                        </Route>
                        <Route path="/chit-fund/customer/dashboard" component={SubscriberDashboard} />
                        <Route path="/chit-fund/customer/groups" exact component={SubscriberGroups} />
                        <Route path="/chit-fund/customer/groups/:groupId/:grpSubId/auction" component={SubscriberLiveAuction} />
                        <Route path="/chit-fund/customer/groups/:groupId/:grpSubId" component={SubscriberGroupDetails} />
                        <Route path="/chit-fund/customer/transactions" component={SubscriberTransactions} />
                        <Route path="/chit-fund/customer/profile" component={SubscriberProfile} />
                        <Route path="/chit-fund/customer/login">
                            <Redirect to="/chit-fund/customer/groups" />
                        </Route>
                    </Switch>
                </main>
                <SubscriberFooter />
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </LanguageProvider>
    );
};

export default ChitFundCustomerLayout;













