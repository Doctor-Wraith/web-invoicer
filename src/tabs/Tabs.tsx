import ProductTab from "./ProductTab"
import CustomerTab from "./CustomerTab"
import InvoiceTab from "./InvoiceTab"
import PaymentTab from "./PaymentTab"
import CompanyTab from "./CompanyTab"
import ProductSettings from "./ProductSettings.tsx";
import "../styles/Tabs.css"
import {useEffect, useRef, useState} from "react";

interface TabProps {
    activeTab: string;
    setActiveTab: (activeTab: string) => void;
}

const TABS = ["Products", "Settings", "Customer", "Invoice", "Payment", "Company"]

export default function Tabs({activeTab, setActiveTab}: TabProps) {

    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
        const updateIndicator = () => {
            const activeEl = tabRefs.current[activeTab];
            if (activeEl && activeEl.parentElement) {
                setIndicatorStyle({
                    width: activeEl.offsetWidth - 5,
                    transform: `translateX(${activeEl.offsetLeft}px)`,
                });
            }
        };

        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        return () => window.removeEventListener("resize", updateIndicator);
    }, [activeTab]);

    return (
        <div className="tab-wrapper">
            <div className="tabs">
                <div className="tab-indicator" style={indicatorStyle}/>
                {TABS.map(tab => (
                    <button
                    key={tab}
                    ref={el => { tabRefs.current[tab] = el; }}
                    className={`tablinks${activeTab === tab ? " active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={`tabcontent${activeTab === "Products" ? " active" : ""}`}>
                <ProductTab />
            </div>

            <div className={`tabcontent${activeTab === "Settings" ? " active" : ""}`}>
                <ProductSettings />
            </div>

            <div className={`tabcontent${activeTab === "Customer" ? " active" : ""}`}>
                <CustomerTab />
            </div>

            <div className={`tabcontent${activeTab === "Invoice" ? " active" : ""}`}>
                <InvoiceTab />
            </div>

            <div className={`tabcontent${activeTab === "Payment" ? " active" : ""}`}>
                <PaymentTab />
            </div>

            <div className={`tabcontent${activeTab === "Company" ? " active" : ""}`}>
                <CompanyTab />
            </div>
        </div>
    )
}