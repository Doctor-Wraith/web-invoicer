import type {ProductInformation} from "../../custom components/productRow/ProductRow.tsx";
import "./PreviewTable.css"
import PreviewProductTableRow from "./PreviewProductTableRow.tsx";
import type {Currency} from "../../data/currencies.tsx";


type Mode = "product"|"service"


interface PreviewProps {
    mode: Mode
    items: ProductInformation[]
    currency: Currency
}

export default function PreviewProducts({mode, items, currency}: PreviewProps) {
    const productColumns = [
        {
            key: "name",
            label: mode === "product" ? "Product" : "Service",
            flex: 5,
        },
        {
            key: "amount",
            label: mode === "product" ? "Quantity" : "Hours",
            flex: 1,
        },
        {
            key: "cost",
            label: mode === "product" ? "Price" : "Rate (/Hour)",
            flex: 1,
        },
        {
            key: "total",
            label: "Total",
            flex: 1,
        }
    ]


    return (
        <div className="Preview-table">
            <div className="preview-table-header">
                {productColumns.map(column => (
                    <div
                        key={column.key}
                        style={{flex: column.flex}}
                        className="preview-table-cell"
                    >
                        {column.label}
                    </div>
                ))}
            </div>

            {items.map((item) => (
                <div>
                    <PreviewProductTableRow item={item} columns={productColumns} currency={currency} />
                    <hr></hr>
                </div>
            ))}
        </div>
    )
}