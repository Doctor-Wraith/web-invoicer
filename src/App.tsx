import './App.css'
import Tabs from "./tabs/Tabs.tsx"
import {useState} from "react";
import type {ProductInformation} from "./custom components/productRow/ProductRow.tsx";
import Preview from "./Preview/Preview.tsx";
import {type Currency} from "./data/currencies.tsx";

function App() {

  const STORAGE_KEY_SERVICES = "services";

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

  const STORAGE_KEY = "products";

  const load_products = ():ProductInformation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return []
    }
  }

  const save_products = (products: ProductInformation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  // Values
  const [activeTab, setActiveTab] = useState("Products")
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
            setActiveTab={setActiveTab}
            services={services}
            setServices={setServices}
            save_services={save_services}
            products={products}
            save_products={save_products}
            setProducts={setProducts}
            invoice_currency={currency}
            invoice_setCurrency={(c:Currency) => setCurrency(c)}
          />

        </div>

        <div className="glass preview main-panel">
          <Preview
              currency={currency}
              services={services}
              products={products}/>
        </div>
      </div>
    </>
  )
}

export default App
