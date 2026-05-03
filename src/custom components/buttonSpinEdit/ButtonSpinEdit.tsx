import { useState } from "react";
import type { CSSProperties } from "react";
import "./buttonSpinEdit.css"

type Size = "small" | "medium" | "large";

interface ButtonSpinEditProps {
    value?: number;
    onChange?: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
    placeholder?: string;
    size?: Size;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
}

const sizeTokens: Record<Size, {
    btnSize: string;
    btnBorderRadius: string;
    btnFontSize: string;
    inputFontSize: string;
    inputPadding: string;
    wrapPadding: string;
    wrapGap: string;
}> = {
    small: {
        btnSize: "20px",
        btnBorderRadius: "6px",
        btnFontSize: "11px",
        inputFontSize: "12px",
        inputPadding: "4px 6px",
        wrapPadding: "2px 4px",
        wrapGap: "4px",
    },
    medium: {
        btnSize: "24px",
        btnBorderRadius: "8px",
        btnFontSize: "13px",
        inputFontSize: "14px",
        inputPadding: "8px 10px",
        wrapPadding: "2px 6px",
        wrapGap: "4px",
    },
    large: {
        btnSize: "30px",
        btnBorderRadius: "10px",
        btnFontSize: "16px",
        inputFontSize: "16px",
        inputPadding: "10px 12px",
        wrapPadding: "4px 8px",
        wrapGap: "6px",
    },
};

export default function ButtonSpinEdit({
    value,
    onChange,
    step = 1,
    min = -Infinity,
    max = Infinity,
    placeholder = "Value",
    size = "medium",
    disabled = false,
    className = "",
    style = {},
}: ButtonSpinEditProps) {
    const [internal, setInternal] = useState<number>(value ?? 0);
    const [focused, setFocused] = useState<boolean>(false);

    const isControlled = value !== undefined;
    const val = isControlled ? value! : internal;

    const update = (next: number) => {
        const clamped = Math.min(max, Math.max(min, next));
        if (isControlled) onChange?.(clamped);
        else setInternal(clamped);
    };

    const t = sizeTokens[size];

    const wrap: CSSProperties = {
        display: "flex",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.3)",
        gap: t.wrapGap,
        padding: t.wrapPadding,
        minWidth: 0,
        opacity: disabled ? 0.5 : 1,
        boxSizing: "border-box",
        minHeight: "47px",
        ...style,
    };

    const spinBtn: CSSProperties = {
        width: t.btnSize,
        height: t.btnSize,
        borderRadius: t.btnBorderRadius,
        flexShrink: 0,

        background: "rgba(104, 45, 220, 0.12)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

        border: "1px solid rgba(255, 255, 255, 0.15)",
        color: "#e5e7eb",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: t.btnFontSize,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",

        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
        transition: "all 0.15s ease",
    };

    const input: CSSProperties = {
        width: "100%",
        height: "100%",
        padding: t.inputPadding,

        border: "none",
        outline: "none",

        fontSize: t.inputFontSize,
        fontFamily: "'DM Sans', system-ui, sans-serif",

        background: "transparent",
        boxSizing: "border-box",
        minWidth: 0,

        fontWeight: 500,
        color: "white",
    };

    return (
        <div style={wrap} className={className}>
            <button
                className="spin-btn"
                style={{
                    ...spinBtn,
                    opacity: val<=min ? 0.5 : 1,
                    cursor: val <= min ? "not-allowed" : "pointer",
                }}
                onClick={() => !disabled && update(val - step)}
                disabled={disabled}
                aria-label="Decrease"
            >
                −
            </button>
            <input
                className="no-spinner"
                style={input}
                type="number"
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                value={focused ? (val === 0 ? "" : val) : (val === 0 ? "" : val.toFixed(2))}
                onChange={e => !disabled && update(parseFloat(e.target.value) || 0)}
                disabled={disabled}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <button
                className="spin-btn"
                style={{
                    ...spinBtn,
                    opacity: val >= max ? 0.5 : 1,
                    cursor: val >= max ? "not-allowed" : "pointer",
                }}
                onClick={() => !disabled && update(val + step)}
                disabled={disabled}
                aria-label="Increase"
            >
                +
            </button>
        </div>
    );
}