import {type JSX, useState} from "react";
import * as React from "react";

type Variant = "primary" | "outline" | "accent" | "ghost";
type Size = "default" | "small" | "icon";

interface IconButton {
    onClick?: () => void;
    label?: string;
    icon?: React.ComponentType;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;

}

const PlusIcon= (): JSX.Element  => {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>;
};

export default function IconButton({
    onClick,
    label = "Button",
    icon: Icon = PlusIcon,
    variant = "primary",
    size = "default",
    disabled = false,
    className = "",
    style = {},
                                   }: IconButton) {
    const [pressed, setPressed] = useState<boolean>(false);

    const base: React.CSSProperties  = {
        all: "unset",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: size === "small" ? "6px" : "14px",
        fontSize: size === "small" ? "12px" : "14px",
        fontWeight: 500,
        borderRadius: size === "small" ? "8px" : "10px",
        userSelect: "none",
        whiteSpace: "nowrap",
        transition: "background-color 0.15s, transform 0.1s, box-shadow 0.15s",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        opacity: disabled ? "0.5" : "1",
        boxSizing: "border-box",
    }

    const padding =
        size === "icon"
        ? "10px"
        : size === "small"
        ? "7px 12px"
        : "10px 18px";

    const variantStyles: Record<Variant, React.CSSProperties>  = {
        primary: {
            backgroundColor: "#1a1a1a",
            color: "#fff",
            padding,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.18)",
        },
        outline: {
            backgroundColor: "transparent",
            color: "inherit",
            padding,
            border: "1.5px solid rgba(0, 0, 0, 0.2)",
        },
        accent: {
            background: "#2a7d52",
            color: "#fff",
            padding,
            boxShadow: "0 1px 4px rgba(42,125,82,0.25)",
        },
        ghost: {
            background: "rgba(0, 0, 0, 0.05)",
            color: "inherit",
            padding,
        }
    };

    return (
        <button
            onClick={!disabled ? onClick : undefined}
            onMouseDown={() => !disabled && setPressed(true)}
            onMouseUp={() => !disabled && setPressed(false)}
            onMouseLeave={() => !disabled && setPressed(false)}
            style={{ ...base, ...variantStyles[variant], ...style }}
            className={className}
            disabled={disabled}
            aria-label={size === "icon" ? label : undefined}
            title={size === "icon" ? label : undefined}
        >
            <span style={{display: "flex", alignItems: "center"}}>
                <Icon />
            </span>
            {size !== "icon" && <span>{label}</span>}
        </button>
    );
}