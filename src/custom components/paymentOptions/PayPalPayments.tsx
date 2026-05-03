import {PayPalIcon, TrashIcon} from "../../assets/icons.tsx";
import IconButton from "../IconButton.tsx";

export interface PayPalInformation {
    type: "paypal";
    id: string;
    email: string;
}

interface payPalPaymentProps {
    information: PayPalInformation;
    setInformation: (info: PayPalInformation) => void;
    onDelete: (id: string) => void;
}

export default function PayPalPayments({information, setInformation, onDelete}: payPalPaymentProps) {
    const update = (field: keyof PayPalInformation, value: string) => {
        setInformation?.({...information, [field]: value});
    }
    return (
        <div style={{border: '1px solid white', padding: '15px 10px', borderRadius:"8px"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <h4 style={{margin: 0}}>PayPal</h4>
                <span style={{display: "flex", alignItems: "center"}}>
                    <PayPalIcon />
                </span>
            </div>
            <div
                style={{
                    marginTop: "10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                }}
            >
                <input
                    placeholder="PayPal Email"
                    type="email"
                    value={information.email}
                    onChange={(e) => {update("email", e.target.value)}}
                />
                <span/>
                <IconButton
                    label="Remove"
                    icon={TrashIcon}
                    variant="danger_glass"
                    onClick={() => onDelete?.(information.id)}
                />
            </div>
        </div>
    )
}