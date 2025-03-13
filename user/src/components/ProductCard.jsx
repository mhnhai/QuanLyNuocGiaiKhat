import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import ProductService from '../services/product.service';
import uploadService from '../services/upload.service';

const ProductCard = ({ product }) => {
    const [currentStock, setCurrentStock] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        checkCurrentStock();
    }, [product._id]);

    const checkCurrentStock = async () => {
        try {
            const response = await ProductService.getById(product._id);
            setCurrentStock(response.data.stock);
        } catch (error) {
            console.error('Error fetching stock:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item._id === product._id);
        const totalRequestedQuantity = (existingProduct?.quantity || 0) + 1;

        if (totalRequestedQuantity > currentStock) {
            alert(`Không đủ số lượng trong kho! Chỉ còn ${currentStock} sản phẩm.`);
            return;
        }

        if (existingProduct) {
            existingProduct.quantity = totalRequestedQuantity;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    };

    return (
        <div className="card w-72 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <Link to={`/product/${product._id}`} className="relative group">
                <figure className="px-4 pt-4">
                    <div className="relative overflow-hidden rounded-xl">
                        <img 
                            src={uploadService.getImageUrl(product.image)} 
                            alt={product.name}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                            <button className="btn btn-circle btn-primary btn-sm">
                                <FaEye className="text-lg" />
                            </button>
                        </div>
                    </div>
                </figure>

                <div className="card-body p-4">
                    <div className="badge badge-secondary mb-2">{product.category}</div>
                    <h2 className="card-title line-clamp-2 h-14 mb-2" title={product.name}>
                        {product.name}
                    </h2>
                    
                    <div className="divider my-2"></div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-base-content/70">Giá bán</span>
                            <span className="text-primary font-bold text-lg">
                                {product.selling_price.toLocaleString()} VND
                            </span>
                        </div>
                        {!loading && (
                            <div className={`badge ${currentStock > 0 ? 'badge-success' : 'badge-error'} gap-2`}>
                                {currentStock > 0 ? `Còn ${currentStock}` : 'Hết hàng'}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
            {currentStock > 0 && (
                <div className="card-actions p-4 pt-0">
                    <button 
                        className="btn btn-primary btn-block"
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart();
                        }}
                    >
                        <FaShoppingCart className="mr-2" />
                        Thêm vào giỏ
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;