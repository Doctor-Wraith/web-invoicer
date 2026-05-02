import CurrencySelect from "../custom components/CurrencySelect.tsx";
import type {Currency} from "../data/currencies.tsx";
import IconButton from "../custom components/IconButton.tsx";
import "../styles/invoiceTab.css"
import DatePicker from "../custom components/DatePicker.tsx";

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

    function generate_invoice_numer() : void {
        const part1 = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
        const part2 = Math.floor(Math.random() * 1_000).toString().padStart(3, "0");
        setInvoiceNumber(`INV-${part1}-${part2}`);
    }

    return (
        <div className="tab invoice-tab" style={{width:'100%'}}>
            <div className="Invoice-information-tab">
                <h3>Invoice Information</h3>
                <hr/>

                <div className="Invoice-details" style={{height:"100%"}}>
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
                                onClick={generate_invoice_numer}
                            />
                        </div>
                    </div>

                    <div className="terms-of-payment invoice-item">
                        <label htmlFor="payment-terms">Payment Terms</label>
                        <input
                            id="payment-terms"
                            placeholder="30% advance, 70% before shipment"
                            value={paymentTerms}
                            onChange={(e) => {
                                setPaymentTerms(e.target.value)
                            }}
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
                            <label htmlFor="invoice-issue-date">Due Date (Optional)</label>
                            <DatePicker
                                value={dueDate}
                                onChange={setDueDate}
                            />
                        </div>
                    </div>

                    <div className="currency-selector invoice-item">
                        <label htmlFor="currency-selector">Currency</label>
                        <CurrencySelect
                            value={currency}
                            onChange={setCurrency}
                            id="currency-selector"
                        />
                    </div>

                    <div className="invoice-item end-message" style={{display: "flex", flexDirection: "column", height: "100%"}}>
                        <label htmlFor='end-message-area'>End Message</label>
                        <textarea
                            style={{flex:1}}
                            placeholder="Add a note..."
                            id="end-message-area"
                            value={endMessage}
                            onChange={(e) => {
                                setEndMessage(e.target.value)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}