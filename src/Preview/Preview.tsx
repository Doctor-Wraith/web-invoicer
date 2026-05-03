import type {ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import PreviewProducts from "./Table/PreviewProducts.tsx";
import Total from "./Total/Total.tsx";
import {type InvoiceDetails} from "../tabs/InvoiceTab"
import type {Currency} from "../data/currencies.tsx";
import "./Preview.css"
import type {Customer} from "../tabs/CustomerTab.tsx";
import PreviewCompany from "./PreviewCompany.tsx";
import PreviewInvoiceDetails from "./PreviewInvoiceDetails.tsx";
import type {PaymentOptions} from "../tabs/PaymentTab.tsx";
import PreviewPaymentOptions from "./PreviewPaymentOptions.tsx";
import type {Company} from "../tabs/CompanyTab.tsx";

interface PreviewProps {
    products: ProductInformation[]
    services: ProductInformation[]
    currency: Currency
    customer: Customer
    invoiceDetails: InvoiceDetails
    paymentOptions: PaymentOptions[]
    company: Company
}

export default function Preview({products, services, currency, customer, invoiceDetails, paymentOptions, company}: PreviewProps) {

    let subTotal = 0;
    products.forEach(product => {subTotal += product.amount * product.cost})
    services.forEach(service => {subTotal += service.amount * service.cost})


    return (
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="title-card">
                <h2>Preview</h2>
            </div>
            <div className="preview-information" style={{overflowY: "auto", padding: "5px", flex:1}}>
                {/*Header Thing*/}
                <div className="Preview-header"
                     style={{display: "inline-flex", justifyContent: "space-between", width: "100%"}}>
                    <PreviewCompany company={company} />
                    <PreviewInvoiceDetails invoiceDetails={invoiceDetails}/>
                </div>

                <hr/>

                {/* Customer */}
                <div className="customer-preview">
                    <label>Issued to:</label><br/>
                    <label>{customer.name ? customer.name : "Customer Name"}</label><br/>
                    {(customer.id) && (
                        <label>ID: {customer.id}<br/></label>
                    )}
                    {customer.address && (
                        <label>Address: {customer.address}<br/></label>
                    )}
                    {customer.zip && (
                        <label>Zip: {customer.zip}<br/></label>
                    )}
                    {customer.phone && (
                        <label>Phone: {customer.phone}<br/></label>
                    )}
                    {customer.email && (
                        <label>Email: {customer.email}<br/></label>
                    )}
                    <hr style={{color: "rgba(255,255,255,0.5)"}}></hr>
                </div>

                {/*Products and services*/}
                <div className="preview-table">
                    {(products.length > 0) && (
                        <section>
                            <PreviewProducts
                                currency={currency}
                                items={products}
                                mode="product"
                            />
                        </section>
                    )}
                    {(services.length > 0) && (
                        <section>
                            <PreviewProducts
                                currency={currency}
                                items={services}
                                mode="service"
                            />
                        </section>
                    )}

                    {(services.length === 0) && (products.length === 0) && (
                        <section style={{textAlign: "center", width: "100%"}}>
                            <h4 style={{alignItems: "center", width: "100%"}}>No Products or services</h4>
                            <hr style={{color: "rgba(255,255,255,0.5)"}}></hr>
                        </section>
                    )}
                </div>

                {/*Totals*/}
                {(subTotal > 0) && (
                    <>
                        <div className="totaling-wrapper">
                            <Total
                                subTotal={subTotal}
                                discount={invoiceDetails.discount}
                                shipping={invoiceDetails.shipping}
                                tax={invoiceDetails.tax}
                                currency={currency}
                            />
                        </div>
                        <hr/>
                    </>
                )}

                {paymentOptions.length > 0 && (
                    <div className="payment-wrapper">
                        <h4>Payment Details</h4>
                        {paymentOptions.map((o) => (
                            <PreviewPaymentOptions option={o}/>
                        ))}
                    </div>
                )}

                {(invoiceDetails) && (invoiceDetails.endMessage !== "") && (
                    <label>{invoiceDetails.endMessage}</label>
                )}
            </div>
        </div>)
}