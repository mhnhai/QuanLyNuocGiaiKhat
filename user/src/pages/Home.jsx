import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import ProductService from "../services/product.service";
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getAll();
            // Get only the first 16 products
            setProducts(response.data.slice(0, 15));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div>
            <Banner />
            <div className="container mx-auto my-10 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Sản phẩm nổi bật</h1>
                    <Link to="/products" className="btn btn-primary">
                        Xem tất cả
                        <FaArrowRight className="ml-2" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
