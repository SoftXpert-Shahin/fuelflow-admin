import { useEffect, useState } from "react";
import {
    getActivities,
    subscribeActivities,
} from "../../services/activity";

export default function ActivityFeed() {

    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {

        load();

        const unsub = subscribeActivities(load);

        return unsub;

    }, []);

    async function load() {
        const data = await getActivities();
        setItems(data);
    }

    return (

        <div
            style={{
                background:"#111827",
                borderRadius:16,
                padding:20,
            }}
        >

            <h3
                style={{
                    color:"white",
                    marginBottom:20,
                }}
            >
                Live Activity
            </h3>

            {items.map(item=>(

                <div
                    key={item.id}
                    style={{
                        padding:"12px 0",
                        borderBottom:"1px solid #1F2937",
                    }}
                >

                    <div
                        style={{
                            color:"white",
                            fontWeight:600,
                        }}
                    >
                        {item.customer?.full_name}
                    </div>

                    <div
                        style={{
                            color:"#94A3B8",
                            fontSize:14,
                        }}
                    >
                        {item.status} • {item.liters}L {item.fuel_type}
                    </div>

                </div>

            ))}

        </div>

    );

}