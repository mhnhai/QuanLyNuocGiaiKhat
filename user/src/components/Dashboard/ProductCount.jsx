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
        <div className="card bg-base-100 w-96 shadow-lg p-4">
            <h2 className="text-xl font-bold">Số lượng sản phẩm</h2>
            <p className="text-2xl">{productCount}</p>
        </div>

    );
};

export default ProductCount;