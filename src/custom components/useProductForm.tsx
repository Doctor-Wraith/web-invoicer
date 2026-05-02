import type {ProductInformation} from "./productRow/ProductRow.tsx";
import {useCallback, useState} from "react";

type Mode = "product" | "service"

interface ProductFormState {
    isOpen: boolean;
    mode: Mode;
    resolve: ((value: ProductInformation | null) => void) | null;
}

export function useProductForm() {
    const [state, setState] = useState<ProductFormState>({
        isOpen: false,
        mode: "product",
        resolve: null
    });

    const [draft, setDraft] = useState<Omit<ProductInformation, "id">>({
        name:"",
        modelNumber:"",
        amount:0,
        cost:0
    });

    const prompt = useCallback((mode: Mode): Promise<ProductInformation | null> => {
        setDraft({
            name:"",
            modelNumber:"",
            amount:0,
            cost:0
        });
            return new Promise((resolve) => {
                setState({isOpen: true, mode, resolve})
            })
    }, []);

    const handleChoice = useCallback((confirmed: boolean) => {
        setState((prev) => {
            if (confirmed) {
                prev.resolve?.({...draft, id: crypto.randomUUID()});
            } else {
              prev.resolve?.(null);
            }
            return { ...prev, isOpen: false, resolve: null}
        })
    }, [draft]);


        const isService = state.mode === "service";
        const namePlaceholder = isService ? "e.g. Logo Design" : "e.g. Wireless Keyboard";
        const codePlaceholder = isService ? "e.g. SVC-001" : "e.g. PRD-001";
        const amountLabel = isService ? "Hours" : "Quantity";
        const costLabel = isService ? "Rate (per hour)" : "Unit Price";
        const title = isService ? "Add Service" : "Add Product";

        const  ProductFormDialog = !state.isOpen ? null :(
            <div style={styles.overlay} onClick={() => handleChoice(false)}>
                <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>

                    <h2 style={styles.title}>{title}</h2>
                    <p style={styles.subtitle}>Fill in the details below</p>

                    <div style={styles.fields}>
                        <div style={styles.field}>
                            <label style={styles.label}>Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder={namePlaceholder}
                                value={draft.name}
                                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}

                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Code</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder={codePlaceholder}
                                value={draft.modelNumber}
                                onChange={(e) => setDraft((d) => ({ ...d, modelNumber: e.target.value }))}
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label style={styles.label}>{amountLabel}</label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={draft.amount === 0 ? "" : draft.amount}
                                    onChange={(e) => setDraft((d) => ({ ...d, amount: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label}>{costLabel}</label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    placeholder="0.00"
                                    value={draft.cost === 0 ? "" : draft.cost}
                                    onChange={(e) => setDraft((d) => ({ ...d, cost: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={styles.buttons}>
                        <button
                            style={styles.cancelBtn}
                            onClick={() => handleChoice(false)}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                        >
                            Cancel
                        </button>
                        <button
                            style={styles.confirmBtn}
                            onClick={() => handleChoice(true)}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(104,45,220,0.85)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(104,45,220,0.65)")}
                        >
                            Add {state.mode === "service" ? "Service" : "Product"}
                        </button>
                    </div>
                </div>
            </div>
        );

    return {prompt, ProductFormDialog}
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    dialog: {
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "20px",
        padding: "2rem",
        width: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
    },
    title: {
        color: "rgba(255,255,255,0.95)",
        fontSize: "18px",
        fontWeight: 500,
        margin: "0 0 4px",
    },
    subtitle: {
        color: "rgba(255,255,255,0.45)",
        fontSize: "13px",
        margin: "0 0 1.5rem",
    },
    fields: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "1.5rem",
    },
    row: {
        display: "flex",
        gap: "12px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flex: 1,
    },
    label: {
        color: "rgba(255,255,255,0.6)",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    },
    input: {
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "10px",
        padding: "10px 12px",
        color: "rgba(255,255,255,0.9)",
        fontSize: "14px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    buttons: {
        display: "flex",
        gap: "10px",
    },
    cancelBtn: {
        flex: 1,
        padding: "11px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(255,255,255,0.15)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    confirmBtn: {
        flex: 1,
        padding: "11px",
        borderRadius: "12px",
        background: "rgba(104,45,220,0.65)",
        color: "#fff",
        border: "1px solid rgba(104,45,220,0.4)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "'DM Sans', system-ui, sans-serif",
    },
};