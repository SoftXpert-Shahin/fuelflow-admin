import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { MdTrendingUp } from "react-icons/md";

const data = [
    { day: "Mon", revenue: 320 },
    { day: "Tue", revenue: 510 },
    { day: "Wed", revenue: 420 },
    { day: "Thu", revenue: 730 },
    { day: "Fri", revenue: 910 },
    { day: "Sat", revenue: 670 },
    { day: "Sun", revenue: 980 },
];

export default function RevenueChart() {
    return (
        <div
            style={{
                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(10, 14, 23, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    <linearGradient id="blueLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                </defs>
            </svg>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <h3
                        style={{
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            margin: "0 0 4px 0",
                        }}
                    >
                        Revenue Velocity
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                        Weekly financial performance stream
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(37, 99, 235, 0.12)",
                        border: "1px solid rgba(37, 99, 235, 0.25)",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        color: "#60a5fa",
                        fontSize: "12px",
                        fontWeight: 600,
                    }}
                >
                    <MdTrendingUp size={16} />
                    <span>+18.4%</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.04)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="day"
                        stroke="#64748b"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        dx={-5}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "rgba(11, 15, 25, 0.95)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                            color: "#ffffff",
                            padding: "10px 14px",
                        }}
                        itemStyle={{ color: "#60a5fa", fontWeight: 600, fontSize: "13px" }}
                        labelStyle={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}
                        formatter={(value: any) => [`$${value}`, "Revenue"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="url(#blueLineGradient)"
                        strokeWidth={3.5}
                        dot={{ r: 4, fill: "#2563eb", stroke: "#93c5fd", strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: "#60a5fa", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}