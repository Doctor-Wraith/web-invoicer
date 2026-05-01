import "../styles/customer.css"
import {useState} from "react";

export interface Customer {
    name: string;
    id: string;
    address: string;
    zip: string;
    phone: string;
    email: string;
}

interface CustomerTabProps {
    customer: Customer;
    setCustomer:(customer: Customer) => void;
}

const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length === 0) return "";

    // Last 10 digits are the local number, everything before is country code
    const localDigits = digits.slice(-10);
    const countryDigits = digits.slice(0, -10);

    const local = (() => {
        if (localDigits.length <= 3) return `(${localDigits}`;
        if (localDigits.length <= 6) return `(${localDigits.slice(0, 3)}) ${localDigits.slice(3)}`;
        return `(${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6)}`;
    })();

    if (countryDigits.length === 0) return local;
    return `+${countryDigits} ${local}`;
};

export default function CustomerTab({customer, setCustomer}:CustomerTabProps) {

    const update = (field: keyof Customer, value: string) => {
        setCustomer?.({...customer, [field]: value});
    }

    const [emailError, setEmailError] = useState("");
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const [phoneError, setPhoneError] = useState("");
    const isValidPhone = (phone: string) => /^(\+\d{1,3} )?\(\d{3}\) \d{3}-\d{4}$/.test(phone) && (phone.length <= 19);

    return (
        <div className="customer-tab">
            <div className="customer-field-wrapper">
                <div className="customer-field">
                    <label htmlFor="customer_name">Customer Name</label>
                    <input
                        id="customer_name"
                        type="text"
                        name="customer_name"
                        value={customer.name}
                        placeholder="John Doe"
                        onChange={e => update("name", e.target.value)}
                    ></input>
                </div>

                <div className="customer-field">
                    <label htmlFor="id_number">Identifier Number</label>
                    <input
                        id="id_number"
                        type="text"
                        name="id_number"
                        placeholder="ABC0123"
                        value={customer.id}
                        onChange={e => update("id", e.target.value)}
                    ></input>
                </div>

                <div className="customer-field">
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        placeholder="123 Main St, Apt 4"
                        value={customer.address}
                        onChange={e => update("address", e.target.value)}
                    ></input>
                </div>

                <div className="customer-field">
                    <label htmlFor="zip">Zip Code</label>
                    <input
                        id="zip"
                        type="text"
                        name="zip"
                        placeholder="123456"
                        value={customer.zip}
                        onChange={e => update("zip", e.target.value)}
                    ></input>
                </div>

                <div className="customer-field">
                    <label htmlFor="phone">Phone</label>
                    <div className="customer-input-wrapper">
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            placeholder="+1 (XXX) XXX-XXXX"
                            value={customer.phone}
                            onChange={e => {
                                const formatted = formatPhone(e.currentTarget.value);
                                update("phone", formatted);
                                setPhoneError(formatted === "" ? "" : isValidPhone(formatted) ? "" : "Invalid phone number");
                            }}
                            className={phoneError ? "input-error" : ""}
                        ></input>
                        {phoneError && (
                            <div className="speech-bubble">
                                Please Enter a valid phone number.
                                <span className="speech-bubble-arrow"/>
                            </div>
                        )}
                    </div>
                </div>

                <div className="customer-field">
                    <label htmlFor="email">Email</label>
                    <div className="customer-input-wrapper">
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="fake@email.com"
                        value={customer.email}
                        onChange={e => {
                            update("email", e.target.value)
                            setEmailError(isValidEmail(e.target.value) || e.target.value === "" ? "" : "Invalid email address")
                        }}
                        className={emailError ? "input-error" : ""}
                    ></input>
                        {emailError && (
                          <div className="speech-bubble">
                            Please Enter a valid email address.
                              <span className="speech-bubble-arrow"/>
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}