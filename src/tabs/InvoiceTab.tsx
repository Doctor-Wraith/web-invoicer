import CurrencySelect from "../custom components/CurrencySelect.tsx";
import type {Currency} from "../data/currencies.tsx";

export type Type = "percent" | "flat"

export interface PercentFlat {
    amount: number;
    kind: Type;
}

interface InvoiceTabProps {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}

export default function InvoiceTab({ currency, setCurrency }: InvoiceTabProps) {
    return (
        <div>
            <CurrencySelect
                value={currency}
                onChange={setCurrency}
            />
        </div>
    )
}