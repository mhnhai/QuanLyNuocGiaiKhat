import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from '../services/product.service';
import { FaShoppingCart, FaMinus, FaPlus, FaHome } from 'react-icons/fa';
import uploadService from '../services/upload.service';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getById(id);
            setProduct(response.data);
        } catch (e) {
            setError(e.message);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (value) => {
        const newQuantity = Math.max(1, Math.min(99, value));
        setQuantity(newQuantity);
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item._id === product._id);

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error shadow-lg max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-warning shadow-lg max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Không tìm thấy sản phẩm</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm breadcrumbs mb-8">
                <ul>
                    <li><Link to="/" className="flex items-center gap-2"><FaHome className="inline" /> Trang chủ</Link></li>
                    <li><Link to="/products">Sản phẩm</Link></li>
                    <li>{product.name}</li>
                </ul>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Product Image */}
                
                <div className="card bg-base-100 shadow-xl h-fit sticky top-20">
                    <figure className="p-4">
                        <img 
                            src={uploadService.getImageUrl(product.image)} 
                            alt={product.name} 
                            className="rounded-xl w-full object-cover"
                        />
                    </figure>
                </div>

                {/* Product Info */}
                <div className="card bg-base-100 shadow-xl ">
                    <div className="card-body">
                        <h1 className="card-title text-3xl mb-4">{product.name}</h1>
                        
                        <div className="stats shadow mb-6">
                            <div className="stat">
                                <div className="stat-title">Giá bán</div>
                                <div className="stat-value text-primary">{product.selling_price.toLocaleString()} VND</div>
                                <div className="stat-desc">Đã bao gồm VAT</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Danh mục</p>
                                <p>{product.category}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Dung tích</p>
                                <p>{product.volume}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Xuất xứ</p>
                                <p>{product.origin}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Tình trạng</p>
                                <p className={`${product.stock > 0 ? 'text-success' : 'text-error'}`}>{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</p>
                            </div>
                        </div>

                        <div className="bg-base-200 p-4 rounded-lg mb-6">
                            <p className="font-semibold mb-2">Mô tả sản phẩm</p>
                            <p className="text-sm opacity-90">{product.description}</p>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="join">
                                <button 
                                    className="btn join-item"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <FaMinus />
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))} 
                                    min="1"
                                    max="99"
                                    className="input input-bordered join-item w-20 text-center"
                                />
                                <button 
                                    className="btn join-item"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 99}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>

                        <button 
                            className={`btn btn-primary btn-block ${product.stock <= 0 ? 'btn-disabled' : ''} ${addedToCart ? 'btn-success' : ''}`}
                            onClick={addToCart}
                        >
                            <FaShoppingCart className="mr-2" />
                            {addedToCart ? 'Đã thêm vào giỏ hàng!' : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;