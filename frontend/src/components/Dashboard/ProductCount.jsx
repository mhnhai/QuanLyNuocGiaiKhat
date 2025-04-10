import React, { useState, useEffect } from 'react';
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
        <div className="card bg-base-100 shadow-lg p-6 h-full">
            <div className="flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold text-gray-800">Số lượng sản phẩm</h2>
                <p className="text-4xl font-bold text-primary">{productCount}</p>
            </div>
        </div>
    );
};

export default ProductCount;