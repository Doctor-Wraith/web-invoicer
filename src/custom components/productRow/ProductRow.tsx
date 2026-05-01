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

const styles: Record<string, CSSProperties> = {
    row: {
        display: "grid",
        gridTemplateColumns: "1fr 160px 140px 140px 44px",
        gap: 0,
        minWidth: 0,
        width: "100%",
        boxSizing: "border-box",
        alignItems: "stretch",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: "14px",
    },
    cell: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d1d5db",
    },
    input: {
        width: "100%",
        height: "100%",
        padding: "10px 12px",
        border: "none",
        outline: "none",
        fontSize: "14px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        backgroundColor: "transparent",
        color: "inherit",
        boxSizing: "border-box",
    },
    spinnerCell: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #d1d5db",
        position: "relative",
    },
    spinnerInput: {
        width: "100%",
        height: "100%",
        padding: "10px 12px",
        border: "none",
        outline: "none",
        fontSize: "14px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "transparent",
        color: "#4f6ef7",
        fontWeight: 500,
        boxSizing: "border-box",
    },
    spinnerButtons: {
        position: "absolute",
        right: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
    },
    spinnerBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0",
        lineHeight: 1,
        color: "#9ca3af",
        fontSize: "10px",
        display: "flex",
        alignItems: "center",
    },
    modelCell: {
        display: "flex",
        alignItems: "center",
        borderRight: "1px solid #d1d5db",
        background: "#f9fafb",
    },
    modelInput:{
        width: "100%",
        height: "100%",
        padding: "10px 12px",
        border: "none",
        outline: "none",
        fontSize: "14px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "transparent",
        color: "#4f6ef7",
        fontWeight: 500,
        boxSizing: "border-box",
    },
    deleteBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#ef4444",
        padding: "0 12px",
        transition: "background 0.15s",
        width: "100%",
        height: "100%",
    },
}

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
            <div style={styles.spinnerCell}>
                <input
                    className="no-spinner"
                    style={styles.spinnerInput}
                    type="number"
                    min={0}
                    placeholder={amountLabel}
                    value={data.amount === 0 ? "" : data.amount}
                    onChange={e=> update("amount", parseFloat(e.target.value) || 0)}
                />
                <div style={styles.spinnerButtons}>
                    <button style={styles.spinnerBtn} onClick={() => update("amount", data.amount + 1)} tabIndex={-1}>
                        <ChevronUp />
                    </button>
                    <button style={styles.spinnerBtn} onClick={() => update("amount", Math.max(0, data.amount - 1))} tabIndex={-1}>
                        <ChevronDown />
                    </button>
                </div>
            </div>

            {/*  Cost  */}
            <div style={styles.spinnerCell}>
                <input
                    className="no-spinner"
                    style={styles.spinnerInput}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder={costLabel}
                    value={data.cost === 0 ? "" : data.cost}
                    onChange={e => update("cost", parseFloat(e.target.value) || 0)}
                />
                <div style={styles.spinnerButtons}>
                    <button style={styles.spinnerBtn} onClick={() => update("cost", parseFloat((data.cost + 1).toFixed(2)))} tabIndex={-1}>
                        <ChevronUp />
                    </button>
                    <button style={styles.spinnerBtn} onClick={() => update("cost", parseFloat(Math.max(0, data.cost - 1).toFixed(2)))} tabIndex={-1}>
                        <ChevronDown />
                    </button>
                </div>
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