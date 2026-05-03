import {useState} from "react";

export interface Company {
    name: string;
    address: string;
    email: string;
    phone: string;
}

interface CompanyTabsProps {
    company: Company;
    setCompany: (company: Company) => void;
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


export default function CompanyTab({company, setCompany}: CompanyTabsProps) {
    const update = (field: keyof Company, value: string) => {
        setCompany?.({...company, [field]: value});
    }

    const [emailError, setEmailError] = useState("");
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const [phoneError, setPhoneError] = useState("");
    const isValidPhone = (phone: string) => /^(\+\d{1,3} )?\(\d{3}\) \d{3}-\d{4}$/.test(phone) && (phone.length <= 19);


    return (
        <div className="tab company-tab" style={{width:'100%'}}>
            <div className="company-header">
                <h3>Company</h3>
            </div>
            <hr/>

            <div style={{width:'100%', height:'100%', gap:'10px', display:'flex', flexDirection:'column'}}>
                <label htmlFor="company-name">Company Name</label>
                <input
                    id="company-name"
                    placeholder="Company Name"
                    type="text"
                    value={company.name}
                    onChange={(e) => update("name", e.target.value)}
                />
                <label htmlFor="company-address">Address</label>
                <input
                    id="company-address"
                    placeholder="123 Address ave"
                    type="text"
                    value={company.address}
                    onChange={(e) => update("address", e.target.value)}
                />
                <label htmlFor="company-email">Email</label>
                <div className="customer-input-wrapper">
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="fake@email.com"
                        value={company.email}
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
                <label htmlFor="company-phone">Phone</label>
                <div className="customer-input-wrapper">
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        placeholder="+1 (XXX) XXX-XXXX"
                        value={company.phone}
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

        </div>
    )
}