import React, { useState, useEffect } from 'react';
import { FaBox } from 'react-icons/fa';
import productService from '../../services/product.service';

const ProductCount = () => {
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const count = await productService.getProductCount();
                setProductCount(count.total_products);
            } catch (error) {
                console.error('Error fetching product count:', error);
            }
        };
        fetchProductCount();
    }, []);

    return (
        <div className="card bg-base-100 shadow-md border border-base-300 h-full hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-base-content/60 font-medium">Sản phẩm</p>
                        <p className="text-4xl font-bold text-primary mt-2">{productCount}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <FaBox className="text-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCount;
