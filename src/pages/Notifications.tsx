import { useEffect, useState } from "react";
import {
    MdNotifications,
    MdSend,
     
} from "react-icons/md";

import {
    getNotifications,
    sendNotification,
} from "../services/notifications";

export default function Notifications() {

    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [target, setTarget] = useState("all");

    useEffect(() => {
        loadNotifications();
    }, []);

    async function loadNotifications() {
        setLoading(true);

        try {
            const data = await getNotifications();
            setNotifications(data);
        } finally {
            setLoading(false);
        }
    }

    async function handleSend() {

        if (!title || !message) return;

        await sendNotification({
            title,
            message,
            target,
        });

        setTitle("");
        setMessage("");

        loadNotifications();
    }

    return (

        <div>

            <h1
                style={{
                    color: "white",
                    marginBottom: 25,
                }}
            >
                Notifications
            </h1>

            <div
                style={{
                    background: "#111827",
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 25,
                }}
            >

                <input
                    placeholder="Notification title"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    style={input}
                />

                <textarea
                    placeholder="Notification message"
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    rows={5}
                    style={{
                        ...input,
                        marginTop: 15,
                        resize: "vertical",
                    }}
                />

                <select
                    value={target}
                    onChange={(e) =>
                        setTarget(e.target.value)
                    }
                    style={{
                        ...input,
                        marginTop: 15,
                    }}
                >
                    <option value="all">All Users</option>
                    <option value="customers">Customers</option>
                    <option value="drivers">Drivers</option>
                </select>

                <button
                    onClick={handleSend}
                    style={button}
                >
                    <MdSend />
                    Send Notification
                </button>

            </div>

            <div
                style={{
                    background: "#111827",
                    borderRadius: 12,
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
                            <th style={th}>Title</th>
                            <th style={th}>Target</th>
                            <th style={th}>Message</th>
                            <th style={th}>Date</th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan={4}
                                    style={empty}
                                >
                                    Loading...
                                </td>
                            </tr>

                        ) : notifications.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={4}
                                    style={empty}
                                >
                                    No notifications found
                                </td>
                            </tr>

                        ) : (

                            notifications.map(item => (

                                <tr
                                    key={item.id}
                                    style={{
                                        borderBottom:
                                            "1px solid #1F2937",
                                    }}
                                >

                                    <td style={td}>
                                        <MdNotifications
                                            style={{
                                                marginRight: 8,
                                            }}
                                        />
                                        {item.title}
                                    </td>

                                    <td style={td}>
                                        {item.target}
                                    </td>

                                    <td style={td}>
                                        {item.message}
                                    </td>

                                    <td style={td}>
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString()}
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

const input: React.CSSProperties = {
    width: "100%",
    padding: 12,
    background: "#1F2937",
    border: "1px solid #374151",
    borderRadius: 10,
    color: "white",
    boxSizing: "border-box",
};

const button: React.CSSProperties = {
    marginTop: 20,
    padding: "12px 22px",
    background: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
};

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