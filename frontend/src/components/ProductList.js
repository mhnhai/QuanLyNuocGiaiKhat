import React, { useState, useEffect } from "react";
import ProductService from "../services/product.service";
import ProductForm from "./ProductForm";
import Modal from "react-modal";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        ProductService.getAll()
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await ProductService.delete(id);
            setProducts(products.filter((product) => product._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const openModal = (product = null) => {
        setSelectedProduct(product);
        setModalIsOpen(!modalIsOpen);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProduct(null);
    };

    const handleProductSave = (savedProduct) => {
        setProducts((prevProducts) => {
            const existingProductIndex = prevProducts.findIndex(product => product._id === savedProduct._id);
            if (existingProductIndex !== -1) {
                // Update existing product
                const updatedProducts = [...prevProducts];
                updatedProducts[existingProductIndex] = savedProduct;
                return updatedProducts;
            } else {
                // Add new product
                return [...prevProducts, savedProduct];
            }
        });
        closeModal();
    };

    const modalStyles = {
        content: {
            width: '50%', // Adjust the width as needed
            height: '80%', // Adjust the height as needed
            margin: 'auto', // Center the modal
            padding: '20px', // Add padding if needed
        },
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <button onClick={() => openModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add Product</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={modalStyles}
            >
                <ProductForm product={selectedProduct} onSave={handleProductSave} />
                <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Close</button>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border">ID</th>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Category</th>
                        <th className="py-2 px-4 border">Giá nhập</th>
                        <th className="py-2 px-4 border">Giá bán</th>
                        <th className="py-2 px-4 border">Stock</th>
                        <th className="py-2 px-4 border">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td className="py-2 px-4 border">{product._id}</td>
                            <td className="py-2 px-4 border">{product.name}</td>
                            <td className="py-2 px-4 border">{product.category}</td>
                            <td className="py-2 px-4 border">{product.import_price}</td>
                            <td className="py-2 px-4 border">{product.selling_price}</td>
                            <td className="py-2 px-4 border">{product.stock}</td>
                            <td className="py-2 px-4 border">
                                <button onClick={() => openModal(product)}
                                        className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit
                                </button>
                                <button onClick={() => handleDelete(product._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete
                                </button>
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