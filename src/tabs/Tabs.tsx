import ProductTab from "./ProductTab"
import CustomerTab from "./CustomerTab"
import InvoiceTab from "./InvoiceTab"
import PaymentTab from "./PaymentTab"
import CompanyTab from "./CompanyTab"
import ProductSettings from "./ProductSettings.tsx";
import "../styles/Tabs.css"
import {useEffect, useRef, useState} from "react";

const TABS = ["Products", "Settings", "Customer", "Invoice", "Payment", "Company"]

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function Tabs({activeTab, setActiveTab}) {

    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabRefs = useRef({});
    
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const activeEl = tabRefs.current[activeTab];
        if (activeEl) {
            setIndicatorStyle({
                width: activeEl.clientWidth,
                transform: `translateX(${activeEl.offsetLeft}px)`
            })
        }
    }, [activeTab])
    
    return (
        <div className="tab-wrapper">
            <div className="tabs">
                <div className="tab-indicator" style={indicatorStyle}/>
                {TABS.map(tab => (
                    <button
                    key={tab}
                    ref={el => (tabRefs.current[tab] = el)}
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