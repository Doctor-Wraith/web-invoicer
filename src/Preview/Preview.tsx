import type {ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import PreviewProducts from "./Table/PreviewProducts.tsx";
import Total from "./Total/Total.tsx";
import {type PercentFlat} from "../tabs/InvoiceTab"
import type {Currency} from "../data/currencies.tsx";
import "./Preview.css"

interface PreviewProps {
    products: ProductInformation[]
    services: ProductInformation[]
    currency: Currency
}

export default function Preview({
        products, services, currency}: PreviewProps) {

    let subTotal = 0;
    products.forEach(product => {subTotal += product.amount * product.cost})
    services.forEach(service => {subTotal += service.amount * service.cost})

    const discont: PercentFlat = {
        amount : 0,
        kind : "flat"
    }

    const tax: PercentFlat = {
        amount : 1,
        kind : "flat"
    }

    const shipping = 15;

    return (
        <div>
            <div className="title-card">
                <h2>Preview</h2>
            </div>
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
            </div>

            {(subTotal > 0) && (
                <div className="totaling-wrapper">
                    <Total
                        subTotal={subTotal}
                        discount={discont}
                        shipping={shipping}
                        tax={tax}
                        currency={currency}
                    />
                </div>
            )}
        </div>)
}