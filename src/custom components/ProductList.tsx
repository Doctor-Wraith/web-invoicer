import ProductRow, {type ProductInformation } from "./productRow/ProductRow.tsx";
import React from "react";

type Mode = "product" | "service";

interface ProductListProps {
    mode?: Mode;
    products: ProductInformation[];
    setProducts: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
}

export default function ProductList({mode = "product" , products, setProducts}: ProductListProps) {

    const handleChange = (updated: ProductInformation) => {
        setProducts(prev => prev.map(p => p.id === updated.id ? updated: p));
    }

    const handelDelete = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }

    return (
        <div className="product-list" style={{ minWidth: 0, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
            {products.map(product => (
                <ProductRow
                    key={product.id}
                    data={product}
                    mode={mode}
                    onChange={handleChange}
                    onDelete={handelDelete}
                />
            ))}
        </div>
    )
}