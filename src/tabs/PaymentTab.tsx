import "../styles/PaymentsTab.css"
import IconButton from "../custom components/IconButton.tsx";
import {TrashIcon} from "../assets/icons.tsx";
import BankPayment, {type BankInformation} from "../custom components/paymentOptions/BankPayments.tsx";
import PayPalPayments, {type PayPalInformation} from "../custom components/paymentOptions/PayPalPayments.tsx";
import React, {type JSX} from "react";

export type PaymentOptions = BankInformation | PayPalInformation;

interface Props {
    paymentOptions: PaymentOptions[];
    setPaymentOptions: React.Dispatch<React.SetStateAction<PaymentOptions[]>>;
    onSave: (paymentOptions: PaymentOptions[]) => void;
    paymentPrompt: () => Promise<PaymentOptions | null>;
    confirm: (message: string) => Promise<unknown>;
}

export default function PaymentTab({paymentOptions, setPaymentOptions, onSave, paymentPrompt, confirm}: Props): JSX.Element {


    const handleChange = (updated: PaymentOptions) => {
        const next = paymentOptions.map(o => o.id === updated.id ? updated : o);
        setPaymentOptions(next);
        onSave(next);
    }

    const handleDelete = (id: string) => {
        const next = paymentOptions.filter(o => o.id !== id);
        setPaymentOptions(next);
        onSave(next);
    }

    const renderPaymentOptions = (o: PaymentOptions) => {
        if (o.type === "bank") {
            return <BankPayment key={o.id} information={o} setInformation={handleChange} onDelete={handleDelete} />
        }
        if (o.type === "paypal") {
            return <PayPalPayments key={o.id} information={o} setInformation={handleChange} onDelete={handleDelete} />
        }
    }

    const handleAdd = async () => {
        const option: PaymentOptions | null = await paymentPrompt()
        if (!option) {return}
        const added = [...paymentOptions, option];
        setPaymentOptions(added);
        onSave(added);
    }

    const handleDeleteAll = async () => {
        const ok = await confirm("Are you sure you want to Delete All?");
        if (ok) {
            setPaymentOptions([]);
            onSave([])
        }
    }

    return (
        <div className="tab payment-tab">
            <div className="payment-header">
                <h3>Payment Methods</h3>

                <div className="payment-header-buttons">
                    <IconButton
                        variant="danger_glass"
                        label="Remove All"
                        icon={TrashIcon}
                        onClick={handleDeleteAll}
                    />
                    <IconButton
                        variant="glass"
                        label="Add"
                        onClick={handleAdd}
                    />
                </div>
            </div>
            <hr/>
            <div className="payment-options">
                {paymentOptions.map(renderPaymentOptions)}
            </div>
        </div>
    )
}