import React from "react";
import PageHeader from "../components/PageHeader";
import ProductList from "../components/Product/ProductList";

const Products = () => (
    <div>
        <PageHeader title="Quản lý sản phẩm" subtitle="Thêm, sửa và theo dõi kho hàng" />
        <ProductList />
    </div>
);

export default Products;
