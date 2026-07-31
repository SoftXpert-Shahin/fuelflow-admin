import { useEffect, useState } from "react";
import { MdPeople, MdSearch, MdEmail, MdPhone, MdCheckCircle } from "react-icons/md";
import { getCustomers } from "../services/customers";

export default function Customers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        setLoading(true);
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers", error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = customers.filter((customer) => {
        const keyword = search.toLowerCase();
        return (
            customer.full_name?.toLowerCase().includes(keyword) ||
            customer.phone?.toLowerCase().includes(keyword) ||
            customer.email?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#f8fafc" }}>
            
            {/* Header & Search Section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "28px",
                    flexWrap: "wrap",
                    gap: "16px",
                }}
            >
                <div>
                    <h1
                        style={{
                            color: "#ffffff",
                            margin: "0 0 6px 0",
                            fontSize: "28px",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Customers Management
                    </h1>

                    <p
                        style={{
                            color: "#94A3B8",
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        Total Registered Customers: <span style={{ color: "#60a5fa", fontWeight: 700 }}>{filtered.length}</span>
                    </p>
                </div>

                <div
                    style={{
                        width: "280px",
                        height: "42px",
                        background: "rgba(17, 24, 39, 0.8)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        paddingInline: "14px",
                        gap: "10px",
                        transition: "all 0.2s ease",
                    }}
                >
                    <MdSearch color="#94A3B8" size={18} />
                    <input
                        placeholder="Search customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    />
                </div>
            </div>

            {/* Table Container */}
            <div
                style={{
                    background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "rgba(31, 41, 55, 0.5)",
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                                }}
                            >
                                <th style={th}>Customer Details</th>
                                <th style={th}>Phone Number</th>
                                <th style={th}>Email Address</th>
                                <th style={th}>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        style={{
                                            padding: "60px",
                                            textAlign: "center",
                                            color: "#94a3b8",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                        }}
                                    >
                                        <div style={{
                                            width: "32px",
                                            height: "32px",
                                            border: "3px solid rgba(37, 99, 235, 0.2)",
                                            borderTop: "3px solid #3b82f6",
                                            borderRadius: "50%",
                                            animation: "spin 0.8s linear infinite",
                                            margin: "0 auto 12px auto"
                                        }}></div>
                                        Loading customer directory...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        style={{
                                            padding: "60px",
                                            textAlign: "center",
                                            color: "#94A3B8",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                        }}
                                    >
                                        No matching customers found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        style={{
                                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                            transition: "background 0.2s ease",
                                        }}
                                    >
                                        <td style={td}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "14px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "12px",
                                                        background: "rgba(37, 99, 235, 0.15)",
                                                        border: "1px solid rgba(96, 165, 250, 0.3)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <MdPeople color="#60a5fa" size={20} />
                                                </div>
                                                <span style={{ fontWeight: 600, color: "#ffffff", fontSize: "14px" }}>
                                                    {customer.full_name || "Unnamed Customer"}
                                                </span>
                                            </div>
                                        </td>

                                        <td style={td}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                                                <MdPhone size={15} color="#94a3b8" />
                                                {customer.phone || "-"}
                                            </div>
                                        </td>

                                        <td style={td}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                                                <MdEmail size={15} color="#94a3b8" />
                                                {customer.email || "-"}
                                            </div>
                                        </td>

                                        <td style={td}>
                                            <span
                                                style={{
                                                    background: "rgba(34, 197, 94, 0.15)",
                                                    border: "1px solid rgba(74, 222, 128, 0.3)",
                                                    color: "#4ade80",
                                                    padding: "5px 12px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                }}
                                            >
                                                <MdCheckCircle size={13} />
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const th: React.CSSProperties = {
    padding: "16px 24px",
    textAlign: "left",
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
};

const td: React.CSSProperties = {
    padding: "16px 24px",
    color: "#ffffff",
};