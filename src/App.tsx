import './App.css'
import Tabs from "./tabs/Tabs.tsx"
import {useState} from "react";
import type {ProductInformation} from "./custom components/productRow/ProductRow.tsx";
import Preview from "./Preview/Preview.tsx";
import {type Currency} from "./data/currencies.tsx";
import {type Customer} from "./tabs/CustomerTab.tsx";

function App() {

  // Storage keys
  const STORAGE_KEY_SERVICES = "services";
  const STORAGE_KEY_PRODUCTS = "products";
  const STORAGE_KEY_ACTIVE_TAB = "activeTab";
  const STORAGE_KEY_CUSTOMER = "customer";

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
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_TAB) || "Products";
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem(STORAGE_KEY_ACTIVE_TAB, tab);
  }

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


  // Values
  const [services, setServices] = useState<ProductInformation[]>(load_services);
  const [products, setProducts] = useState<ProductInformation[]>(load_products);
  const [currency, setCurrency] = useState<Currency>({code:"ZAR", name:"South Africa"});

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
            invoice_currency={currency}
            invoice_setCurrency={(c:Currency) => setCurrency(c)}
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
