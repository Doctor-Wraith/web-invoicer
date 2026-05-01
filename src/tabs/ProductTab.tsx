import "../styles/ProductTab.css";
import img_add from '../assets/add.svg'

export default function ProductTab() {
    return (
        <div className="tab product-tab">
            <div className="products-title">
                <h3>Products</h3>

                {/*  Add Product Button  */}
                <button className="add-product">
                    <img src={img_add} alt="Add Product" width="25px" height="25px"/>
                    <span>Add Product</span>
                </button>
            </div>
        </div>

    )
}