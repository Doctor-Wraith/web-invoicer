import React, { useEffect, useRef, useState } from "react";

interface ToggleOption<T extends string> {
    label: string;
    value: T;
}

interface ToggleProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: ToggleOption<T>[];
}

export default function Toggle<T extends string>({
    value,
    onChange,
    options,
}: ToggleProps<T>) {

    const containerRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [pillStyle, setPillStyle] = useState<React.CSSProperties>({
        width: 0,
        transform: "translateX(0px)",
    });

    // Update pill position + size
    useEffect(() => {
        const activeEl = optionRefs.current[value];
        const container = containerRef.current;

        if (activeEl && container) {
            const containerRect = container.getBoundingClientRect();
            const rect = activeEl.getBoundingClientRect();

            const left = rect.left - containerRect.left;
            const width = rect.width;
            const inset = 5;

            setPillStyle({
                width,
                transform: `translateX(${left - inset}px)`,
            });
        }
    }, [value, options]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                display: "inline-flex",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                padding: 5,
            }}
        >
            {/* Sliding pill */}
            <div
                style={{
                    position: "absolute",
                    top: 2,
                    bottom: 2,
                    left: 2,
                    ...pillStyle,
                    background: "rgba(103, 7, 139, 0.23)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(103, 7, 139, 0.62)",
                    borderRadius: 10,
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            />

            {options.map((option) => {

                return (
                    <button
                        key={option.value}
                        ref={(el) => {
                            optionRefs.current[option.value] = el;
                        }}
                        onClick={() => onChange(option.value)}
                        style={{
                            padding: "8px 20px",
                            fontSize: 14,
                            fontWeight: 500,
                            fontFamily: "'DM Sans', system-ui, sans-serif",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            position: "relative",
                            zIndex: 1,
                            color: "#fff",
                            transition: "color 0.2s",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}