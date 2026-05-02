import {format} from 'date-fns';
import type {InvoiceDetails} from "../tabs/InvoiceTab.tsx";

interface Props {
    invoiceDetails: InvoiceDetails
}

export default function PreviewInvoiceDetails({ invoiceDetails }: Props) {
    return (
        <div style={{ width: "100%" , flex:1}}>
            <h2 style={{ textAlign: "right" }}>Invoice</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    columnGap: 12,
                    rowGap: 4,
                    justifyContent: "end", // pushes whole block to the right
                    textAlign: "right",
                }}
            >
                <span>Invoice #:</span>
                <span>{invoiceDetails.invoiceNumber || "INV-001"}</span>

                <span>Issue Date:</span>
                <span>{format(
                    invoiceDetails.issueDate || new Date(),
                    "MMMM do, yyyy"
                )}</span>

                {invoiceDetails.dueDate && (
                    <>
                        <span>Due Date:</span>
                        <span>{format(invoiceDetails.dueDate, "MMMM do, yyyy")}</span>
                    </>
                )}
                {invoiceDetails.paymentTerms && (
                    <>
                        <span>Terms of Payment</span>
                        <span style={{ maxWidth: "200px", wordBreak: "break-word" }}>{invoiceDetails.paymentTerms}</span>
                    </>
                )}
            </div>
        </div>
    );
}