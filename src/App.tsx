import './App.css'
import Tabs from "./tabs/Tabs.tsx"
import React, {useState} from "react";
import type {ProductInformation} from "./custom components/productRow/ProductRow.tsx";
import Preview from "./Preview/Preview.tsx";
import {type Customer} from "./tabs/CustomerTab.tsx";
import type {InvoiceDetails, InvoiceStore} from "./tabs/InvoiceTab.tsx";


function App() {

  //region Storage keys
  const STORAGE_KEY_SERVICES = "services";
  const STORAGE_KEY_PRODUCTS = "products";
  const STORAGE_KEY_ACTIVE_TAB = "activeTab";
  const STORAGE_KEY_CUSTOMER = "customer";
  const STORAGE_KEY_INVOICE_TAB = "invoiceTab";
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
      if (!stored) throw new Error("Invoice not found");
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        issueDate: new Date(parsed.issueDate),
        dueDate: new Date(parsed.dueDate),
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
        issueDate: invoice.issueDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
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
    invoiceNumber,  setInvoiceNumber:   handleInvoiceChange(setInvoiceNumber, "invoiceNumber"),
    paymentTerms,   setPaymentTerms:    handleInvoiceChange(setPaymentTerms,  "paymentTerms"),
    issueDate,       setIssueDate:      handleInvoiceChange(setIssueDate, "issueDate"),
    dueDate,         setDueDate:        handleInvoiceChange(setDueDate, "dueDate"),
    endMessage,      setEndMessage:     handleInvoiceChange(setEndMessage, "endMessage"),
    currency,        setCurrency:       handleInvoiceChange(setCurrency, "currency"),
    discount,        setDiscount:       handleInvoiceChange(setDiscount, "discount"),
    tax,             setTax:            handleInvoiceChange(setTax, "tax"),
    shipping,        setShipping:       handleInvoiceChange(setShipping, "shipping"),
  }



  //endregion
  //endregion

  //region Values
  const [services, setServices] = useState<ProductInformation[]>(load_services);
  const [products, setProducts] = useState<ProductInformation[]>(load_products);


  //endregion

  return (
    <>
      <div className="app">
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
          />

        </div>

        <div className="glass preview main-panel">
          <Preview
              currency={currency}
              services={services}
              products={products}
              customer={customer}
          />
        </div>
      </div>
    </>
  )
}

export default App
