import "../styles/ProductTab.css";
import IconButton from "../custom components/IconButton.tsx";
import ProductList from "../custom components/ProductList.tsx";
import {type ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import {useState} from "react";

const STORAGE_KEY = "services";

const load_services = ():ProductInformation[] => {
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

export default function ServicesTab() {
    const [services, setServices] = useState<ProductInformation[]>(load_services);

    const handleAdd = () => {
        const added = [...services, {
            id: crypto.randomUUID(),
            name: "",
            modelNumber: "",
            amount: 0,
            cost: 0
        }];
        setServices(added);
        save_products(added);
    }


    return (
        <div className="tab product-tab">
            <div className="products-title">
                <h3>Services</h3>

                <IconButton
                    label="Add"
                    variant="glass"
                    onClick={handleAdd}
                />
            </div>



            <div className="products-list-wrapper">
                <ProductList
                    products={services}
                    setProducts={setServices}
                    mode={"service"}
                    onSave={save_products}
                />
            </div>
        </div>

    )
}