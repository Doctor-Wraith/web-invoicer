import ProductRow, {type ProductInformation } from "./productRow/ProductRow.tsx";
import React from "react";

type Mode = "product" | "service";

interface ProductListProps {
    mode?: Mode;
    products: ProductInformation[];
    setProducts: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    onSave: (products: ProductInformation[]) => void;
}

export default function ProductList({mode = "product" , products, setProducts, onSave}: ProductListProps) {

    const handleChange = (updated: ProductInformation) => {
        const next = products.map(p => p.id === updated.id ? updated : p);
        setProducts(next);
        onSave(next);
    }

    const handleDelete = (id: string) => {
        const next = products.filter(p => p.id !== id);
        setProducts(next);
        onSave(next);
    }

    return (
        <div className="product-list" style={{ minWidth: 0, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
            {products.map(product => (
                <ProductRow
                    key={product.id}
                    data={product}
                    mode={mode}
                    onChange={handleChange}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}