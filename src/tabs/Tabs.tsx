import ProductTab from "./ProductTab"
import CustomerTab from "./CustomerTab"
import InvoiceTab from "./InvoiceTab"
import PaymentTab from "./PaymentTab"
import CompanyTab from "./CompanyTab"
import ServicesTab from "./ServicesTab.tsx";
import "../styles/Tabs.css"
import React, {useEffect, useRef, useState} from "react";
import type {ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import {type Currency} from "../data/currencies.tsx";

interface TabProps {
    activeTab: string;
    setActiveTab: (activeTab: string) => void;
    services: ProductInformation[];
    setServices: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_services: (products: ProductInformation[]) => void;
    products: ProductInformation[];
    setProducts: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_products: (products: ProductInformation[]) => void;
    invoice_currency: Currency;
    invoice_setCurrency: (currency: Currency) => void;
}

const TABS = ["Products", "Services", "Customer", "Invoice", "Payment", "Company"]

export default function Tabs({
     activeTab, setActiveTab,
     services, setServices, save_services,
    products, setProducts, save_products,
    invoice_currency, invoice_setCurrency,
}: TabProps) {

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
                <ProductTab
                    products={products}
                    setProducts={setProducts}
                    save_products={save_products}
                />
            </div>

            <div className={`tabcontent${activeTab === "Services" ? " active" : ""}`}>
                <ServicesTab
                    services={services}
                    setServices={setServices}
                    save_Services={save_services}
                />
            </div>

            <div className={`tabcontent${activeTab === "Customer" ? " active" : ""}`}>
                <CustomerTab />
            </div>

            <div className={`tabcontent${activeTab === "Invoice" ? " active" : ""}`}>
                <InvoiceTab
                    currency={invoice_currency}
                    setCurrency={invoice_setCurrency}
                />
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