import ProductTab from "./ProductTab"
import CustomerTab, {type Customer} from "./CustomerTab"
import InvoiceTab, {type InvoiceStore} from "./InvoiceTab"
import PaymentTab, {type PaymentOptions} from "./PaymentTab"
import CompanyTab, {type Company} from "./CompanyTab"
import ServicesTab from "./ServicesTab.tsx";
import "../styles/Tabs.css"
import React, {useEffect, useRef, useState} from "react";
import type {ProductInformation} from "../custom components/productRow/ProductRow.tsx";

interface TabProps {
    activeTab: string;
    setActiveTab: (activeTab: string) => void;
    services: ProductInformation[];
    setServices: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_services: (products: ProductInformation[]) => void;
    products: ProductInformation[];
    setProducts: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_products: (products: ProductInformation[]) => void;
    paymentOptions: PaymentOptions[];
    setPaymentOptions: React.Dispatch<React.SetStateAction<PaymentOptions[]>>;
    savePaymentOptions: (paymentOptions: PaymentOptions[]) => void;
    invoice_store: InvoiceStore;
    customer: Customer;
    setCustomer: (customer: Customer) => void;
    confirm: (message: string) => Promise<unknown>;
    prompt:  (mode: Mode) => Promise<ProductInformation | null>
    paymentPrompt : () => Promise<PaymentOptions | null>
    company: Company;
    setCompany: (company: Company) => void;
}

type Mode = "product" | "service";

const TABS = ["Products", "Services", "Customer", "Invoice", "Payment", "Company"]

export default function Tabs({
     activeTab, setActiveTab,
     services, setServices, save_services,
    products, setProducts, save_products,
    invoice_store,
    customer, setCustomer,
    confirm, prompt,
    paymentOptions, savePaymentOptions, setPaymentOptions,
    paymentPrompt,
    company, setCompany
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
                    confirm={confirm}
                    prompt={prompt}
                />
            </div>

            <div className={`tabcontent${activeTab === "Services" ? " active" : ""}`}>
                <ServicesTab
                    services={services}
                    setServices={setServices}
                    save_Services={save_services}
                    confirm={confirm}
                    prompt={prompt}
                />
            </div>

            <div className={`tabcontent${activeTab === "Customer" ? " active" : ""}`}>
                <CustomerTab
                    customer={customer}
                    setCustomer={setCustomer}
                />
            </div>

            <div className={`tabcontent${activeTab === "Invoice" ? " active" : ""}`}>
                <InvoiceTab
                    store={invoice_store}
                />
            </div>

            <div className={`tabcontent${activeTab === "Payment" ? " active" : ""}`}>
                <PaymentTab
                    paymentOptions={paymentOptions}
                    setPaymentOptions={setPaymentOptions}
                    onSave={savePaymentOptions}
                    paymentPrompt={paymentPrompt}
                    confirm={confirm}
                />
            </div>

            <div className={`tabcontent${activeTab === "Company" ? " active" : ""}`}>
                <CompanyTab
                    company={company}
                    setCompany={setCompany}
                />
            </div>
        </div>
    )
}