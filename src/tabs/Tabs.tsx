import ProductTab from "./ProductTab"
import CustomerTab from "./CustomerTab"
import InvoiceTab from "./InvoiceTab"
import PaymentTab from "./PaymentTab"
import CompanyTab from "./CompanyTab"
import "../styles/Tabs.css"

const TABS = ["Products", "Customer", "Invoice", "Payment", "Company"]

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function Tabs({activeTab, setActiveTab}) {
    return (
        <div className="tab-wrapper">
            <div className="tab">
                {TABS.map(tab => (
                    <button
                    key={tab}
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