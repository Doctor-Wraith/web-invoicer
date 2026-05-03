// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import jsPDF from 'jsPDF';
import autoTable from "jspdf-autotable";

// at the top of the file, extend jsPDF's type
declare module "jspdf" {
    interface jsPDF {
        lastAutoTable: { finalY: number };
    }
}
import type { ProductInformation } from "../custom components/productRow/ProductRow.tsx";
import type { Currency } from "../data/currencies.tsx";
import type { Customer } from "../tabs/CustomerTab.tsx";
import type { InvoiceDetails, PercentFlat } from "../tabs/InvoiceTab.tsx";
import type { PaymentOptions } from "../tabs/PaymentTab.tsx";
import type { Company } from "../tabs/CompanyTab.tsx";

interface pdfProps {
    products: ProductInformation[]
    services: ProductInformation[]
    currency: Currency
    customer: Customer
    invoiceDetails: InvoiceDetails
    paymentOptions: PaymentOptions[]
    company: Company
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (amount: number, currency: Currency) =>
    `${currency.code} ${amount.toFixed(2)}`;

const fmtDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const lineTotal = (item: ProductInformation) => item.amount * item.cost;

const subtotalOf = (items: ProductInformation[]) =>
    items.reduce((s, i) => s + lineTotal(i), 0);

function applyPercentFlat(
    base: number,
    pf: PercentFlat | undefined
): number {
    if (!pf) return 0;
    return pf.kind === "percent" ? base * (pf.amount / 100) : pf.amount;
}
// ─── Main ────────────────────────────────────────────────────────────────────

export function exportToPDF({
    products,
    services,
    currency,
    customer,
    invoiceDetails,
    paymentOptions,
    company,
}: pdfProps) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth();   // 210
    const H = doc.internal.pageSize.getHeight();  // 297
    const L = 14;   // left margin
    const R = W - L; // right margin x

    // colours
    const BLACK: [number, number, number] = [0, 0, 0];
    const GREY: [number, number, number] = [100, 100, 100];
    const LTGREY: [number, number, number] = [220, 220, 220];
    const WHITE: [number, number, number] = [255, 255, 255];
    const HEAD: [number, number, number] = [40, 40, 40]; // table header bg

    const setColor = (c: [number, number, number]) => doc.setTextColor(...c);
    const setDraw = (c: [number, number, number]) => doc.setDrawColor(...c);

    // ── 1. Header ──────────────────────────────────────────────────────────────
    let y = 14;

    // Company block (left)
    setColor(BLACK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(company.name === "" ? "Your Company": company.name, L, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(GREY);
    doc.text(company.address === "" ? "123 Business Ave." : company.address, L, y); y += 5;
    doc.text(company.email === "" ? "contact@company.com" : company.email, L, y); y += 5;
    doc.text(company.phone === "" ? "(555) 123-4567" : company.phone, L, y);

    // INVOICE label (right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    setColor(BLACK);
    doc.text("INVOICE", R, 18, { align: "right" });

    // Invoice meta (right, below label)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(GREY);
    let ry = 26;
    const meta: [string, string][] = [
        ["Invoice #:", invoiceDetails.invoiceNumber],
        ["Issue Date:", invoiceDetails.issueDate != null ? fmtDate(invoiceDetails.issueDate) : fmtDate(new Date())],
        ...(invoiceDetails.dueDate != null ? [["Due Date:", fmtDate(invoiceDetails.dueDate)]] as [string, string][] : []),
        ...(invoiceDetails.paymentTerms != "" ? [["Payment Terms:", invoiceDetails.paymentTerms]] as [string, string][] : []),
    ];

    meta.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, R - 40, ry);
        doc.setFont("helvetica", "normal");
        doc.text(value, R, ry, { align: "right" });
        ry += 5;
    });

    // Divider
    y = 44;
    setDraw(LTGREY);
    doc.setLineWidth(0.3);
    doc.line(L, y, R, y);
    y += 6;

    // ── 2. Issued To + Payment Terms row ──────────────────────────────────────
    setColor(GREY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Issued To:", L, y);
    y += 5;

    setColor(BLACK);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Name: ${customer.name}`, L, y); y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${customer.id}`, L, y); y += 5;
    doc.text(`Address: ${customer.address}`, L, y); y += 5;
    doc.text(`Zip Code: ${customer.zip}`, L, y); y += 5;
    doc.text(
        `Email: ${customer.email}  |  Phone: ${customer.phone}`,
        L, y
    );

    y += 10;

    // Divider
    setDraw(LTGREY);
    doc.line(L, y, R, y);
    y += 6;

    // ── 3. Item table helper ───────────────────────────────────────────────────
    const renderTable = (
        label: string,
        items: ProductInformation[],
        colHeader: string,
        startY: number
    ): number => {
        const rows =
            items.length === 0
                ? [[`No ${label.toLowerCase()} added`, "", "", ""]]
                : items.map((item) => [
                    item.name,
                    String(item.amount),
                    fmt(item.cost, currency),
                    fmt(lineTotal(item), currency),
                ]);

        autoTable(doc, {
            startY,
            head: [[label, colHeader, `${colHeader === "Rate (/Hours)" ? "Hour" : "Price"}`, "Amount"]],
            body: rows,
            theme: "plain",
            styles: {
                fontSize: 9,
                cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
                textColor: BLACK,
            },
            headStyles: {
                fillColor: HEAD,
                textColor: WHITE,
                fontStyle: "bold",
                fontSize: 9,
            },
            columnStyles: {
                0: { cellWidth: "auto" },
                1: { cellWidth: 22, halign: "right" },
                2: { cellWidth: 38, halign: "right" },
                3: { cellWidth: 30, halign: "right" },
            },
            alternateRowStyles: { fillColor: [248, 248, 248] },
            margin: { left: L, right: L },
            tableLineColor: LTGREY,
            tableLineWidth: 0.2,
        });

        return doc.lastAutoTable.finalY + 6;
    };
    if ((products.length >0)) {
        y = renderTable("Products", products, "Qty", y);
    }
    if (services.length > 0) {
        y = renderTable("Services", services, "Hours", y);
    }
    y += 30
    // ── 4. Totals (right-aligned block) ───────────────────────────────────────
    const productsSub = subtotalOf(products);
    const servicesSub = subtotalOf(services);
    const subtotal = productsSub + servicesSub;
    const discountAmt = applyPercentFlat(subtotal, invoiceDetails.discount);
    const afterDisc = subtotal - discountAmt;
    const taxAmt = applyPercentFlat(afterDisc, invoiceDetails.tax);
    const shipping = invoiceDetails.shipping ?? 0;
    const total = afterDisc + taxAmt + shipping;

    const discountLabel =
        invoiceDetails.discount?.kind === "percent"
            ? `Discount (${invoiceDetails.discount.amount}%):`
            : `Discount:`;

    const taxLabel =
        invoiceDetails.tax?.kind === "percent"
            ? `Tax (${invoiceDetails.tax.amount}%):`
            : `Tax:`;

    const totalsRows: [string, string][] = [
        ["Subtotal:", fmt(subtotal, currency)],
        [discountLabel, `- ${fmt(discountAmt, currency)}`],
        [taxLabel, fmt(taxAmt, currency)],
        ["Shipping:", fmt(shipping, currency)],
    ];

    const colLabel = W / 2 + 10;
    const colValue = R;

    doc.setFontSize(9);
    totalsRows.forEach(([label, value]) => {
        if (y > 265) { doc.addPage(); y = 14; }
        doc.setFont("helvetica", "normal");
        setColor(GREY);
        doc.text(label, colLabel, y);
        setColor(BLACK);
        doc.text(value, colValue, y, { align: "right" });
        y += 6;
    });

    // Total row — bold + line above
    setDraw(LTGREY);
    doc.line(colLabel, y - 2, colValue, y - 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(BLACK);
    doc.text("Total:", colLabel, y + 2);
    doc.text(fmt(total, currency), colValue, y + 2, { align: "right" });
    y += 12;

    // Divider
    setDraw(LTGREY);
    doc.line(L, y, R, y);
    y += 6;

    // ── 5. Payment Details ────────────────────────────────────────────────────
    let estimatedHeight = 0;

    paymentOptions.forEach((opt) => {
        estimatedHeight += opt.type === "bank" ? 6 * 5 + 8 : 2 * 5 + 8;
    })
    if (y + estimatedHeight > 270) { doc.addPage(); y = 14; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(BLACK);
    doc.text("Payment Details", L, y);
    y += 6;

    paymentOptions.forEach((opt) => {
        if (y > 260) { doc.addPage(); y = 14; }

        if (opt.type === "bank") {
            // Method header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            setColor(BLACK);
            doc.text("Method: Bank", L, y);
            y += 5;

            // Two-column grid: [label, value, label, value]
            const bankFields: [string, string, string, string][] = [
                ["Bank:\t\t",         opt.name,           "Branch:\t\t",    opt.branch],
                ["Address:\t\t",      opt.address,        "",           ""],
                ["Account Name:\t\t", opt.account_name,   "Account #:\t\t", opt.account_number],
                ["Routing #:\t\t",    opt.routing_number, "Sort Code:\t\t", opt.sort_code],
                ["SWIFT:\t\t",        opt.swift_code,     "IBAN:\t\t",      opt.iban],
            ];

            const col1L = L;         // left label
            const col1V = L + 30;    // left value
            const col2L = W / 2;     // right label
            const col2V = W / 2 + 32; // right value

            bankFields.forEach(([label1, val1, label2, val2]) => {
                if (y > 270) { doc.addPage(); y = 14; }
                doc.setFont("helvetica", "bold");
                setColor(GREY);
                doc.text(label1, col1L, y);
                doc.setFont("helvetica", "normal");
                setColor(BLACK);
                doc.text(val1 ?? "", col1V, y);

                if (label2) {
                    doc.setFont("helvetica", "bold");
                    setColor(GREY);
                    doc.text(label2, col2L, y);
                    doc.setFont("helvetica", "normal");
                    setColor(BLACK);
                    doc.text(val2 ?? "", col2V, y);
                }
                y += 5;
            });
            y += 3;
        }

        if (opt.type === "paypal") {
            if (y > 270) { doc.addPage(); y = 14; }
            const ppRows: [string, string][] = [
                ["Method:", "PayPal"],
                ["Email:", opt.email],
            ];
            ppRows.forEach(([label, value]) => {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                setColor(GREY);
                doc.text(label, L, y);
                doc.setFont("helvetica", "normal");
                setColor(BLACK);
                doc.text(value, L + 30, y);
                y += 5;
            });
            y += 3;
        }
    });

    // ── 6. End message ────────────────────────────────────────────────────────
    if (invoiceDetails.endMessage?.trim()) {
        if (y > 255) { doc.addPage(); y = 14; }
        setDraw(LTGREY);
        doc.line(L, y, R, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setColor(GREY);
        const wrapped = doc.splitTextToSize(invoiceDetails.endMessage, W - L * 2);
        doc.text(wrapped, L, y);
        y += wrapped.length * 5 + 4;
    }

    // ── 7. Footer on every page ───────────────────────────────────────────────
    const total_pages = doc.getNumberOfPages();
    for (let p = 1; p <= total_pages; p++) {
        doc.setPage(p);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setColor(GREY);
        doc.text(
            `Page ${p} / ${total_pages}`,
            W / 2, H - 8,
            { align: "center" }
        );
    }

    doc.save(`invoice-${invoiceDetails.invoiceNumber}.pdf`);
}