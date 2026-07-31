import { useEffect, useState } from "react";
import {
    MdLocalGasStation,
    MdLocationOn,
} from "react-icons/md";
import { getStations } from "../services/stations";

export default function FuelStations() {

    const [stations, setStations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadStations();
    }, []);

    async function loadStations() {
        setLoading(true);

        try {
            const data = await getStations();
            setStations(data);
        } finally {
            setLoading(false);
        }
    }

    const filtered = stations.filter((station) => {

        const keyword = search.toLowerCase();

        return (
            station.name?.toLowerCase().includes(keyword) ||
            station.address?.toLowerCase().includes(keyword)
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
                        Fuel Stations
                    </h1>

                    <p
                        style={{
                            color: "#94A3B8",
                            marginTop: 6,
                        }}
                    >
                        Total Stations : {filtered.length}
                    </p>

                </div>

                <input
                    placeholder="Search station..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: 260,
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #334155",
                        background: "#111827",
                        color: "white",
                    }}
                />

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

                            <th style={th}>Station</th>
                            <th style={th}>Address</th>
                            <th style={th}>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan={3}
                                    style={emptyStyle}
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : filtered.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={3}
                                    style={emptyStyle}
                                >
                                    No fuel stations found.
                                </td>

                            </tr>

                        ) : (

                            filtered.map((station) => (

                                <tr
                                    key={station.id}
                                    style={{
                                        borderBottom:
                                            "1px solid #1F2937",
                                    }}
                                >

                                    <td style={td}>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: "50%",
                                                    background: "#2563EB",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >

                                                <MdLocalGasStation
                                                    color="white"
                                                    size={22}
                                                />

                                            </div>

                                            {station.name}

                                        </div>

                                    </td>

                                    <td style={td}>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                            }}
                                        >

                                            <MdLocationOn />

                                            {station.address}

                                        </div>

                                    </td>

                                    <td style={td}>

                                        <span
                                            style={{
                                                background:
                                                    station.active
                                                        ? "#16A34A"
                                                        : "#DC2626",
                                                color: "white",
                                                padding:
                                                    "6px 12px",
                                                borderRadius: 20,
                                                fontSize: 13,
                                            }}
                                        >
                                            {station.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

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

const emptyStyle: React.CSSProperties = {
    padding: 40,
    textAlign: "center",
    color: "#94A3B8",
};