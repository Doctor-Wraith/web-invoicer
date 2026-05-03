import type {Company} from "../tabs/CompanyTab.tsx";

export default function PreviewCompany({company}:{company: Company}) {
    return (
        <div style={{flex: 1}}>
            <h2>{company.name === "" ? "Your Company" : company.name}</h2>
            <label>{company.address === "" ? "123 Business Ave." : company.address}</label><br/>
            <label>{company.email === "" ? "fake@email.com" : company.email}</label><br/>
            <label>{company.phone === "" ? "(555) 123-4567" : company.phone}</label>
        </div>
    )
}