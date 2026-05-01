import "../styles/ProductTab.css";
import IconButton from "../custom components/IconButton.tsx";
import ProductList from "../custom components/ProductList.tsx";
import {type ProductInformation} from "../custom components/productRow/ProductRow.tsx";

interface ProductTabProps {
    products: ProductInformation[];
    setProducts: React.Dispatch<React.SetStateAction<ProductInformation[]>>;
    save_products: (products: ProductInformation[]) => void;
}


export default function ProductTab({products, setProducts, save_products}: ProductTabProps) {


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