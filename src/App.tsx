import './App.css'
import Tabs from "./tabs/Tabs.tsx"
import React, {useEffect, useState} from "react";
import type {ProductInformation} from "./custom components/productRow/ProductRow.tsx";
import Preview from "./Preview/Preview.tsx";
import {type Customer} from "./tabs/CustomerTab.tsx";
import type {InvoiceDetails, InvoiceStore} from "./tabs/InvoiceTab.tsx";
import {useConfirm} from "./custom components/useConfirm.tsx";
import {useProductForm} from "./custom components/useProductForm.tsx";
import type {PaymentOptions} from "./tabs/PaymentTab.tsx";
import {usePaymentForm} from "./custom components/usePaymentForm.tsx";
import type {Company} from "./tabs/CompanyTab.tsx";


function App() {

  //region Storage keys
  const STORAGE_KEY_SERVICES = "services";
  const STORAGE_KEY_PRODUCTS = "products";
  const STORAGE_KEY_ACTIVE_TAB = "activeTab";
  const STORAGE_KEY_CUSTOMER = "customer";
  const STORAGE_KEY_INVOICE_TAB = "invoiceTab";
  const STORAGE_KEY_PAYMENTS = "payments";
  const STORAGE_KEY_COMPANY = "company";
  //endregion

  //region stored data interfaces

  //region local storage
  //region services
  const load_services = ():ProductInformation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SERVICES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return []
    }
  }

  const save_services = (products: ProductInformation[]) => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(products));
  }
  //endregion

  //region payment options
  const load_payments = ():PaymentOptions[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return []
    }
  }

  const save_payments = (payments: PaymentOptions[]) => {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  }
  //end region

  //region products
  const load_products = ():ProductInformation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return []
    }
  }

  const save_products = (products: ProductInformation[]) => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }
  //endregion
  //region tabs
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_TAB) || "Products";
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, tab);
  }
  //endregion

  //region Company
  const [company, setCompany] = useState<Company>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMPANY);
    return saved ? JSON.parse(saved) : {
      name: "",
      email: "",
      address: "",
      phone: "",
    };
  });

  const handleCompanyChange = (company: Company) => {
    setCompany(company);
    localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(company));
  }

  //region customer
  const [customer, setCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER)
    return saved ? JSON.parse(saved) : {
        name: "",
        id: "",
        address: "",
        zip: "",
        phone: "",
        email: "",
      }
    }
  )

  const handleCustomerChange = (customer: Customer) => {
    setCustomer(customer);
    localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customer));
  }
  //endregion
  //region invoice

  const load_invoice = () : InvoiceDetails => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_INVOICE_TAB);
      if (!stored) throw new Error();
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        issueDate: new Date(parsed.issueDate),
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      }
    } catch {
      return {
        invoiceNumber: "",
        paymentTerms: "",
        issueDate: new Date(),
        dueDate: new Date(),
        endMessage: "",
        currency: {code: "ZAR", name:"South Africa"},
        discount: {amount: 0, kind: "flat"},
        tax: {amount: 0, kind: "percent"},
        shipping: 0,
      };
    }
  }

  const save_invoice = (invoice: InvoiceDetails) => {
    localStorage.setItem(STORAGE_KEY_INVOICE_TAB,JSON.stringify({
        ...invoice,
        issueDate: invoice.issueDate ? invoice.issueDate.toString() : new Date().toISOString(),
        dueDate: invoice.dueDate?.toISOString(),
      }
    ));
  }
  const savedInvoice = load_invoice();
  const [invoiceNumber, setInvoiceNumber] = useState(savedInvoice.invoiceNumber);
  const [paymentTerms, setPaymentTerms] = useState(savedInvoice.paymentTerms);
  const [issueDate, setIssueDate] = useState(savedInvoice.issueDate);
  const [dueDate, setDueDate] = useState(savedInvoice.dueDate);
  const [endMessage, setEndMessage] = useState(savedInvoice.endMessage);
  const [currency, setCurrency] = useState(savedInvoice.currency);
  const [discount, setDiscount] = useState(savedInvoice.discount);
  const [tax, setTax] = useState(savedInvoice.tax);
  const [shipping, setShipping] = useState(savedInvoice.shipping);

  const handleInvoiceChange = <T, >(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof InvoiceDetails) =>
    (value: T) => {
      setter(value);
      save_invoice({
        invoiceNumber, paymentTerms, issueDate, dueDate, endMessage, currency, discount, tax, shipping, [key]: value
      })
  }

  const invoiceStore: InvoiceStore = {
    invoiceNumber,    setInvoiceNumber:   handleInvoiceChange(setInvoiceNumber, "invoiceNumber"),
    paymentTerms,     setPaymentTerms:    handleInvoiceChange(setPaymentTerms,  "paymentTerms"),
    issueDate,        setIssueDate:       handleInvoiceChange(setIssueDate,     "issueDate"),
    dueDate,          setDueDate:         handleInvoiceChange(setDueDate,       "dueDate"),
    endMessage,       setEndMessage:      handleInvoiceChange(setEndMessage,    "endMessage"),
    currency,         setCurrency:        handleInvoiceChange(setCurrency,      "currency"),
    discount,         setDiscount:        handleInvoiceChange(setDiscount,      "discount"),
    tax,              setTax:             handleInvoiceChange(setTax,           "tax"),
    shipping,         setShipping:        handleInvoiceChange(setShipping,      "shipping"),
  }

  //endregion
  //endregion

  //region Values
  const [services, setServices] = useState<ProductInformation[]>(load_services);
  const [products, setProducts] = useState<ProductInformation[]>(load_products);
  const [paymentsOptions, setPaymentsOptions] = useState<PaymentOptions[]>(load_payments);

  //endregion

  const {confirm, ConfirmDialog} = useConfirm();
  const { prompt, ProductFormDialog} = useProductForm();
  const {paymentPrompt, PaymentFormDialog} = usePaymentForm();

  // Styling for small screens
  const [isCompact, setIsCompact] = useState<boolean>(window.innerWidth < 1120);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1120);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  })

  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");


  return (
    <>
      <div className="app">
          <ConfirmDialog/>
          {ProductFormDialog}
          {PaymentFormDialog}
          {isCompact && (
              <div className="mobile-tabs">
                <button
                    className={mobileView === "editor" ? "active" : ""}
                    onClick={() => setMobileView("editor")}
                >
                  Editor
                </button>

                <button
                    className={mobileView === "preview" ? "active" : ""}
                    onClick={() => setMobileView("preview")}
                >
                  Preview
                </button>
              </div>
          )}

        <div className="panels">
          {(!isCompact || mobileView === "editor") && (
            <div className="glass user-input main-panel">
              <div className="title-card">
                <h2>Invoice Details</h2>
              </div>
              <Tabs
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  services={services}
                  setServices={setServices}
                  save_services={save_services}
                  products={products}
                  save_products={save_products}
                  setProducts={setProducts}
                  invoice_store={invoiceStore}
                  customer={customer}
                  setCustomer={handleCustomerChange}
                  confirm={confirm}
                  prompt={prompt}
                  paymentOptions={paymentsOptions}
                  setPaymentOptions={setPaymentsOptions}
                  savePaymentOptions={save_payments}
                  paymentPrompt={paymentPrompt}
                  company={company}
                  setCompany={handleCompanyChange}
              />

            </div>
        )
        }

          {(!isCompact || mobileView === "preview") && (
              <div className="glass preview main-panel">
                <Preview
                    currency={currency}
                    services={services}
                    products={products}
                    customer={customer}
                    invoiceDetails={savedInvoice}
                    paymentOptions={paymentsOptions}
                    company={company}
                />
              </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
