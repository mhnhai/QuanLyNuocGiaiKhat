import React, { useState } from 'react';
import ProductService from "../services/product.service";
const ProductForm = () => {
    const [formData, setFormData] = useState({
        id_supplier: '',
        name: '',
        import_price: '', // giá nhập
        selling_price: '', // giá bán
        category: '',
        stock: '',
        volume: '',
        origin: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ProductService.create(formData);
            // console.log('Product created:', response.data);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Tên sản phẩm:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
            </div>
            <div>
                <label>Tên nhà cung cấp:</label>
                <input type="text" name="id_supplier" value={formData.id_supplier} onChange={handleChange} required/> {/* chỉnh lại lấy tên nhà cung cấp theo id */}
            </div>
            <div>
                <label>Giá nhập:</label>
                <input type="text" name="import_price" value={formData.import_price} onChange={handleChange} required/>
            </div>
            <div>
                <label>Giá bán:</label>
                <input type="text" name="selling_price" value={formData.selling_price} onChange={handleChange}
                       required/>
            </div>
            <div>
                <label>Loại hàng:</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required/>
            </div>
            <div>
                <label>Số lượng:</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required/>
            </div>
            <div>
                <label>Thể tích:</label>
                <input type="text" name="volume" value={formData.volume} onChange={handleChange} required/>
            </div>
            <div>
                <label>Xuất xứ:</label>
                <input type="text" name="origin" value={formData.origin} onChange={handleChange} required/>
            </div>
            <div>
                <label>Mô tả:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required/>
            </div>
            <button type="submit" className="border-8 border-black">Create Product</button>
        </form>
    );
};

export default ProductForm;