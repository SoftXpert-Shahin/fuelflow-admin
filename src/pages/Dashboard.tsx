import { useEffect, useState, type CSSProperties  } from "react";
import {
    MdShoppingCart,
    MdPending,
    MdLocalShipping,
    MdCheckCircle,
    MdPeople,
    MdDirectionsCar,
    MdWifi,
    MdAttachMoney,
     
} from "react-icons/md";
import StatCard from "../components/dashboard/StatCard";
import RecentOrders from "../components/dashboard/RecentOrders";
import LiveOrders from "../components/dashboard/LiveOrders";
import RevenueChart from "../components/dashboard/RevenueChart";
import {
    getDashboardStats,
    subscribeDashboard,
} from "../services/dashboard";
export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        load();
    
        const unsubscribe = subscribeDashboard(load);
    
        return unsubscribe;
    
    }, []);
    async function load() {
        setLoading(true);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={styles.centerScreen}>
                <div style={styles.spinnerWrapper}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading Enterprise Telemetry...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header Area */}
            <div style={styles.headerSection}>
                <div>
                    <h1 style={styles.mainTitle}>
                        Executive <span style={styles.gradientText}>Dashboard</span>
                    </h1>
                    <p style={styles.subtitle}>Real-time analytics, infrastructure status, and financial streams.</p>
                </div>
                <div style={styles.livePulseContainer}>
                    <span style={styles.pulseDot}></span>
                    <span style={styles.pulseText}>Live System Active</span>
                </div>
            </div>

            {/* Statistics Grid */}
            <div style={styles.statsGrid}>
                <StatCard
                    title="Total Orders"
                    value={stats?.totalOrders ?? 0}
                    icon={<MdShoppingCart size={24} color="#60a5fa" />}
                    color="#2563EB"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats?.pendingOrders ?? 0}
                    icon={<MdPending size={24} color="#f59e0b" />}
                    color="#F59E0B"
                />
                <StatCard
                    title="Active Orders"
                    value={stats?.activeOrders ?? 0}
                    icon={<MdLocalShipping size={24} color="#06b6d4" />}
                    color="#06B6D4"
                />
                <StatCard
                    title="Completed Orders"
                    value={stats?.completedOrders ?? 0}
                    icon={<MdCheckCircle size={24} color="#34d399" />}
                    color="#16A34A"
                />
                <StatCard
                    title="Total Customers"
                    value={stats?.totalCustomers ?? 0}
                    icon={<MdPeople size={24} color="#a78bfa" />}
                    color="#7C3AED"
                />
                <StatCard
                    title="Fleet Drivers"
                    value={stats?.totalDrivers ?? 0}
                    icon={<MdDirectionsCar size={24} color="#fb923c" />}
                    color="#EA580C"
                />
                <StatCard
                    title="Online Drivers"
                    value={stats?.onlineDrivers ?? 0}
                    icon={<MdWifi size={24} color="#34d399" />}
                    color="#10B981"
                />
                <StatCard
                    title="Gross Revenue"
                    value={`৳${(stats?.totalRevenue ?? 0).toLocaleString()}`}
                    icon={<MdAttachMoney size={24} color="#38bdf8" />}
                    color="#0EA5E9"
                />
            </div>

            {/* Main Analytical Section (Chart & Live Feed) */}
            <div style={styles.analyticsLayout}>
                <div style={styles.chartSectionWrapper}>
                    <RevenueChart />
                </div>
                <div style={styles.liveOrdersWrapper}>
                    <LiveOrders />
                </div>
            </div>

            {/* Recent Orders Section */}
            <div style={styles.recentOrdersSection}>
                <RecentOrders />
            </div>
            
        
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        padding: "32px 40px",
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #0b0f19 0%, #030712 60%, #000000 100%)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#f8fafc",
        boxSizing: "border-box"
    },
    centerScreen: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#030712"
    },
    spinnerWrapper: {
        textAlign: "center"
    },
    spinner: {
        width: "48px",
        height: "48px",
        border: "3px solid rgba(37, 99, 235, 0.2)",
        borderTop: "3px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto 16px auto"
    },
    loadingText: {
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.5px"
    },
    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "16px"
    },
    mainTitle: {
        fontSize: "32px",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        margin: "0 0 6px 0",
        color: "#ffffff"
    },
    gradientText: {
        background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    subtitle: {
        color: "#94a3b8",
        fontSize: "14px",
        margin: 0
    },
    livePulseContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        padding: "6px 14px",
        borderRadius: "20px"
    },
    pulseDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#10b981",
        boxShadow: "0 0 10px #10b981"
    },
    pulseText: {
        color: "#34d399",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase"
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        marginBottom: "32px"
    },
    analyticsLayout: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
        marginBottom: "32px"
    },
    chartSectionWrapper: {
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
    },
    liveOrdersWrapper: {
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
    },
    recentOrdersSection: {
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
    }
};