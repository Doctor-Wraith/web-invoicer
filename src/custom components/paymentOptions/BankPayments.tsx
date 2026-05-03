import {BankIcon, TrashIcon} from "../../assets/icons.tsx";
import IconButton from "../IconButton.tsx";

export interface BankInformation {
    type: "bank";
    id: string;
    name: string;
    branch: string;
    address: string;
    account_name: string;
    account_number: string;
    routing_number: string;
    sort_code: string;
    swift_code: string;
    iban: string;
}

interface BankPaymentProps {
    information: BankInformation;
    setInformation: (bankInformation: BankInformation) => void;
    onDelete: (id: string) => void;
}

export default function BankPayment({ information, setInformation, onDelete }: BankPaymentProps) {
    const update = (field: keyof BankInformation, value: string) => {
        setInformation?.({...information, [field]: value});
    }

    return (


        <div style={{border: '1px solid white', padding: '15px 10px', borderRadius:"8px"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <h4 style={{margin: 0}}>Bank</h4>
                <span style={{display: "flex", alignItems: "center"}}>
                    <BankIcon />
                </span>
            </div>

            <div style={
                {
                    marginTop: "10px",
                    display: 'grid',
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px"
                }
            }>
                <input
                    placeholder="Bank Name"
                    value={information.name}
                    onChange={(e) => {update("name", e.target.value)}}
                />
                <input
                    placeholder="Branch"
                    value={information.branch}
                    onChange={(e) => {update("branch", e.target.value)}}
                />
                <input
                    placeholder="Address"
                    value={information.address}
                    onChange={(e) => {update("address", e.target.value)}}
                />
                <input
                    placeholder="Account Name"
                    value={information.account_name}
                    onChange={(e) => {update("account_name", e.target.value)}}
                />
                <input
                    placeholder="Acount Number"
                    value={information.account_number}
                    onChange={(e) => {update("account_number", e.target.value)}}
                />
                <input
                    placeholder="Routing Number"
                    value={information.routing_number}
                    onChange={(e) => {update("routing_number", e.target.value)}}
                />
                <input
                    placeholder="Sort Code"
                    value={information.sort_code}
                    onChange={(e) => {update("sort_code", e.target.value)}}
                />
                <input
                    placeholder="SWIFT Code"
                    value={information.swift_code}
                    onChange={(e) => {update("swift_code", e.target.value)}}
                />
                <input
                    placeholder="IBAN Code"
                    value={information.iban}
                    onChange={(e) => {update("iban", e.target.value)}}
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