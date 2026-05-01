import {productColumns, serviceColumns} from "./tableColumns";

type Mode = "product" | "service"

interface TableHeaderProps {
    mode?: Mode;
}

export default function TableHeader({mode="product"}: TableHeaderProps) {
    return (
        mode === "product"
            ? (<div className="table-header">
            {productColumns.map(col => (
                <div
                    key={col.key}
                    style={{ flex: col.flex }}
                    className="table-cell"
                >
                    {col.label}
                </div>
            ))}
        </div>)
        : mode === "service"
        ? (<div className="table-header">
                    {serviceColumns.map(col => (
                        <div
                            key={col.key}
                            style={{ flex: col.flex }}
                            className="table-cell"
                        >
                            {col.label}
                        </div>
                    ))}
    </div>):
                (<h1>Something has gone wrong</h1>)
    );
}