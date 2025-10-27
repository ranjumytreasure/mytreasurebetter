import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSubscriberContext, SubscriberProvider } from '../../context/subscriber/SubscriberContext';
import { LanguageProvider } from '../../context/language_context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Chit Fund Subscriber Layout Components
import SubscriberHeader from '../subscriber/layout/SubscriberHeader';
import SubscriberFooter from '../subscriber/layout/SubscriberFooter';

// Chit Fund Subscriber Pages
import SubscriberDashboard from '../../pages/subscriber/SubscriberDashboard';
import SubscriberGroups from '../../pages/subscriber/SubscriberGroups';
import SubscriberGroupDetails from '../../pages/subscriber/SubscriberGroupDetails';
import SubscriberLiveAuction from '../../pages/subscriber/SubscriberLiveAuction';
import SubscriberTransactions from '../../pages/subscriber/SubscriberTransactions';
import SubscriberProfile from '../../pages/subscriber/SubscriberProfile';
import SubscriberLogin from '../../pages/subscriber/SubscriberLogin';

const ChitFundSubscriberLayoutContent = () => {
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
                    <Route path="/chit-fund/subscriber/login" component={SubscriberLogin} />
                    <Route path="/chit-fund/subscriber">
                        <Redirect to="/chit-fund/subscriber/login" />
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
                        <Route path="/chit-fund/subscriber" exact>
                            <Redirect to="/chit-fund/subscriber/groups" />
                        </Route>
                        <Route path="/chit-fund/subscriber/dashboard" component={SubscriberDashboard} />
                        <Route path="/chit-fund/subscriber/groups" exact component={SubscriberGroups} />
                        <Route path="/chit-fund/subscriber/groups/:groupId/:grpSubId/auction" component={SubscriberLiveAuction} />
                        <Route path="/chit-fund/subscriber/groups/:groupId/:grpSubId" component={SubscriberGroupDetails} />
                        <Route path="/chit-fund/subscriber/transactions" component={SubscriberTransactions} />
                        <Route path="/chit-fund/subscriber/profile" component={SubscriberProfile} />
                        <Route path="/chit-fund/subscriber/login">
                            <Redirect to="/chit-fund/subscriber/groups" />
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

const ChitFundSubscriberLayout = () => {
    return (
        <SubscriberProvider>
            <ChitFundSubscriberLayoutContent />
        </SubscriberProvider>
    );
};

export default ChitFundSubscriberLayout;

