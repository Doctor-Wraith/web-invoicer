import type {ProductInformation} from "../../custom components/productRow/ProductRow.tsx";
import type {Currency} from "../../data/currencies.tsx";

interface TableRowProps {
    item: ProductInformation;
    columns: {
        key: string,
        label: string,
        flex: number
    }[]
    currency: Currency
}

export default function PreviewProductTableRow({item, columns, currency}: TableRowProps) {
    const total = item.amount * item.cost;

    return (
        <div className="preview-table-row">
            {columns.map(col => {
                if (col.key === "name") {
                    return (
                        <div className="preview-table-cell" key={col.key} style={{flex: col.flex}}>
                            {item.name}
                        </div>
                    )
                }
                if (col.key === "amount") {
                    return (
                        <div className="preview-table-cell" key={col.key} style={{flex: col.flex}}>
                            {item.amount}
                        </div>
                    )
                }
                if (col.key === "cost") {
                    return (
                        <div className="preview-table-cell" key={col.key} style={{flex: col.flex}}>
                            {currency.code} {item.cost}
                        </div>
                    )
                }
                if (col.key === "total") {
                    return (
                        <div className="preview-table-cell" key={col.key} style={{flex: col.flex}}>
                            {currency.code}  {total}
                        </div>
                    )
                }
            })}

        </div>
    )

}