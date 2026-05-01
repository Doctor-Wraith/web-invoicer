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

export default function ProductTab() {
    const [products, setProducts] = useState<ProductInformation[]>(load_services);

    const handleAdd = () => {
        const added = [...products, {
            id: crypto.randomUUID(),
            name: "",
            modelNumber: "",
            amount: 0,
            cost: 0
        }];
        setProducts(added);
        save_products(added);
    }


    return (
        <div className="tab product-tab">
            <div className="products-title">
                <h3>Products</h3>

                <IconButton
                    label="Add"
                    variant="glass"
                    onClick={handleAdd}
                />
            </div>
            <div className="products-list-wrapper">
                <ProductList
                    products={products}
                    setProducts={setProducts}
                    mode={"service"}
                    onSave={save_products}
                />
            </div>
        </div>

    )
}