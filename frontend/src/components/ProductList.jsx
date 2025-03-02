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
    const [originalProducts, setOriginalProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getAll();
            setProducts(response.data);
            setOriginalProducts(response.data); // Lưu danh sách gốc để không bị mất khi tìm kiếm
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
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

    const handleFilter = (supplierId) => {
        if (!supplierId) {
            setProducts(originalProducts); //
            // Nếu bỏ chọn filter, hiển thị lại danh sách gốc
            return;
        }

        const filteredProducts = originalProducts.filter(product => product.id_supplier === supplierId);
        setProducts(filteredProducts);
    };


    const modalStyles = {
        content: {
            width: '50%',
            height: '45%',
            margin: 'auto',
            padding: '20px',
        },
    };

    return (

        <div className="container pt-4">
            <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                    <label>Lọc theo nhà phân phối:</label>
                    <SupplierFilter onFilter={handleFilter}/>
                <Button onClick={() => toggleModal()} className="flex-initial">Thêm sản phẩm</Button>
            </div>
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
                <div className="overflow-auto" style={{maxHeight: '72vh'}}>
                    <table className="table bg-white">
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
                                <td className="py-2 px-4 border">
                                    <div className="flex justify-center">
                                        <button onClick={() => toggleModal(product)}
                                                className="btn btn-sm btn-outline btn-info">Xem chi tiết
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