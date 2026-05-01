import React, {type CSSProperties, type JSX} from "react";
import "./ProductRow.css"
type Mode = "product" | "service";


// The data
export interface ProductInformation {
    id: string;
    name: string;
    modelNumber: string;
    amount: number;
    cost: number;
}

interface ProductRowProps {
    data: ProductInformation;
    mode?: Mode;
    onChange: (updated: ProductInformation) => void;
    onDelete: (id: string) => void;
}

const baseCell: CSSProperties = {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    overflow: "hidden",
    borderRight: "1px solid #d1d5db",
};

const baseInput: CSSProperties = {
    width: "100%",
    height: "100%",
    padding: "10px 12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    background: "transparent",
    boxSizing: "border-box",
    minWidth: 0,
};

const styles: Record<string, CSSProperties> = {
    row: {
        display: "flex",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: "14px",
    },

    // Cells
    cell: {
        ...baseCell,
        flex: 2,
    },
    modelCell: {
        ...baseCell,
        flex: 1,
        background: "#f9fafb",
    },
    numberCell: {
        ...baseCell,
        flex: 1,
    },

    // Inputs
    input: {
        ...baseInput,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "inherit",
        maxWidth: "100%",
    },
    modelInput: {
        ...baseInput,
        color: "#4f6ef7",
        fontWeight: 500,
        maxWidth: "100%",
    },
    numberInput: {
        ...baseInput,
        color: "#4f6ef7",
        fontWeight: 500,
        maxWidth: "100%",
    },

    // Button
    deleteBtn: {
        width: "44px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#ef4444",
        padding: "0 12px",
        transition: "background 0.15s",
        height: "100%",
    },
};

const ChevronUp = (): JSX.Element => (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
        <path d="M1 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDown = (): JSX.Element => (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = (): JSX.Element => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


export default function ProductRow({
    data,
    mode = "product",
    onChange,
    onDelete,
                                   }: ProductRowProps): React.JSX.Element {

    const amountLabel = mode === "service" ? "Hours" : "Quantity";
    const modelLabel = mode === "service" ? "Service code" : "Product code";
    const nameLabel = mode === "service" ? "Service name": "Product name";
    const costLabel = mode === "service" ? "Rate (/Hour)" : "Unit Price";

    const update = (field: keyof ProductInformation, value: string | number) => {
        onChange?.({ ...data, [field]: value });
    }

    return (
        <div style={styles.row}>
            {/*  Name  */}
            <div style={styles.cell}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder={nameLabel}
                    value={data.name}
                    onChange={e => update("name", e.target.value)}
                    />
            </div>

            {/*  Model  */}
            <div style={styles.modelCell}>
                <input
                    style={styles.modelInput}
                    type="text"
                    placeholder={modelLabel}
                    value={data.modelNumber}
                    onChange={e => update("modelNumber", e.target.value)}
                />
            </div>

            {/*  Amount   */}
            <div style={styles.numberCell}>
                <input
                    className="no-spinner"
                    style={styles.numberInput}
                    type="number"
                    min={0}
                    placeholder={amountLabel}
                    value={data.amount === 0 ? "" : data.amount}
                    onChange={e => update("amount", parseFloat(e.target.value) || 0)}
                />
            </div>


            {/*  Cost  */}
            <div style={styles.numberCell}>
                <input
                    className="no-spinner"
                    style={styles.numberInput}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder={costLabel}
                    value={data.cost === 0 ? "" : data.cost}
                    onChange={e => update("cost", parseFloat(e.target.value) || 0)}
                />
            </div>


            {/* Delete */}
            <button
                style={styles.deleteBtn}
                onClick={() => onDelete?.(data.id)}
                aria-label="Remove item"
                title="Remove item"
            >
                <TrashIcon />
            </button>

        </div>
    )
}