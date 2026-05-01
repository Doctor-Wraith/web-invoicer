import "../styles/ProductTab.css";
import IconButton from "../custom components/IconButton.tsx";
import ProductList from "../custom components/ProductList.tsx";
import {type ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import {useState} from "react";

export default function ProductTab() {
    const [products, setProducts] = useState<ProductInformation[]>([]);

    const handleAdd = () => {
        setProducts(prev => [...prev, {
            id: crypto.randomUUID(),
            name: "",
            modelNumber: "",
            amount: 0,
            cost: 0
        }]);
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

            <ProductList
                products={products}
                setProducts={setProducts}
                mode={"product"}
            />
        </div>

    )
}