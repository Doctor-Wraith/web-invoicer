import "../styles/ProductTab.css";
import IconButton from "../custom components/IconButton.tsx";

export default function ProductTab() {
    return (
        <div className="tab product-tab">
            <div className="products-title">
                <h3>Products</h3>

                <IconButton
                    label="Add"
                    variant="glass"
                    onClick={() => alert("Add Product")}
                />
            </div>
        </div>

    )
}