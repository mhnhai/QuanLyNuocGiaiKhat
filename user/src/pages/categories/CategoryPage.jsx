import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import ProductService from "../../services/product.service";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CategoryPage = ({ categoryName }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 12;

    useEffect(() => {
        fetchProducts();
    }, [categoryName]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getAll();
            // Lọc sản phẩm theo danh mục
            const categoryProducts = response.data.filter(product => 
                product.category.toLowerCase() === categoryName.toLowerCase()
            );
            setProducts(categoryProducts);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
                <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
                <div className="text-sm breadcrumbs justify-center">
                    <ul>
                        <li><Link to="/">Trang chủ</Link></li>
                        <li><Link to="/products">Sản phẩm</Link></li>
                        <li>{categoryName}</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="text-sm text-center text-base-content/70">
                            Hiển thị {products.length} sản phẩm
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="w-full">
                    {products.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="alert alert-info">
                                <span>Không có sản phẩm nào trong danh mục này.</span>
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

export default CategoryPage; 