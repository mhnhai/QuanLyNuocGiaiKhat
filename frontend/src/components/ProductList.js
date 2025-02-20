import React, { useState, useEffect } from "react";
import ProductService from "../services/product.service";
import ProductForm from "./ProductForm";
import Modal from "react-modal";
import { Button, DeleteButton, EditButton } from "./Button";
import SearchBar from "./SearchBar";
import SupplierFilter from "./SupplierFilter";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getAll();
            setProducts(response.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this product?')) {
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
        if (searchTerm) {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setProducts(filteredProducts);
        } else {
            fetchProducts();
        }
    };

    const handleFilter = (supplierId) => {
        if (supplierId) {
            const filteredProducts = products.filter(product => product.id_supplier === supplierId);
            setProducts(filteredProducts);
        } else {
            fetchProducts();
        }
    };

    const modalStyles = {
        content: {
            width: '50%',
            height: '80%',
            margin: 'auto',
            padding: '20px',
        },
    };

    return (
        <div className="container pt-4">
            <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                <SupplierFilter onFilter={handleFilter} />
                <Button onClick={() => toggleModal()} className="flex-initial">Thêm sản phẩm</Button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <ProductForm product={selectedProduct} onSave={handleProductSave} />
                <button onClick={toggleModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Đóng</button>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full bg-white mt-4">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border w-2/12">Tên sản phẩm</th>
                        <th className="py-2 px-4 border w-1/12">Loại</th>
                        <th className="py-2 px-4 border w-1/12">Giá nhập</th>
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
                            <td className="py-2 px-4 border">{product.import_price}</td>
                            <td className="py-2 px-4 border">{product.selling_price}</td>
                            <td className="py-2 px-4 border">{product.stock}</td>
                            <td className="py-2 px-4 border flex justify-center">
                                <EditButton onClick={() => toggleModal(product)} className="mr-2">Edit</EditButton>
                                <DeleteButton onClick={() => handleDelete(product._id)} className="">Delete</DeleteButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductList;