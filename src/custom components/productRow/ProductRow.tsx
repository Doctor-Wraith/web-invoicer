import React, {type CSSProperties, type JSX} from "react";
import "./ProductRow.css"
import {productColumns} from "../tableColumns.ts";

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

    borderRight: "1px solid rgba(255,255,255,0.08)",

    fontWeight: 500,
    color: "white",
};

const baseInput: CSSProperties = {
    width: "100%",
    height: "100%",
    padding: "8px 10px",

    border: "none",
    outline: "none",

    fontSize: "14px",
    fontFamily: "'DM Sans', system-ui, sans-serif",

    background: "transparent",
    boxSizing: "border-box",
    minWidth: 0,

    fontWeight: 500,
    color: "white",
};

const styles: Record<string, CSSProperties> = {
    row: {
        minHeight: "44px",
        display: "flex",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",

        borderRadius: "12px",
        overflow: "hidden",

        // Glass base
        background: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",

        border: "1px solid rgba(255, 255, 255, 0.12)",

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
    },
    numberCell: {
        ...baseCell,
        flex: 1,
        gap: "4px",
        padding: "2px 6px"
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
        fontWeight: 500,
        maxWidth: "100%",
    },
    numberInput: {
        ...baseInput,
        fontWeight: 500,
        maxWidth: "100%",
    },

    // Button
    deleteBtn: {
        width: "40px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "rgba(239, 68, 68, 0.5)", // stronger base
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: "none",
        borderLeft: "1px solid rgba(255,255,255,0.08)",

        color: "#fecaca", // lighter red text
        cursor: "pointer",
        transition: "all 0.15s ease",
    },
};

const spinBtn: CSSProperties = {
    width: "24px",
    height: "24px",
    borderRadius: "8px",

    background: "rgba(104, 45, 220, 0.12)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#e5e7eb",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",

    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    transition: "all 0.15s ease",
};

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
    const amountLabel = mode === "service" ? "Hours" : "QTY";
    const modelLabel = "Code";
    const nameLabel = mode === "service" ? "Service name": "Product name";
    const costLabel = mode === "service" ? "Rate" : "Price";

    const update = (field: keyof ProductInformation, value: string | number) => {
        onChange?.({ ...data, [field]: value });
    }


    return (
        <div className="table-row">
        {productColumns.map(col => {
                if (col.key === "name") {
                    return (
                        <div key={col.key} style={{ flex: col.flex }}>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder={nameLabel}
                                value={data.name}
                                onChange={e => update("name", e.target.value)}
                            />
                        </div>
                    );
                }

                if (col.key === "modelNumber") {
                    return (
                        <div key={col.key} style={{ flex: col.flex }}>
                            <input
                                style={styles.modelInput}
                                type="text"
                                placeholder={modelLabel}
                                value={data.modelNumber}
                                onChange={e => update("modelNumber", e.target.value)}
                            />
                        </div>
                    );
                }

                if (col.key === "amount") {
                    return (
                        <div key={col.key} style={{...styles.numberCell, flex: col.flex }}>
                            <button
                                className="spin-btn"
                                style={spinBtn}
                                onClick={() => update("amount", Math.max(0, data.amount - 1))}
                            >
                                −
                            </button>
                            <input
                                className="no-spinner"
                                style={styles.numberInput}
                                type="number"
                                min={0}
                                placeholder={amountLabel}
                                value={data.amount === 0 ? "" : data.amount}
                                onChange={e => update("amount", parseFloat(e.target.value) || 0)}
                            />
                            <button
                                className="spin-btn"
                                style={spinBtn}
                                onClick={() => update("amount", data.amount + 1)}
                            >
                                +
                            </button>
                        </div>
                    );
                }

                if (col.key === "cost") {
                    return (
                        <div key={col.key} style={{...styles.numberCell, flex: col.flex }}>
                            <button
                                className="spin-btn"
                                style={spinBtn}
                                onClick={() => update("cost", Math.max(0, data.cost - 0.5))}
                            >
                                −
                            </button>
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
                            <button
                                className="spin-btn"
                                style={spinBtn}
                                onClick={() => update("cost", data.cost + 0.5)}
                            >
                                +
                            </button>
                        </div>
                    );
                }

                if (col.key === "actions") {
                    return (
                            <button
                                key={col.key} style={{...styles.deleteBtn, flex: col.flex }}
                                onClick={() => onDelete?.(data.id)}
                                aria-label="Remove item"
                                title="Remove item"
                            >
                                <TrashIcon />
                            </button>

                    );
                }
                return null;
            })}
        </div>
    )
}