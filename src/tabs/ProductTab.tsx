import "../styles/ProductTab.css";
import IconButton from "../custom components/IconButton.tsx";
import ProductList from "../custom components/ProductList.tsx";
import {type ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import React from "react";
import {TrashIcon} from "../assets/icons.tsx";


interface ProductTabProps {
    products: ProductInformation[];
    setProducts: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_products: (products: ProductInformation[]) => void;
    confirm: (message: string) => Promise<unknown>;
}


export default function ProductTab({products, setProducts, save_products, confirm}: ProductTabProps) {


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

    const handleDeleteAll = async () => {
        const ok = await confirm("Are you sure you want to Delete All?");
        if (ok) {
            setProducts([]);
            save_products([])
        }
    }

    return (
        <div className="tab product-tab" style={{width:'100%'}}>
            <div className="products-title">
                <h3>Products</h3>

                <div style={{gap: "8px", display: "inline-flex"}}>
                    <IconButton
                        variant="danger_glass"
                        label="Delete All"
                        onClick={handleDeleteAll}
                        icon={TrashIcon}
                    />
                    <IconButton
                        label="Add"
                        variant="glass"
                        onClick={handleAdd}
                    />
                </div>
            </div>
            <hr/>
            <div className="products-list-wrapper-outer">
                <ProductList
                    products={products}
                    onSave={save_products}
                    setProducts={setProducts}
                />
            </div>

        </div>

    )
}