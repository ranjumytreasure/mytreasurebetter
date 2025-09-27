import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSubscriberContext } from '../../../context/subscriber/SubscriberContext';
import { LanguageProvider } from '../../../context/language_context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Subscriber Layout Components
import SubscriberHeader from './SubscriberHeader';
import SubscriberFooter from './SubscriberFooter';

// Subscriber Pages
import SubscriberDashboard from '../../../pages/subscriber/SubscriberDashboard';
import SubscriberGroups from '../../../pages/subscriber/SubscriberGroups';
import SubscriberGroupDetails from '../../../pages/subscriber/SubscriberGroupDetails';
import SubscriberLiveAuction from '../../../pages/subscriber/SubscriberLiveAuction';
import SubscriberTransactions from '../../../pages/subscriber/SubscriberTransactions';
import SubscriberProfile from '../../../pages/subscriber/SubscriberProfile';
import SubscriberLogin from '../../../pages/subscriber/SubscriberLogin';

const SubscriberLayout = () => {
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
                    <Route path="/customer/login" component={SubscriberLogin} />
                    <Route path="/customer">
                        <Redirect to="/customer/login" />
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
                        <Route path="/customer" exact>
                            <Redirect to="/customer/groups" />
                        </Route>
                        <Route path="/customer/dashboard" component={SubscriberDashboard} />
                        <Route path="/customer/groups" exact component={SubscriberGroups} />
                        <Route path="/customer/groups/:groupId/:grpSubId/auction" component={SubscriberLiveAuction} />
                        <Route path="/customer/groups/:groupId/:grpSubId" component={SubscriberGroupDetails} />
                        <Route path="/customer/transactions" component={SubscriberTransactions} />
                        <Route path="/customer/profile" component={SubscriberProfile} />
                        <Route path="/customer/login">
                            <Redirect to="/customer/groups" />
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

export default SubscriberLayout;
