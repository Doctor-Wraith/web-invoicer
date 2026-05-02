import "../styles/ProductTab.css";
import IconButton from "../custom components/IconButton.tsx";
import ProductList from "../custom components/ProductList.tsx";
import {type ProductInformation} from "../custom components/productRow/ProductRow.tsx";
import React from "react";
import {TrashIcon} from "../assets/icons.tsx";

interface ServicesTabProps {
    services: ProductInformation[];
    setServices: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_Services: (products: ProductInformation[]) => void;
    confirm: (message: string) => Promise<unknown>;
}

export default function ServicesTab({services, setServices, save_Services, confirm}: ServicesTabProps) {
    const handleAdd = () => {
        const added = [...services, {
            id: crypto.randomUUID(),
            name: "",
            modelNumber: "",
            amount: 0,
            cost: 0
        }];
        setServices(added);
        save_Services(added);
    }

    const handleDeleteAll = async () => {
        const ok = await confirm("Are you sure you want to Delete All?");
        if (ok) {
            setServices([]);
            save_Services([])
        }
    }

    return (
        <div className="tab product-tab" style={{width:'100%'}}>
            <div className="products-title">
                <h3>Services</h3>

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


            <div className="products-list-wrapper">
                <ProductList
                    products={services}
                    setProducts={setServices}
                    mode={"service"}
                    onSave={save_Services}
                />
            </div>
        </div>

    )
}