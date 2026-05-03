import type {PaymentOptions} from "../tabs/PaymentTab.tsx";

export default function PreviewPaymentOptions({option}: {option: PaymentOptions}) {

    if (option.type === "bank") {
        return (
            <div>
                <h4 style={{margin: "0 0 5px 0"}}>Method: Bank</h4>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    }}
                >
                    <label>Bank:</label>
                    <label>{option.name}</label>
                    <label>Branch:</label>
                    <label>{option.branch}</label>
                    <label>Address:</label>
                    <label>{option.address}</label>
                    <span/>
                    <span/>
                    <label>Account Name:</label>
                    <label>{option.account_name}</label>
                    <label>Account #:</label>
                    <label>{option.account_number}</label>
                    <label>Routing #:</label>
                    <label>{option.routing_number}</label>
                    <label>Sort Code:</label>
                    <label>{option.sort_code}</label>
                    <label>SWIFT</label>
                    <label>{option.swift_code}</label>
                    <label>IBAN</label>
                    <label>{option.iban}</label>
                </div>
                <hr/>
            </div>
        )
    }
    if (option.type === "paypal") {
        return (
            <div>
                <h4 style={{margin: "0 0 5px 0"}}>Method: PayPal</h4>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    }}
                >
                    <label>Email:</label>
                    <label>{option.email}</label>
                </div>
                <hr/>
            </div>
        )
    }

    return (<></>)

}