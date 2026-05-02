import {type PercentFlat} from "../../tabs/InvoiceTab"
import "./total.css"
import type {Currency} from "../../data/currencies.tsx";

interface TotalProps {
    subTotal: number;
    discount: PercentFlat;
    tax: PercentFlat
    shipping: number;
    currency: Currency;
}

export default function Total({subTotal, discount, tax, shipping, currency}: TotalProps) {
    // Math
    const discountAmount: number = discount.kind === "flat" ? discount.amount : subTotal * discount.amount;
    let total: number = (subTotal + shipping - discountAmount);
    const taxAmount: number = tax.kind === "flat" ? tax.amount : total * tax.amount
    total = total - taxAmount

    // Formating
    const discountAmountFormatted = discountAmount.toFixed(2);
    const subTotalFormatted = subTotal.toFixed(2);
    const taxFormated = taxAmount.toFixed(2);
    const shippingFormatted = shipping.toFixed(2);
    const totalFormatted = total.toFixed(2);

    return (
        <div className="Totaling">
            <div className="total-row">
                <span>SubTotal:</span>
                <span>{currency.code} {subTotalFormatted}</span>
            </div>

            {(discountAmount > 0)  && (
                <div className="total-row">
                    <span>Discounts:</span>
                    <span>{currency.code} -{discountAmountFormatted}</span>
                </div>
            )}

            {(shipping > 0) && (
                <div className="total-row">
                    <span>Shipping:</span>
                    <span>{currency.code} {shippingFormatted}</span>
                </div>
            )}
            {(taxAmount > 0) && (
                <div className="total-row">
                    <span>Tax:</span>
                    <span>{currency.code} {taxFormated}</span>
                </div>
            )}
            <hr style={{color: "rgba(255,255,255,0.5)", width: "100%"}}></hr>
            <div className="total-row total">
                <span>Total:</span>
                <span>{currency.code} {totalFormatted}</span>
            </div>
        </div>
    )
}