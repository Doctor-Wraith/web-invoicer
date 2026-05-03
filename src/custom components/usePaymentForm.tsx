import {type PaymentOptions} from "../tabs/PaymentTab.tsx";
import React, {useCallback, useState} from "react";
import type {BankInformation} from "./paymentOptions/BankPayments.tsx";
import type {PayPalInformation} from "./paymentOptions/PayPalPayments.tsx";

type PaymentTypes = "bank" | "paypal" | null;

interface PaymentFormState {
    isOpen: boolean;
    selectedType: PaymentTypes;
    resolve: ((value: PaymentOptions | null) => void) | null;
}

export function usePaymentForm() {
    const [state, setState] = useState<PaymentFormState>({
        isOpen: false,
        resolve: null,
        selectedType: null,
    });

    const [draftBank, setDraftBank] = useState<BankInformation>({
        id: crypto.randomUUID(),
        type: "bank",
        name: "", branch: "", account_number: "", address: "",
        iban: "", account_name: "", routing_number: "", sort_code: "", swift_code: ""
    });

    const [draftPayPal, setDraftPayPal] = useState<PayPalInformation>({
        id: crypto.randomUUID(),
        type: "paypal",
        email: ""
    });

    const paymentPrompt = useCallback((): Promise<PaymentOptions | null> => {
        setDraftBank({
            id: crypto.randomUUID(),
            type: "bank",
            name: "", branch: "", account_number: "", address: "",
            iban: "", account_name: "", routing_number: "", sort_code: "", swift_code: ""
        });
        setDraftPayPal({ id: crypto.randomUUID(), type: "paypal", email: "" });

        return new Promise((resolve) => {
            setState({ isOpen: true, selectedType: null, resolve });
        });
    }, []);

    const handleSelectType = useCallback((type: PaymentTypes) => {
        setState((prev) => ({ ...prev, selectedType: type }));
    }, []);

    const handleChoice = useCallback((confirmed: boolean) => {
        setState((prev) => {
            if (confirmed && prev.selectedType) {
                const result = prev.selectedType === "bank" ? draftBank : draftPayPal;
                prev.resolve?.(result);
            } else {
                prev.resolve?.(null);
            }
            return { ...prev, isOpen: false, selectedType: null, resolve: null };
        });
    }, [draftBank, draftPayPal]);

    const PaymentFormDialog = !state.isOpen ? null : (
        <div style={styles.overlay}>
            <div style={styles.dialog}>

                {/* Header — always visible */}
                <div style={styles.header}>
                    <h2 style={styles.title}>
                        {state.selectedType === null && "Add Payment Method"}
                        {state.selectedType === "bank" && "Bank Details"}
                        {state.selectedType === "paypal" && "PayPal"}
                    </h2>
                    <button style={styles.closeBtn} onClick={() => handleChoice(false)}>✕</button>
                </div>
                <p style={styles.subtitle}>
                    {state.selectedType === null && "Choose a payment type to continue"}
                    {state.selectedType === "bank" && "Enter your bank account details"}
                    {state.selectedType === "paypal" && "Enter your PayPal email address"}
                </p>

                {/* Step 1 — type picker */}
                {state.selectedType === null && (
                    <div style={styles.typeGrid}>
                        <button style={styles.typeBtn} onClick={() => handleSelectType("bank")}>
                            <span style={styles.typeIcon}>🏦</span>
                            <span style={styles.typeLabel}>Bank Transfer</span>
                        </button>
                        <button style={styles.typeBtn} onClick={() => handleSelectType("paypal")}>
                            <span style={styles.typeIcon}>🅿</span>
                            <span style={styles.typeLabel}>PayPal</span>
                        </button>
                    </div>
                )}

                {/* Step 2a — bank form */}
                {state.selectedType === "bank" && (
                    <div style={styles.fields}>
                        {([
                            ["name", "Bank Name", "e.g. Standard Bank"],
                            ["branch", "Branch", "e.g. Cape Town CBD"],
                            ["account_name", "Account Name", "e.g. Thomas Smith"],
                            ["account_number", "Account Number", "e.g. 000000001"],
                            ["routing_number", "Routing Number", ""],
                            ["sort_code", "Sort Code", "e.g. 12-34-56"],
                            ["swift_code", "SWIFT Code", "e.g. AAAA-BB-CC-DDD"],
                            ["iban", "IBAN", "e.g. CC DD BBBB SSSS SSSS SSS"],
                            ["address", "Bank Address", ""],
                        ] as [keyof BankInformation, string, string][]).map(([field, label, placeholder]) => (
                            <div key={field} style={styles.field}>
                                <label style={styles.label}>{label}</label>
                                <input
                                    style={styles.input}
                                    placeholder={placeholder}
                                    value={draftBank[field] as string}
                                    onChange={(e) => setDraftBank((d) => ({ ...d, [field]: e.target.value }))}
                                />
                            </div>
                        ))}

                        <div style={styles.buttons}>
                            <button style={styles.cancelBtn} onClick={() => setState((p) => ({ ...p, selectedType: null }))}>
                                ← Back
                            </button>
                            <button style={styles.confirmBtn} onClick={() => handleChoice(true)}>
                                Add Bank
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2b — paypal form */}
                {state.selectedType === "paypal" && (
                    <div style={styles.fields}>
                        <div style={styles.field}>
                            <label style={styles.label}>PayPal Email</label>
                            <input
                                style={styles.input}
                                type="email"
                                placeholder="e.g. thomas@example.com"
                                value={draftPayPal.email}
                                onChange={(e) => setDraftPayPal((d) => ({ ...d, email: e.target.value }))}
                            />
                        </div>

                        <div style={styles.buttons}>
                            <button style={styles.cancelBtn} onClick={() => setState((p) => ({ ...p, selectedType: null }))}>
                                ← Back
                            </button>
                            <button style={styles.confirmBtn} onClick={() => handleChoice(true)}>
                                Add PayPal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return { paymentPrompt, PaymentFormDialog };
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
        width: "420px",
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "4px",
    },
    title: {
        color: "rgba(255,255,255,0.95)",
        fontSize: "18px",
        fontWeight: 500,
        margin: 0,
    },
    closeBtn: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "8px",
        color: "rgba(255,255,255,0.6)",
        cursor: "pointer",
        fontSize: "14px",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    subtitle: {
        color: "rgba(255,255,255,0.45)",
        fontSize: "13px",
        margin: "0 0 1.5rem",
    },
    typeGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
    },
    typeBtn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "1.5rem 1rem",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "14px",
        cursor: "pointer",
    },
    typeIcon: {
        fontSize: "28px",
    },
    typeLabel: {
        color: "rgba(255,255,255,0.85)",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    fields: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
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
        marginTop: "8px",
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