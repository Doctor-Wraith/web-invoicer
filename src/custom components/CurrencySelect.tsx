import { useState, useRef, useEffect } from "react";
import currencies from "../data/currencies";
import {type Currency} from "../data/currencies";

export default function CurrencySelect({ value, onChange }: {value: Currency, onChange:any} ) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Filter based on search query
    const filtered = currencies.filter(
        (c) =>
            c.code.toLowerCase().includes(query.toLowerCase()) ||
            c.name.toLowerCase().includes(query.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (containerRef.current && !containerRef.current.contains(e.target)) {
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
        <div ref={containerRef} style={{ position: "relative", width: "280px" }}>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                }}
            >

                {selected ? `${selected.code} — ${selected.name}` : "Select currency"}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                >
                    {/* Search input */}
                    <input
                        autoFocus
                        placeholder="Search currency..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            borderBottom: "1px solid #eee",
                            outline: "none",
                            fontSize: "14px",
                            boxSizing: "border-box",
                        }}
                    />

                    {/* List */}
                    <ul
                        style={{
                            maxHeight: "240px",
                            overflowY: "auto",
                            margin: 0,
                            padding: 0,
                            listStyle: "none",
                        }}
                    >
                        {filtered.length === 0 ? (
                            <li style={{ padding: "12px 14px", color: "#999" }}>No results</li>
                        ) : (
                            filtered.map((c) => (
                                <li
                                    key={c.code}
                                    onClick={() => handleSelect(c)}
                                    style={{
                                        padding: "10px 14px",
                                        cursor: "pointer",
                                        background: value.code === c.code ? "#f0f4ff" : "white",
                                        fontWeight: value.code === c.code ? 600 : 400,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                            value.code === c.code ? "#f0f4ff" : "white")
                                    }
                                >
                                    <span style={{ marginRight: "8px" }}>{c.code}</span>
                                    <span style={{ color: "#666", marginLeft: "6px" }}>{c.name}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}