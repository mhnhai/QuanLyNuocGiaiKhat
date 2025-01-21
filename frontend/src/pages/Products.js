import React from "react";
import ProductForm from "../components/ProductForm";
const Products = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">Trang quản lý sản phẩm</h1>
            <p>Chào mừng bạn đến với hệ thống quản lý bán nước giải khát!</p>
            <ProductForm />
        </div>
    );
};

export default Products;

