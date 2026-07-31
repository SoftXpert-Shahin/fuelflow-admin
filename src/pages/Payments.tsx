import { useEffect, useState } from "react";
import {
     
    MdSearch,
} from "react-icons/md";

import { getPayments } from "../services/payments.ts";

export default function Payments() {

    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {

        setLoading(true);

        try {

            const data = await getPayments();

            setPayments(data);

        } finally {

            setLoading(false);

        }

    }

    const filtered = payments.filter(payment => {

        const keyword = search.toLowerCase();

        return (

            payment.customer_name?.toLowerCase().includes(keyword) ||

            payment.transaction_id?.toLowerCase().includes(keyword) ||

            payment.payment_method?.toLowerCase().includes(keyword)

        );

    });

    return (

        <div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            color: "white",
                        }}
                    >
                        Payments
                    </h1>

                    <p
                        style={{
                            color: "#94A3B8",
                            marginTop: 6,
                        }}
                    >
                        Total Payments : {filtered.length}
                    </p>

                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#111827",
                        border: "1px solid #334155",
                        borderRadius: 10,
                        paddingInline: 12,
                        width: 260,
                    }}
                >

                    <MdSearch color="#94A3B8" />

                    <input
                        placeholder="Search payment..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            flex: 1,
                            padding: 12,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "white",
                        }}
                    />

                </div>

            </div>

            <div
                style={{
                    background: "#111827",
                    borderRadius: 14,
                    overflow: "hidden",
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#1F2937",
                            }}
                        >

                            <th style={th}>Transaction</th>
                            <th style={th}>Customer</th>
                            <th style={th}>Method</th>
                            <th style={th}>Amount</th>
                            <th style={th}>Status</th>
                            <th style={th}>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    style={empty}
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : filtered.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    style={empty}
                                >
                                    No payments found
                                </td>

                            </tr>

                        ) : (

                            filtered.map(payment => (

                                <tr
                                    key={payment.id}
                                    style={{
                                        borderBottom:
                                            "1px solid #1F2937",
                                    }}
                                >

                                    <td style={td}>
                                        {payment.transaction_id}
                                    </td>

                                    <td style={td}>
                                        {payment.customer_name}
                                    </td>

                                    <td style={td}>
                                        {payment.payment_method}
                                    </td>

                                    <td style={td}>
                                        ৳{payment.amount}
                                    </td>

                                    <td style={td}>

                                        <span
                                            style={{
                                                background:
                                                    payment.status === "paid"
                                                        ? "#16A34A"
                                                        : "#F59E0B",
                                                color: "white",
                                                padding:
                                                    "5px 12px",
                                                borderRadius: 20,
                                            }}
                                        >
                                            {payment.status}
                                        </span>

                                    </td>

                                    <td style={td}>
                                        {new Date(
                                            payment.created_at,
                                        ).toLocaleDateString()}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

const th: React.CSSProperties = {
    padding: 16,
    textAlign: "left",
    color: "#CBD5E1",
};

const td: React.CSSProperties = {
    padding: 16,
    color: "white",
};

const empty: React.CSSProperties = {
    padding: 40,
    textAlign: "center",
    color: "#94A3B8",
};