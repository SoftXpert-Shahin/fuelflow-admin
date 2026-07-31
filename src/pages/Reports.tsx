import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
    MdAttachMoney,
    MdShoppingCart,
    MdPeople,
    MdDirectionsCar,
    MdAssessment,
    MdCheckCircle,
    MdHourglassEmpty,
    MdCancel,
    MdLocalGasStation,
} from "react-icons/md";

import { getReportStats } from "../services/reports";

export default function Reports() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        setLoading(true);

        try {
            const data = await getReportStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8", fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid rgba(37, 99, 235, 0.2)",
                    borderTop: "3px solid #3b82f6",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 12px auto"
                }}></div>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>Gathering analytics data...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "32px 40px", minHeight: "100vh", background: "radial-gradient(circle at top left, #0b0f19 0%, #030712 60%, #000000 100%)", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#f8fafc", boxSizing: "border-box" }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#ffffff", display: "flex", alignItems: "center", gap: "12px" }}>
                    Reports & <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analytics</span>
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                    Monitor high-level performance indicators, transaction volumes, and operational metrics.
                </p>
            </div>

            {/* Stat Cards Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "24px",
                    marginBottom: "32px",
                }}
            >
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue?.toLocaleString() ?? 0}`}
                    icon={<MdAttachMoney size={22} color="#4ade80" />}
                    color="rgba(34, 197, 94, 0.15)"
                    borderColor="rgba(74, 222, 128, 0.3)"
                />

                <StatCard
                    title="Total Orders"
                    value={stats?.totalOrders ?? 0}
                    icon={<MdShoppingCart size={22} color="#60a5fa" />}
                    color="rgba(37, 99, 235, 0.15)"
                    borderColor="rgba(96, 165, 250, 0.3)"
                />

                <StatCard
                    title="Total Customers"
                    value={stats?.totalCustomers ?? 0}
                    icon={<MdPeople size={22} color="#c084fc" />}
                    color="rgba(124, 58, 237, 0.15)"
                    borderColor="rgba(192, 132, 252, 0.3)"
                />

                <StatCard
                    title="Total Drivers"
                    value={stats?.totalDrivers ?? 0}
                    icon={<MdDirectionsCar size={22} color="#fb923c" />}
                    color="rgba(234, 88, 12, 0.15)"
                    borderColor="rgba(251, 146, 60, 0.3)"
                />
            </div>

            {/* System Summary Card & Table */}
            <div
                style={{
                    background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    padding: "28px",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MdAssessment size={20} color="#60a5fa" />
                    </div>
                    <h2
                        style={{
                            color: "white",
                            fontSize: "18px",
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: "-0.01em"
                        }}
                    >
                        System Summary Breakdown
                    </h2>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <tbody>
                            <Row
                                label="Completed Orders"
                                value={stats?.completedOrders ?? 0}
                                icon={<MdCheckCircle size={16} color="#4ade80" />}
                            />
                            <Row
                                label="Pending Orders"
                                value={stats?.pendingOrders ?? 0}
                                icon={<MdHourglassEmpty size={16} color="#fbbf24" />}
                            />
                            <Row
                                label="Cancelled Orders"
                                value={stats?.cancelledOrders ?? 0}
                                icon={<MdCancel size={16} color="#f87171" />}
                            />
                            <Row
                                label="Online Drivers"
                                value={stats?.onlineDrivers ?? 0}
                                icon={<MdDirectionsCar size={16} color="#60a5fa" />}
                            />
                            <Row
                                label="Active Fuel Stations"
                                value={stats?.activeStations ?? 0}
                                icon={<MdLocalGasStation size={16} color="#c084fc" />}
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

type StatCardProps = {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    borderColor: string;
};

function StatCard({ title, value, icon, color, borderColor }: StatCardProps) {
    return (
        <div
            style={{
                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                backdropFilter: "blur(20px)",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {title}
                </span>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: color, border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                {value}
            </div>
        </div>
    );
}

type RowProps = {
    label: string;
    value: string | number;
    icon: ReactNode;
};

function Row({ label, value, icon }: RowProps) {
    return (
        <tr
            style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "background 0.2s ease",
            }}
        >
            <td
                style={{
                    padding: "16px 12px",
                    color: "#cbd5e1",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>{icon}</div>
                {label}
            </td>

            <td
                style={{
                    padding: "16px 12px",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "15px",
                    textAlign: "right",
                }}
            >
                {value}
            </td>
        </tr>
    );
}