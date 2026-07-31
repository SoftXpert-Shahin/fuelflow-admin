import { useEffect, useState } from "react";
import {
    MdAdd,
    MdDelete,
    MdEdit,
    MdCampaign,
    MdSave,
    MdClose,
} from "react-icons/md";

import {
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    subscribeToPromotions,
} from "../services/promotionService";

const gradients = [
    ["#0d1527", "#050811"],
    ["#0A1F1C", "#05100D"],
    ["#181028", "#080512"],
    ["#2C1B0F", "#120803"],
    ["#10202B", "#051017"],
    ["#182A13", "#071007"],
];

export default function Promotions() {
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [promotions, setPromotions] = useState<any[]>([]);

    const emptyForm = {
        id: "",
        title: "",
        subtitle: "",
        tag: "",
        target_app: "both",
        sort_order: 0,
        is_active: true,
        starts_at: "",
        ends_at: "",
    };

    const [form, setForm] = useState<any>(emptyForm);

    async function load() {
        setLoading(true);
        const data = await getPromotions();
        setPromotions(data);
        setLoading(false);
    }

    useEffect(() => {
        load();
        const unsubscribe = subscribeToPromotions(load);
        return unsubscribe;
    }, []);

    function openCreate() {
        setForm(emptyForm);
        setShowModal(true);
    }

    function openEdit(item: any) {
        setForm({
            ...item,
            starts_at: item.starts_at
                ? item.starts_at.substring(0, 16)
                : "",
            ends_at: item.ends_at
                ? item.ends_at.substring(0, 16)
                : "",
        });

        setShowModal(true);
    }

    async function savePromotion() {
        const payload = {
            title: form.title,
            subtitle: form.subtitle,
            tag: form.tag,
            target_app: form.target_app,
            sort_order: Number(form.sort_order),
            is_active: form.is_active,
            starts_at: form.starts_at || null,
            ends_at: form.ends_at || null,
        };

        if (form.id) {
            await updatePromotion(form.id, payload);
        } else {
            await createPromotion(payload);
        }

        setShowModal(false);
        load();
    }

    async function remove(id: string) {
        if (!window.confirm("Delete promotion?")) return;

        await deletePromotion(id);

        load();
    }

    async function toggle(item: any) {
        await updatePromotion(item.id, {
            is_active: !item.is_active,
        });

        load();
    }

    return (
        <div
            style={{
                padding: 40,
                minHeight: "100vh",
                background:
                    "radial-gradient(circle at top left,#0b1220,#05070c,#000)",
                color: "#fff",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 30,
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 34,
                            fontWeight: 800,
                        }}
                    >
                        Promotions
                    </h1>

                    <p
                        style={{
                            color: "#94A3B8",
                            marginTop: 6,
                        }}
                    >
                        Customer / Driver Banner Manager
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    style={{
                        background: "#2563EB",
                        color: "#fff",
                        border: 0,
                        borderRadius: 12,
                        padding: "12px 18px",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        cursor: "pointer",
                        fontWeight: 700,
                    }}
                >
                    <MdAdd size={20} />
                    Add Promotion
                </button>
            </div>

            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gap: 20,
                    }}
                >
                    {promotions.map((item, index) => (
                        <div
                            key={item.id}
                            style={{
                                background: `linear-gradient(135deg,${gradients[index % gradients.length][0]},${gradients[index % gradients.length][1]})`,
                                borderRadius: 20,
                                padding: 24,
                                border:
                                    "1px solid rgba(255,255,255,.08)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            gap: 10,
                                        }}
                                    >
                                        <MdCampaign
                                            color="#38BDF8"
                                            size={22}
                                        />

                                        <h2
                                            style={{
                                                margin: 0,
                                            }}
                                        >
                                            {item.title}
                                        </h2>
                                    </div>

                                    <p
                                        style={{
                                            color:
                                                "#CBD5E1",
                                            marginTop: 10,
                                        }}
                                    >
                                        {item.subtitle}
                                    </p>

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: 10,
                                            marginTop: 15,
                                            flexWrap:
                                                "wrap",
                                        }}
                                    >
                                        <span>
                                            {item.target_app.toUpperCase()}
                                        </span>

                                        <span>
                                            {item.tag}
                                        </span>

                                        <span>
                                            Sort :
                                            {item.sort_order}
                                        </span>

                                        <span>
                                            {item.is_active
                                                ? "ACTIVE"
                                                : "INACTIVE"}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        gap: 10,
                                        alignItems:
                                            "flex-start",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            toggle(item)
                                        }
                                    >
                                        {item.is_active
                                            ? "Disable"
                                            : "Enable"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            openEdit(item)
                                        }
                                    >
                                        <MdEdit />
                                    </button>

                                    <button
                                        onClick={() =>
                                            remove(item.id)
                                        }
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,.65)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            width: 650,
                            background: "#111827",
                            borderRadius: 20,
                            padding: 30,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                marginBottom: 20,
                            }}
                        >
                            <h2>
                                {form.id
                                    ? "Edit Promotion"
                                    : "New Promotion"}
                            </h2>

                            <MdClose
                                size={26}
                                style={{
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    setShowModal(false)
                                }
                            />
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 20,
                            }}
                        >
                            <div>
                                <label style={label}>
                                    Title
                                </label>

                                <input
                                    style={input}
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            title:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label style={label}>
                                    Tag
                                </label>

                                <input
                                    style={input}
                                    value={form.tag}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            tag:
                                                e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1",
                                }}
                            >
                                <label style={label}>
                                    Subtitle
                                </label>

                                <textarea
                                    style={{
                                        ...input,
                                        height: 90,
                                        resize: "none",
                                    }}
                                    value={
                                        form.subtitle
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            subtitle:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label style={label}>
                                    Target App
                                </label>

                                <select
                                    style={input}
                                    value={
                                        form.target_app
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            target_app:
                                                e.target
                                                    .value,
                                        })
                                    }
                                >
                                    <option value="both">
                                        Both
                                    </option>

                                    <option value="customer">
                                        Customer
                                    </option>

                                    <option value="driver">
                                        Driver
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label style={label}>
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    style={input}
                                    value={
                                        form.sort_order
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            sort_order:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label style={label}>
                                    Start Date
                                </label>

                                <input
                                    type="datetime-local"
                                    style={input}
                                    value={
                                        form.starts_at
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            starts_at:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label style={label}>
                                    End Date
                                </label>

                                <input
                                    type="datetime-local"
                                    style={input}
                                    value={
                                        form.ends_at
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            ends_at:
                                                e.target
                                                    .value,
                                        })
                                    }
                                />
                            </div>

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 10,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        form.is_active
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            is_active:
                                                e.target
                                                    .checked,
                                        })
                                    }
                                />

                                Active Promotion
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: 30,
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                gap: 12,
                            }}
                        >
                            <button
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                                style={{
                                    padding:
                                        "12px 18px",
                                    borderRadius: 10,
                                    border:
                                        "1px solid #374151",
                                    background:
                                        "transparent",
                                    color: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    savePromotion
                                }
                                style={{
                                    padding:
                                        "12px 18px",
                                    borderRadius: 10,
                                    border: 0,
                                    background:
                                        "#2563EB",
                                    color: "#fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 8,
                                    fontWeight: 700,
                                }}
                            >
                                <MdSave />
                                Save Promotion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const label: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    color: "#CBD5E1",
    fontWeight: 600,
    fontSize: 13,
};

const input: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    background: "#1F2937",
    color: "#fff",
    border: "1px solid #374151",
    outline: "none",
    boxSizing: "border-box",
};