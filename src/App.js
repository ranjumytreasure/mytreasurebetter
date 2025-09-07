import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Sidebar, Footer, SignUp, VerifyOTP, Login, ForgetPassword, Home, Navbar, Company, Winner, Subscribers, PersonalSettings, Dashboard, AdminSettings, AreaSubscribersPage, ScrollToTop } from './components';
import { LandingPage, SubscriberStepForm, GroupStepForm, AddGroupSubscriber, HomePage, GroupsPage, AuctionsPage, AddSubcriber, GroupAccountDetails, AddCompanySubcriber, Faq, AddSub, Help, UserDue, CustomerDue, PrivacyPolicy, TermsandConditions, SingleSubscriberPage, SingleEmployeePage, DashboardPage, Receivables, Payables, SubscriberProfile, Ledger, ProductsPage } from './pages';
import { UserProvider } from './context/user_context';

import { GroupDetailsProvider } from './context/group_context';
import { GroupsDetailsProvider } from './context/groups_context';
import { CompanySubscriberProvider } from './context/companysubscriber_context';
import { LedgerAccountProvider } from './context/ledgerAccount_context';
import { LedgerEntryProvider } from './context/ledgerEntry_context';
import { ReceivablesProvider } from './context/receivables_context';
import { PayablesProvider } from './context/payables_context';
import { AobProvider } from './context/aob_context';
import { EmployeeProvider } from './context/employee_context';
import { ProductProvider } from './context/product_context';

import PrivateRoute from './pages/PrivateRoute';
import { DashboardProvider } from './context/dashboard_context';


function App() {
    return (
        <UserProvider>
            <EmployeeProvider>
                <AobProvider>
                    <DashboardProvider>
                        <GroupsDetailsProvider>
                            <GroupDetailsProvider>
                                <CompanySubscriberProvider>
                                    <LedgerAccountProvider>
                                        <LedgerEntryProvider>
                                            <ReceivablesProvider>
                                                <PayablesProvider>
                                                    <ProductProvider>
                                                        <Router>
                                                            <ScrollToTop />

                                                            <Navbar />

                                                            <Sidebar />

                                                            <Switch>
                                                                {/* Other routes */}
                                                                <Route path="/" exact component={LandingPage} />
                                                                <PrivateRoute path="/home" component={HomePage} />
                                                                <Route path="/signup">
                                                                    <div>
                                                                        <SignUp />
                                                                    </div>
                                                                </Route>
                                                                <Route path="/verify-otp">
                                                                    <VerifyOTP />
                                                                </Route>
                                                                <Route path="/login" component={Login} />
                                                                <Route path="/forgotpassword" component={ForgetPassword} />
                                                                <PrivateRoute path="/company" component={Company} />

                                                                <PrivateRoute path="/groups/:groupId/auctions/winner/:reserve" component={Winner} />

                                                                <Route exact path="/startagroup" component={GroupStepForm} />

                                                                <Route exact path="/Faq" component={Faq} />

                                                                <Route exact path="/help" component={Help} />

                                                                {/* <PrivateRoute exact path="/addgroupsubscriber/:groupId" component={AddGroupSubscriber} /> */}


                                                                {/* ned to come back if AddSb doesnt work  */}


                                                                <PrivateRoute exact path="/addgroupsubscriber/:groupId/addnew" component={AddSubcriber} />

                                                                <PrivateRoute exact path="/addgroupsubscriber/:groupId/addcompanysubcriber" component={Subscribers} />

                                                                <PrivateRoute exact path="/addgroupsubscriber/:groupId" component={AddSub} />

                                                                <PrivateRoute exact path="/addcompanysubscriber/:membershipId" component={AddCompanySubcriber} />

                                                                <PrivateRoute exact path="/addcompanymultisubscriber/:membershipId" component={SubscriberStepForm} />

                                                                <PrivateRoute exact path="/groups/:groupId" component={GroupsPage} />

                                                                <PrivateRoute exact path="/groups/:group_id/accounts/:grpAccountId" component={GroupAccountDetails} />


                                                                <PrivateRoute path="/groups/:groupId/auctions/date/:nextAuctionDate"
                                                                    component={AuctionsPage} />


                                                                <PrivateRoute path="/subscribers"
                                                                    component={Subscribers} />

                                                                <PrivateRoute path="/groups/:groupId/your-due" component={UserDue} />
                                                                <PrivateRoute path="/groups/:groupId/customer-due" component={CustomerDue} />

                                                                <PrivateRoute path="/personal-settings" component={PersonalSettings} />
                                                                <PrivateRoute exact path="/subscribers" component={Subscribers} />

                                                                <PrivateRoute path="/dashboard" component={DashboardPage} />

                                                                <PrivateRoute path="/admin-settings" component={AdminSettings} />

                                                                <PrivateRoute path="/ledger" component={Ledger} />

                                                                <PrivateRoute exact path="/receivables" component={Receivables} />

                                                                <PrivateRoute exact path="/payables" component={Payables} />

                                                                <PrivateRoute exact path="/products" component={ProductsPage} />

                                                                <Route path="/Privacy&Policy" component={PrivacyPolicy} />
                                                                <Route path="/Terms&Conditions" component={TermsandConditions} />

                                                                <PrivateRoute path="/subscriber/:id" component={SubscriberProfile} />
                                                                {/* <PrivateRoute path="/subscriber/:id" component={SingleSubscriberPage} /> */}

                                                                <PrivateRoute path="/employee/:id" component={SingleEmployeePage} />
                                                                <PrivateRoute path="/collector/:id" component={SingleEmployeePage} />

                                                                {/* Private route for the area subscribers page */}


                                                                <PrivateRoute path="/emp/:employeeId/areasubscribers" component={AreaSubscribersPage} />

                                                                <PrivateRoute path="/samplesubcriber" component={SubscriberProfile} />




                                                            </Switch>

                                                            <Footer />

                                                        </Router>
                                                    </ProductProvider>
                                                </PayablesProvider>
                                            </ReceivablesProvider>
                                        </LedgerEntryProvider>
                                    </LedgerAccountProvider>
                                </CompanySubscriberProvider>
                            </GroupDetailsProvider>
                        </GroupsDetailsProvider>

                    </DashboardProvider>
                </AobProvider>
            </EmployeeProvider>
        </UserProvider >

    );
}

export default App; 