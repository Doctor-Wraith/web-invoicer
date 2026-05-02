import { useState, useRef, useEffect } from "react";
import currencies from "../data/currencies";
import { type Currency } from "../data/currencies";

const INJECTED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
  .cs-input::placeholder { color: rgba(255,255,255,0.25); font-weight: 400; }
  .cs-trigger:hover { border-color: rgba(255,255,255,0.25) !important; background: rgba(255,255,255,0.09) !important; }
  .cs-item:hover { background: rgba(255,255,255,0.08) !important; }
`;

export default function CurrencySelect({ value, onChange, id, label }: { value: Currency; onChange: (c: Currency) => void; id?: string; label?: string }) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = currencies.filter(
        (c) =>
            c.code.toLowerCase().includes(query.toLowerCase()) ||
            c.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (currency: Currency) => {
        onChange(currency);
        setIsOpen(false);
        setQuery("");
    };

    const selected = currencies.find((c) => c.code === value.code);

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <style>{INJECTED_STYLE}</style>

            {label && (
                <label
                    htmlFor={id}
                    style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: 6,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                    }}
                >
                    {label}
                </label>
            )}

            <button
                id={id}
                className="cs-trigger"
                onClick={() => setIsOpen((prev) => !prev)}
                style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    cursor: "pointer",
                    textAlign: "left" as const,
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: selected ? "white" : "rgba(255,255,255,0.25)",
                    transition: "border-color 0.15s, background 0.15s",
                    boxSizing: "border-box" as const,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <span>{selected ? `${selected.code} — ${selected.name}` : "Select currency"}</span>
                <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{ opacity: 0.4, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
                >
                    <path d="M2 5l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        background: "rgba(20, 20, 30, 0.85)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 16,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                >
                    <input
                        autoFocus
                        className="cs-input"
                        placeholder="Search currency..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            outline: "none",
                            fontSize: 14,
                            fontWeight: 500,
                            fontFamily: "'DM Sans', system-ui, sans-serif",
                            background: "transparent",
                            color: "white",
                            boxSizing: "border-box" as const,
                        }}
                    />

                    <ul
                        style={{
                            maxHeight: 240,
                            overflowY: "auto" as const,
                            margin: 0,
                            padding: 0,
                            listStyle: "none",
                        }}
                    >
                        {filtered.length === 0 ? (
                            <li style={{ padding: "12px 14px", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
                                No results
                            </li>
                        ) : (
                            filtered.map((c) => (
                                <li
                                    key={c.code}
                                    className="cs-item"
                                    onClick={() => handleSelect(c)}
                                    style={{
                                        padding: "10px 14px",
                                        cursor: "pointer",
                                        background: value.code === c.code ? "rgba(255,255,255,0.1)" : "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        transition: "background 0.1s",
                                    }}
                                >
                                    <span style={{ fontSize: 14, fontWeight: 500, color: "white" }}>{c.code}</span>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{c.name}</span>
                                    {value.code === c.code && (
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "auto", flexShrink: 0 }}>
                                            <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}