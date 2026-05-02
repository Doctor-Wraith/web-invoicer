import ProductRow, {type ProductInformation } from "./productRow/ProductRow.tsx";
import React from "react";
import TableHeader from "./TableHeader.tsx";
import "../styles/ProductTab.css";

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
        <>
            <TableHeader
                mode={mode}
            />

            <div className="products-list-wrapper">
                {products.map(p => (
                    <ProductRow
                        key={p.id}
                        data={p}
                        onDelete={handleDelete}
                        onChange={handleChange}
                        mode={mode}
                    />
                ))}
            </div>
        </>
    )
}