import React, { useState, useEffect } from 'react';
import { useDailyCollectionContext } from '../../context/dailyCollection/DailyCollectionContext';
import { useUserContext } from '../../context/user_context';
import { API_BASE_URL } from '../../utils/apiConfig';
import { SimpleBarChart, SimplePieChart, SimpleLineChart } from '../../components/dailyCollection/Charts';
import {
    FiTrendingUp,
    FiTrendingDown,
    FiUsers,
    FiDollarSign,
    FiCreditCard,
    FiCalendar,
    FiBarChart,
    FiPieChart,
    FiRefreshCw,
    FiDownload,
    FiEye,
    FiFilter
} from 'react-icons/fi';

const DashboardPage = () => {
    const { user } = useUserContext();
    const { companies, products, loans } = useDailyCollectionContext();

    const [dashboardData, setDashboardData] = useState({
        totalCompanies: 0,
        totalProducts: 0,
        totalLoans: 0,
        activeLoans: 0,
        totalDisbursed: 0,
        totalCollected: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        monthlyTarget: 0,
        monthlyAchieved: 0,
        recentActivity: [],
        topProducts: [],
        loanStatusBreakdown: {},
        monthlyTrends: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30'); // days
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            console.log('=== DASHBOARD DATA FETCH START ===');
            console.log('User:', user);
            console.log('User token:', user?.results?.token ? 'Present' : 'Missing');
            console.log('API Base URL:', API_BASE_URL);

            if (!user?.results?.token) {
                console.log('❌ No user token, skipping API call');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const membershipId = user?.results?.userAccounts?.[0]?.parent_membership_id;
                console.log('Membership ID:', membershipId);
                console.log('Selected Period:', selectedPeriod);

                const apiUrl = `${API_BASE_URL}/dc/dashboard?parent_membership_id=${membershipId}&period=${selectedPeriod}`;
                console.log('Making API call to:', apiUrl);
                console.log('🔍 Testing if dashboard endpoint exists...');

                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${user.results.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ API Response:', data);
                    setDashboardData(data.results || {});
                } else {
                    const errorData = await response.json();
                    console.error('❌ API Error:', errorData);

                    // Fallback to basic calculations if API not available
                    console.log('🔄 Using fallback data from context');
                    console.log('Companies from context:', companies);
                    console.log('Products from context:', products);
                    console.log('Loans from context:', loans);

                    // Calculate loan status breakdown
                    const loanStatusBreakdown = {};
                    loans.forEach(loan => {
                        loanStatusBreakdown[loan.status] = (loanStatusBreakdown[loan.status] || 0) + 1;
                    });

                    setDashboardData({
                        totalCompanies: companies.length,
                        totalProducts: products.length,
                        totalLoans: loans.length,
                        activeLoans: loans.filter(loan => loan.status === 'ACTIVE').length,
                        totalDisbursed: loans.reduce((sum, loan) => sum + (parseFloat(loan.principal_amount) || 0), 0),
                        totalCollected: loans.reduce((sum, loan) => sum + (parseFloat(loan.principal_amount) - parseFloat(loan.closing_balance) || 0), 0),
                        pendingAmount: loans.reduce((sum, loan) => sum + (parseFloat(loan.closing_balance) || 0), 0),
                        overdueAmount: loans.filter(loan => loan.status === 'OVERDUE').reduce((sum, loan) => sum + (parseFloat(loan.closing_balance) || 0), 0),
                        recentActivity: [],
                        topProducts: [],
                        loanStatusBreakdown: loanStatusBreakdown,
                        monthlyTrends: []
                    });
                }
            } catch (error) {
                console.error('❌ Error fetching dashboard data:', error);
                console.log('🔄 Using fallback data from context due to error');

                // Calculate loan status breakdown for error fallback
                const loanStatusBreakdown = {};
                loans.forEach(loan => {
                    loanStatusBreakdown[loan.status] = (loanStatusBreakdown[loan.status] || 0) + 1;
                });

                // Fallback to basic calculations on error
                setDashboardData({
                    totalCompanies: companies.length,
                    totalProducts: products.length,
                    totalLoans: loans.length,
                    activeLoans: loans.filter(loan => loan.status === 'ACTIVE').length,
                    totalDisbursed: loans.reduce((sum, loan) => sum + (parseFloat(loan.principal_amount) || 0), 0),
                    totalCollected: loans.reduce((sum, loan) => sum + (parseFloat(loan.principal_amount) - parseFloat(loan.closing_balance) || 0), 0),
                    pendingAmount: loans.reduce((sum, loan) => sum + (parseFloat(loan.closing_balance) || 0), 0),
                    overdueAmount: loans.filter(loan => loan.status === 'OVERDUE').reduce((sum, loan) => sum + (parseFloat(loan.closing_balance) || 0), 0),
                    recentActivity: [],
                    topProducts: [],
                    loanStatusBreakdown: loanStatusBreakdown,
                    monthlyTrends: []
                });
            } finally {
                setIsLoading(false);
                console.log('=== DASHBOARD DATA FETCH END ===');
            }
        };

        fetchDashboardData();
    }, [user, companies, products, loans, selectedPeriod, refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleExport = (type) => {
        // Export functionality will be implemented
        console.log(`Exporting ${type} report...`);
    };

    // Debug: Log dashboard data
    console.log('Dashboard Data:', dashboardData);
    console.log('Is Loading:', isLoading);
    console.log('Companies from context:', companies);
    console.log('Products from context:', products);
    console.log('Loans from context:', loans);
    console.log('User membership ID:', user?.results?.userAccounts?.[0]?.parent_membership_id);
    console.log('Loan Status Breakdown:', dashboardData.loanStatusBreakdown);
    console.log('Monthly Trends:', dashboardData.monthlyTrends);
    console.log('Loan Status Breakdown Type:', typeof dashboardData.loanStatusBreakdown);
    console.log('Loan Status Breakdown Keys:', Object.keys(dashboardData.loanStatusBreakdown || {}));
    console.log('Monthly Trends Length:', dashboardData.monthlyTrends?.length);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Daily Collection Dashboard</h1>
                        <p className="text-gray-600 mt-1">Overview of your daily collection business</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Companies"
                        value={dashboardData.totalCompanies}
                        icon={FiUsers}
                        color="blue"
                        trend={null}
                    />
                    <MetricCard
                        title="Active Products"
                        value={dashboardData.totalProducts}
                        icon={FiCreditCard}
                        color="green"
                        trend={null}
                    />
                    <MetricCard
                        title="Total Loans"
                        value={dashboardData.totalLoans}
                        icon={FiBarChart}
                        color="purple"
                        trend={null}
                    />
                    <MetricCard
                        title="Active Loans"
                        value={dashboardData.activeLoans}
                        icon={FiTrendingUp}
                        color="orange"
                        trend={null}
                    />
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <FinancialCard
                        title="Total Disbursed"
                        value={dashboardData.totalDisbursed}
                        icon={FiDollarSign}
                        color="green"
                        format="currency"
                    />
                    <FinancialCard
                        title="Total Collected"
                        value={dashboardData.totalCollected}
                        icon={FiTrendingUp}
                        color="blue"
                        format="currency"
                    />
                    <FinancialCard
                        title="Pending Amount"
                        value={dashboardData.pendingAmount}
                        icon={FiCalendar}
                        color="orange"
                        format="currency"
                    />
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ChartCard
                        title="Loan Status Breakdown"
                        data={dashboardData.loanStatusBreakdown || {}}
                        type="pie"
                    />
                    <ChartCard
                        title="Monthly Trends"
                        data={dashboardData.monthlyTrends?.map(trend => ({
                            label: trend.month,
                            value: trend.loans
                        })) || []}
                        type="line"
                    />
                </div>

                {/* Recent Activity and Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentActivityCard activities={dashboardData.recentActivity} />
                    <TopProductsCard products={dashboardData.topProducts} />
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <QuickActionButton
                            title="View Reports"
                            icon={FiBarChart}
                            onClick={() => window.location.href = '/daily-collection/user/reports'}
                            color="blue"
                        />
                        <QuickActionButton
                            title="Export Data"
                            icon={FiDownload}
                            onClick={() => handleExport('all')}
                            color="green"
                        />
                        <QuickActionButton
                            title="Manage Companies"
                            icon={FiUsers}
                            onClick={() => window.location.href = '/daily-collection/user/company'}
                            color="purple"
                        />
                        <QuickActionButton
                            title="View Loans"
                            icon={FiCreditCard}
                            onClick={() => window.location.href = '/daily-collection/user/loans'}
                            color="orange"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-gray-500 ml-2">vs last period</span>
                </div>
            )}
        </div>
    );
};

// Financial Card Component
const FinancialCard = ({ title, value, icon: Icon, color, format }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600'
    };

    const formatValue = (val) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(val || 0);
        }
        return val?.toLocaleString() || 0;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

// Chart Card Component
const ChartCard = ({ title, data, type }) => {
    console.log(`ChartCard ${title}:`, { data, type });

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="h-64">
                {type === 'pie' ? (
                    <SimplePieChart data={data} />
                ) : type === 'line' ? (
                    <SimpleLineChart data={data} />
                ) : (
                    <SimpleBarChart data={data} />
                )}
            </div>
        </div>
    );
};

// Recent Activity Card
const RecentActivityCard = ({ activities }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {activities?.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiCalendar className="w-8 h-8 mx-auto mb-2" />
                        <p>No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Top Products Card
const TopProductsCard = ({ products }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
                {products?.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.loans_count} loans</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    ₹{product.total_amount?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiCreditCard className="w-8 h-8 mx-auto mb-2" />
                        <p>No products data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Quick Action Button
const QuickActionButton = ({ title, icon: Icon, onClick, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        green: 'bg-green-50 text-green-600 hover:bg-green-100',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    };

    return (
        <button
            onClick={onClick}
            className={`p-4 rounded-lg transition-colors flex items-center gap-3 ${colorClasses[color]}`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{title}</span>
        </button>
    );
};

export default DashboardPage;
