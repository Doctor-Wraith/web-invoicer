import React, {useState, useEffect, useRef} from 'react'

//region styling
const INJECTED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
  .dp-input::placeholder { color: rgba(255,255,255,0.25); font-weight: 400; }
  .dp-cal-btn:hover { color: rgba(255,255,255,0.85) !important; background: rgba(255,255,255,0.06) !important; }
  .dp-nav-btn:hover { background: rgba(255,255,255,0.1) !important; color: white !important; }
  .dp-day-btn:hover { background: rgba(255,255,255,0.08) !important; }
`

const styles = {
    wrapper: {
        fontFamily: "'DM Sans', system-ui, sans-serif",
        maxWidth: 340,
        position: "relative",
    },
    label: {
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.5)",
        marginBottom: 6,
    },
    field: {
        display: "flex",
        alignItems: "center",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "border-color 0.15s, box-shadow 0.15s",
        boxSizing: "border-box",
    },
    fieldFocus: {
        borderColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.08)",
    },
    input: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "8px 10px",
        height: "100%",
        minHeight: 38,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "transparent",
        color: "white",
        boxSizing: "border-box",
        minWidth: 0,
    },
    calBtn: {
        width: 38,
        height: 38,
        border: "none",
        borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255, 255, 255, 0.5)",
        flexShrink: 0,
        transition: "color 0.1s, background 0.1s",
    },
    error: {
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(255, 100, 100, 0.9)",
        margin: "5px 0 0",
    },
    cal: {
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        zIndex: 100,
        background: "rgba(20, 20, 30, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 16,
        padding: 14,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        minWidth: 280,
    },
    calNav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    navBtn: {
        background: "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 8,
        padding: "3px 12px",
        cursor: "pointer",
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.6)",
        lineHeight: 1.4,
        transition: "background 0.1s, color 0.1s",
    },
    monthLabel: {
        fontSize: 14,
        fontWeight: 500,
        color: "white",
        fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2,
    },
    dayLabel: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.3)",
        padding: "4px 0 8px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    dayBtn: {
        textAlign: "center",
        fontSize: 13,
        fontWeight: 500,
        padding: "6px 2px",
        cursor: "pointer",
        borderRadius: 8,
        color: "rgba(255, 255, 255, 0.85)",
        border: "none",
        background: "none",
        width: "100%",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        transition: "background 0.1s",
    },
    dayOther: {
        color: "rgba(255, 255, 255, 0.2)",
        cursor: "default",
    },
    dayToday: {
        fontWeight: 600,
        color: "white",
        background: "rgba(255, 255, 255, 0.1)",
    },
    daySelected: {
        background: "rgba(255, 255, 255, 0.9)",
        color: "#111",
    },
} as const;
//endregion

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
]

const DAY_LABELS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

function parseInput(val:string): Date | null {
    const matched = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!matched) return null;

    const day = parseInt(matched[1]);
    const month = parseInt(matched[2]) - 1;
    const year = parseInt(matched[3]);

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {return null}
    return date;
}

function formatDate(date:Date) {
    return [
        String(date.getDate()).padStart(2, "0"),
        String(date.getMonth() + 1).padStart(2, "0"),
        date.getFullYear()
    ].join('/');
}

function CalendarIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <rect x="4" y="9" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="7" y="9" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="10" y="9" width="2" height="2" rx="0.5" fill="currentColor"/>
        </svg>
    );
}

interface CalendarProps {
    viewYear: number;
    viewMonth: number;
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    onPrev: () => void;
    onNext: () => void;
}

function Calendar({
                    viewYear,
                    viewMonth,
                    selectedDate,
                    onSelect,
                    onPrev,
                    onNext
                  } : CalendarProps) {
    const today = new Date();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayWeek = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = firstDayWeek === 0 ? 6: firstDayWeek -1;
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    for (let i = startOffset -1; i >= 0; i--) {
        cells.push({ day: prevMonthDays - i, type: "other"})
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(viewYear, viewMonth, d);
        cells.push({
            day: d,
            type: "current",
            isToday: date.toDateString === today.toDateString,
            isSelected: selectedDate && date.toDateString() === selectedDate.toDateString(),
            date: date
        });
    }

    const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);

    for (let d = 1; d <= remaining; d++) {
        cells.push({day: d, type:"other"})
    }

    return (
        <div style={styles.cal}>
            <div style={styles.calNav}>
                <button className="dp-nav-btn" style={styles.navBtn} onClick={onPrev}>&#8249;</button>
                <span style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
                <button className="dp-nav-btn" style={styles.navBtn} onClick={onNext}>&#8250;</button>
            </div>
            <div style={styles.grid}>
                {DAY_LABELS.map(d => (
                    <div key={d}
                         style={styles.dayLabel}>{d}</div>
                ))}
                {cells.map((cell, i) => (
                    <button
                        key={i}
                        className="dp-day-btn"
                        disabled={cell.type === "other"}
                        onClick={() => cell.type === "current" && cell.date && onSelect(cell.date)}
                        style={{
                            ...styles.dayBtn,
                            ...(cell.type==="other" ? styles.dayOther: {}),
                            ...(cell.isToday && !cell.isSelected ? styles.dayToday : {}),
                            ...(cell.isSelected ? styles.daySelected : {}),
                        }}
                    >
                        {cell.day}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface DatePickerProps {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    label?: string;
}

export default function DatePicker({value, onChange, label="Select a data"}: DatePickerProps) {
    const today = new Date()
    const [inputVal, setInputVal] = useState(value ? formatDate(value) : "");
    const [error, setError] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const wrapperRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let raw = e.target.value.replace(/\D/g, "");
        if (raw.length > 2) raw = raw.slice(0, 2) + "/" + raw.slice(2);
        if (raw.length > 5) raw = raw.slice(0, 5) + "/" + raw.slice(5);
        if (raw.length > 10) raw = raw.slice(0, 10);
        setInputVal(raw);

        if (raw.length === 0) {
            setSelectedDate(null);
            setError("");
            onChange?.(null);
            return;
        }

        if (raw.length === 10) {
            const date = parseInput(raw);
            if (date) {
                setSelectedDate(date);
                setViewYear(date.getFullYear());
                setViewMonth(date.getMonth());
                setError("");
                onChange?.(date)
            } else {
                setSelectedDate(null);
                setError("Please Enter a valid Date")
            }
        } else {
            setError("")
        }

    }

    function handleSelect(date: Date) {
        setSelectedDate(date);
        setInputVal(formatDate(date));
        setError("");
        setOpen(false);
        onChange?.(date);
    }

    function handleCalBtn() {
        if (!open && selectedDate) {
            setViewYear(selectedDate.getFullYear());
            setViewMonth(selectedDate.getMonth());
        }
        setOpen(o => !o);
    }

    function handlePrev() {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
    }

    function handleNext() {
        if (viewMonth ==11) {
            setViewMonth(0) ;
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
    }

    return (
        <div ref={wrapperRef} style={styles.wrapper}>
            <style>{INJECTED_STYLE}</style>
            {label && <label style={styles.label}>{label}</label>}
            <div
                style={{
                    ...styles.field,
                    ...(open?styles.fieldFocus: {})
                }}
            >
                <input
                    className="dp-input"
                    style={styles.input}
                    type='text'
                    value={inputVal}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    maxLength={10}
                />
                <button
                    className="dp-cal-btn"
                    style={styles.calBtn}
                    onClick={handleCalBtn}
                    aria-label="Open calendar"
                >
                    <CalendarIcon />
                </button>
            </div>
            {error && <p style={styles.error}>{error}</p>}
            {open && (
                <Calendar
                    viewYear={viewYear}
                    viewMonth={viewMonth}
                    selectedDate={selectedDate}
                    onSelect={handleSelect}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}
        </div>
    )
}