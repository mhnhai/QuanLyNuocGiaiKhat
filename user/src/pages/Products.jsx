import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductService from "../services/product.service";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const [sortConfig, setSortConfig] = useState({ sort_by: "name", order: 1 });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 12;

    useEffect(() => {
        fetchProducts();
    }, [sortConfig]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getAll(sortConfig.sort_by, sortConfig.order);
            setProducts(response.data);
        } catch (e) {
            console.error(e);
        } finally {
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
    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => {
        setSearchParams(prev => {
            prev.set('page', pageNumber.toString());
            return prev;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Tất cả sản phẩm</h1>
                <div className="text-sm breadcrumbs justify-center">
                    <ul>
                        <li><Link to="/">Trang chủ</Link></li>
                        <li>Sản phẩm</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-base-content/70">
                                Hiển thị {products.length} sản phẩm
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Sắp xếp theo:</span>
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
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="w-full">
                    {products.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="alert alert-info">
                                <span>Không có sản phẩm nào.</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {currentProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="join">
                                        <button 
                                            className="join-item btn"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button 
                                            className="join-item btn"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;

