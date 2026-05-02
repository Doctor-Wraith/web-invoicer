import CurrencySelect from "../custom components/CurrencySelect.tsx";
import type {Currency} from "../data/currencies.tsx";
import IconButton from "../custom components/IconButton.tsx";
import "../styles/invoiceTab.css"
import DatePicker from "../custom components/DatePicker.tsx";
import { useState, useRef, useEffect} from "react";
import ToggleButton from "../custom components/ToggleButton.tsx";

export type Type = "percent" | "flat"


export interface PercentFlat {
    amount: number;
    kind: Type;
}
export interface InvoiceDetails {
    invoiceNumber: string;
    paymentTerms: string;
    issueDate: Date;
    dueDate: Date;
    endMessage: string;
    currency: Currency;
    discount: PercentFlat;
    tax: PercentFlat;
    shipping: number;
}


export interface InvoiceStore extends InvoiceDetails {
    setInvoiceNumber: (invoiceNumber: string) => void;
    setPaymentTerms: (paymentTerms: string) => void;
    setIssueDate: (issueDate: Date) => void;
    setDueDate: (dueDate: Date) => void;
    setEndMessage: (endMessage: string) => void;
    setCurrency: (currency: Currency) => void;
    setDiscount: (discount: PercentFlat) => void;
    setTax: (tax: PercentFlat) => void;
    setShipping: (shipping: number) => void;
}

interface InvoiceTabProps {
    store: InvoiceStore;
}

const SUB_TABS = ["Invoice Details", "Discounts & Costs"]
type SubTab = typeof SUB_TABS[number]

const INJECTED_STYLE = `
  .invoice-sub-tab-btn:hover { background: rgba(255,255,255,0.06) !important; }
`;


export default function InvoiceTab({store}: InvoiceTabProps) {
    const {
        invoiceNumber, setInvoiceNumber,
        paymentTerms, setPaymentTerms,
        issueDate, setIssueDate,
        dueDate, setDueDate,
        endMessage, setEndMessage,
        currency, setCurrency,
        discount, setDiscount,
        tax, setTax,
        shipping, setShipping
    } = store;

    const [activeSubTab, setActiveSubTab] = useState<SubTab>("Invoice Details")
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    useEffect(() => {
        const activeEl = tabRefs.current[activeSubTab];
        if (activeEl) {
            setIndicatorStyle({
                width: activeEl.offsetWidth - 5,
                transform: `translateX(${activeEl.offsetLeft}px)`
            });
        }
    }, [activeSubTab])

    function generate_invoice_number() : void {
        const part1 = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
        const part2 = Math.floor(Math.random() * 1_000).toString().padStart(3, "0");
        setInvoiceNumber(`INV-${part1}-${part2}`);
    }

    return (
        <div className="tab invoice-tab" style={{ width: "100%" }}>
            <style>{INJECTED_STYLE}</style>
            <div className="Invoice-information-tab">

                    <div className="tabs"
                         style={{
                             marginBottom: 16,
                             display: "flex",
                             justifyContent: "space-between",
                             background: "transparent",
                             width: "100%",
                             padding: 0,
                         }}>
                        <div className="tab-indicator" style={indicatorStyle}/>
                        {SUB_TABS.map((tab) => (
                            <button
                                key={tab}
                                ref={(el) => { tabRefs.current[tab] = el; }}
                                className={`tablinks invoice-sub-tab-btn${activeSubTab === tab ? " active" : ""}`}
                                onClick={() => setActiveSubTab(tab)}
                                style={{
                                    fontSize: "1em",
                                    fontWeight: "bold",
                                    fontFamily: "'DM Sans', system-ui, sans-serif",
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                <hr/>

                {/* Invoice Details panel */}
                {activeSubTab === "Invoice Details" && (
                    <div className="Invoice-details" style={{ height: "100%" }}>
                        <div className="InvoiceNumber invoice-item">
                            <label htmlFor="invoice-number">Invoice Number</label>
                            <div className="invoice-number-input">
                                <input
                                    id="invoice-number"
                                    type="text"
                                    value={invoiceNumber}
                                    placeholder="INV-510824-104"
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                />
                                <IconButton
                                    label="Generate"
                                    variant="glass"
                                    onClick={generate_invoice_number}
                                />
                            </div>
                        </div>

                        <div className="terms-of-payment invoice-item">
                            <label htmlFor="payment-terms">Payment Terms</label>
                            <input
                                id="payment-terms"
                                placeholder="30% advance, 70% before shipment"
                                value={paymentTerms}
                                onChange={(e) => setPaymentTerms(e.target.value)}
                            />
                        </div>

                        <div className="Invoice-dates">
                            <div className="Invoice-date-input">
                                <label htmlFor="invoice-issue-date">Issue Date</label>
                                <DatePicker
                                    value={issueDate}
                                    onChange={setIssueDate}
                                />
                            </div>
                            <div className="Invoice-date-input">
                                <label htmlFor="invoice-due-date">Due Date (Optional)</label>
                                <DatePicker
                                    value={dueDate}
                                    onChange={setDueDate}
                                />
                            </div>
                        </div>

                        <div className="currency-selector invoice-item">
                            <CurrencySelect
                                id="currency-selector"
                                label="Currency"
                                value={currency}
                                onChange={setCurrency}
                            />
                        </div>

                        <div className="invoice-item end-message" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                            <label htmlFor="end-message-area">End Message</label>
                            <textarea
                                style={{ flex: 1, resize: "none" }}
                                placeholder="Add a note..."
                                id="end-message-area"
                                value={endMessage}
                                onChange={(e) => setEndMessage(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Discounts & Costs panel */}
                {activeSubTab === "Discounts & Costs" && (
                    <div className="Invoice-details" style={{ height: "100%" }}>
                        <div className="invoice-item">
                            <label htmlFor="discount-amount">Discount</label>
                            <div style={{ display: "flex", gap: 8 , width:"100%"}}>
                                <input
                                    style={{flex: 1}}
                                    id="discount-amount"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={discount.amount}
                                    max={discount.kind === "percent" ? 100 : undefined}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "") {
                                            setDiscount({...discount, amount: 0})
                                            return
                                        }
                                        let num = parseFloat(value);

                                        if (discount.kind === "percent") {
                                            num = Math.min(num, 100);
                                        }
                                        setDiscount({...discount, amount: num})
                                    }}
                                />
                                <ToggleButton<Type>
                                    value={discount.kind}
                                    onChange={(kind) => setDiscount({...discount, kind})}
                                    options={[
                                        {label: "Flat", value:"flat"},
                                        {label: "%", value:"percent"},
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="invoice-item">
                            <label htmlFor="tax-amount">Tax</label>
                            <div style={{ display: "flex", gap: 8, width:"100%"}}>
                                <input
                                    style={{flex:1}}
                                    id="tax-amount"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    max={tax.kind === "percent" ? 100 : undefined}
                                    value={tax.amount}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value === "") {
                                            setTax({...tax, amount: 0});
                                            return;
                                        }

                                        let num = parseFloat(value)

                                        if (tax.kind === "percent") {
                                            num = Math.min(num, 100)
                                        }

                                        setTax({...tax, amount: num});

                                    }}
                                />
                                <ToggleButton<Type>
                                    value={tax.kind}
                                    onChange={(kind) => setTax({...tax, kind})}
                                    options={[
                                        {label: "Flat", value:"flat"},
                                        {label: "%", value:"percent"},
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="invoice-item">
                            <label htmlFor="shipping-amount">Shipping</label>
                            <input
                                id="shipping-amount"
                                type="number"
                                min={0}
                                placeholder="0.00"
                                value={shipping}
                                onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}