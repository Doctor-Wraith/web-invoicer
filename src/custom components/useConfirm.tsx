import {TrashIcon} from "../assets/icons.tsx";
import { useState, useCallback } from "react";

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
    isOpen: boolean;
    resolve: ((value: boolean) => void) | null;
}

export function useConfirm() {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        resolve: null,
        message: "",
        title: "Are you sure?",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
    });

    const confirm = useCallback((options: ConfirmOptions | string) => {
        const opts = typeof options === "string" ? { message: options } : options;
        return new Promise<boolean>((resolve) => {
            setState({
                isOpen: true,
                resolve,
                title: opts.title ?? "Are you sure?",
                message: opts.message,
                confirmLabel: opts.confirmLabel ?? "Confirm",
                cancelLabel: opts.cancelLabel ?? "Cancel",
            });
        });
    }, []);

    const handleChoice = useCallback((result: boolean) => {
        setState((prev) => {
            prev.resolve?.(result);
            return { ...prev, isOpen: false, resolve: null };
        });
    }, []);

    const ConfirmDialog = useCallback(() => {
        if (!state.isOpen) return null;

        return (
            <div style={styles.overlay} onClick={() => handleChoice(false)}>
                <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.iconWrapper}>
                        <TrashIcon />
                    </div>

                    <h2 style={styles.title}>{state.title}</h2>
                    <p style={styles.message}>{state.message}</p>

                    <div style={styles.buttons}>
                        <button
                            style={styles.cancelBtn}
                            onClick={() => handleChoice(false)}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "rgba(255,255,255,0.14)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                            }
                        >
                            {state.cancelLabel}
                        </button>
                        <button
                            style={styles.confirmBtn}
                            onClick={() => handleChoice(true)}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "rgba(239,68,68,0.9)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "rgba(239,68,68,0.75)")
                            }
                        >
                            {state.confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        );
    }, [state, handleChoice]);

    return { confirm, ConfirmDialog };
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    dialog: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        padding: "2rem",
        width: "340px",
        boxShadow:
            "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
    },
    iconWrapper: {
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: "rgba(239, 68, 68, 0.2)",
        border: "1px solid rgba(239, 68, 68, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.25rem",
    },
    title: {
        color: "rgba(255,255,255,0.95)",
        fontSize: "18px",
        fontWeight: 500,
        textAlign: "center",
        margin: "0 0 8px",
    },
    message: {
        color: "rgba(255,255,255,0.6)",
        fontSize: "14px",
        textAlign: "center",
        lineHeight: 1.6,
        margin: "0 0 1.75rem",
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
        transition: "background 0.2s",
    },
    confirmBtn: {
        flex: 1,
        padding: "11px",
        borderRadius: "12px",
        background: "rgba(239, 68, 68, 0.75)",
        color: "#fff",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "background 0.2s",
    },
};