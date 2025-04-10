import React, { useState, useEffect } from "react";
import ProductService from "../../services/product.service";
import ProductForm from "./ProductForm";
import Modal from "react-modal";
import SearchBar from "../SearchBar";
import SupplierFilter from "../SupplierFilter";
import { FaEye, FaTrash } from "react-icons/fa";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ sort_by: "name", order: 1 });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchProducts();
    }, [sortConfig]);

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getAll(sortConfig.sort_by, sortConfig.order);
            setProducts(response.data);
            setOriginalProducts(response.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        const lastUnderscoreIndex = value.lastIndexOf('_');
        const sort_by = value.substring(0, lastUnderscoreIndex);
        const order = parseInt(value.substring(lastUnderscoreIndex + 1));
        setSortConfig({ sort_by, order });
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                await ProductService.delete(id);
                setProducts(products.filter((product) => product._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModal = (product = null) => {
        setSelectedProduct(product);
        setModalIsOpen(!modalIsOpen);
    };

    const handleProductSave = (savedProduct) => {
        setProducts((prevProducts) => {
            const existingProductIndex = prevProducts.findIndex(product => product._id === savedProduct._id);
            if (existingProductIndex !== -1) {
                const updatedProducts = [...prevProducts];
                updatedProducts[existingProductIndex] = savedProduct;
                return updatedProducts;
            } else {
                return [...prevProducts, savedProduct];
            }
        });
        toggleModal();
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setProducts(originalProducts); // Nếu search rỗng, hiển thị lại danh sách gốc
            return;
        }

        const filteredProducts = originalProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filteredProducts);
    };

    const handleFilter = async (supplierId) => {
        if (!supplierId) {
            setProducts(originalProducts); 
            return;
        }
        const filteredProducts = await ProductService.getProductBySupplier(supplierId);
        setProducts(filteredProducts);
    };


    const modalStyles = {
        content: {
            width: '50%',
            height: '82%',
            margin: 'auto',
            padding: '20px',
        },
    };

    return (
        <div className="container pt-4">
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                <div className="flex items-center space-x-2 bg-base-100 p-3 rounded-lg shadow-lg">
                    <span>Lọc theo nhà cung cấp:</span>
                    <SupplierFilter onFilter={handleFilter}/>
                </div>
                <div className="flex items-center space-x-2 bg-base-100 p-4 rounded-lg shadow-lg">
                    <span>Sắp xếp theo:</span>
                    <select 
                        value={`${sortConfig.sort_by}_${sortConfig.order}`}
                        onChange={handleSortChange}
                        className="select select-primary select-bordered select-sm w-44"
                    >
                        <option value="name_1">Tên A-Z</option>
                        <option value="name_-1">Tên Z-A</option>
                        <option value="selling_price_1">Giá tăng dần</option>
                        <option value="selling_price_-1">Giá giảm dần</option>
                        <option value="stock_1">Tồn kho tăng dần</option>
                        <option value="stock_-1">Tồn kho giảm dần</option>
                    </select>
                </div>
                <button disabled={user.role === "staff"} onClick={() => toggleModal()} className="btn btn-neutral flex-initial">Thêm sản phẩm</button>
            </div>
            <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <ProductForm product={selectedProduct} onSave={handleProductSave} onClose={toggleModal} />
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{maxHeight: '69vh'}}>
                    <table className="table bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border w-2/12">Tên sản phẩm</th>
                            <th className="py-2 px-4 border w-1/12">Loại</th>
                            <th className="py-2 px-4 border w-1/12">Giá bán</th>
                            <th className="py-2 px-4 border w-1/12">Tồn kho</th>
                            <th className="py-2 px-4 border w-1/6">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="py-2 px-4 border">{product.name}</td>
                                <td className="py-2 px-4 border">{product.category}</td>
                                <td className="py-2 px-4 border">{product.selling_price}</td>
                                <td className="py-2 px-4 border">{product.stock}</td>
                                <td className="py-2 px-4 border">
                                    <div className="flex justify-center gap-2">
                                        <button disabled={user.role === "staff"} onClick={() => toggleModal(product)}
                                                className="btn btn-sm btn-outline btn-info">
                                            <FaEye/>
                                            Xem chi tiết
                                        </button>
                                        <button disabled={user.role === "staff"} onClick={() => handleDelete(product._id)}
                                                className="btn btn-sm btn-outline btn-error">
                                            <FaTrash/>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            )}
        </div>
    );
}

export default ProductList;