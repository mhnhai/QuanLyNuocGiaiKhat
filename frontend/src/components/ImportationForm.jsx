import React, { useEffect, useState } from 'react';
import ImportationService from "../services/importation.service";
import ProductService from "../services/product.service";
import formatDateTime from "../utils/formatDateTime";

const ImportationForm = ({ importation, onSave }) => {
    // mai xử lí làm sao để lấy được import_date là date
    const [formData, setFormData] = useState(importation || {
        id_supplier: '',
        id_staff: '',
        import_date: new Date().toISOString(),
        total_price: '',
        import_items: [{id_product: '', quantity: '', import_price: ''}]
    });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (importation) {
            setFormData(importation);
        }
    }, [importation]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAll();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const calculateTotalPrice = (importItems) => {
        return importItems.reduce((total, item) => {
            return total + (item.import_price * item.quantity);
        }, 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = formData.import_items.map((product, i) => {
            if (i === index) {
                const updatedProduct = { ...product, [name]: value };
                if (name === 'id_product') {
                    const selectedProduct = products.find(p => p._id === value);
                    updatedProduct.import_price = selectedProduct ? selectedProduct.import_price : '';
                }
                return updatedProduct;
            }
            return product;
        });
        const totalPrice = calculateTotalPrice(updatedProducts);
        setFormData({
            ...formData,
            import_items: updatedProducts,
            total_price: totalPrice
        });
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            import_items: [...formData.import_items, {id_product: '', quantity: '', import_price: ''}]
        });
    };

    const removeProduct = (index) => {
        const updatedProducts = formData.import_items.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            import_items: updatedProducts
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedImportItems = formData.import_items.map(item => {
                const product = products.find(p => p._id === item.id_product);
                return {
                    ...item,
                    import_price: product ? product.import_price : item.import_price
                };
            });

            const updatedFormData = {
                ...formData,
                import_items: updatedImportItems
            };
            let response;
            if (importation) {
                response = await ImportationService.update(importation._id, updatedFormData);
            } else {
                response = await ImportationService.create(updatedFormData);
            }

            for (const item of updatedImportItems) {
                const product = products.find(p => p._id === item.id_product);
                if (product) {
                    const updatedProduct = {
                        ...product,
                        stock: product.stock + parseInt(item.quantity, 10)
                    };
                    await ProductService.update(product._id, updatedProduct);
                }
            }
            onSave(response.data);
        } catch (error) {
            console.error('Error saving importation:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Supplier ID:</label>
                    <input type="text" name="id_supplier" value={formData.id_supplier} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Staff ID:</label>
                    <input type="text" name="id_staff" value={formData.id_staff} onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Import Date:{formatDateTime(formData.import_date)}</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Price:</label>
                    <input type="number" step="0.01" name="total_price" value={formData.total_price} disabled
                           onChange={handleChange} required
                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Products:</label>
                {formData.import_items.map((product, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 mb-2">
                        <select name="id_product" value={product.id_product} onChange={(e) => handleProductChange(index, e)} required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select Product</option>
                            {products.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                        <input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} required
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        <input type="text" name="import_price" value={product.import_price} disabled
                               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        <button type="button" onClick={() => removeProduct(index)} className="mt-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addProduct} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add Product</button>
            </div>
            <button type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Importation
            </button>
        </form>
    );
};

export default ImportationForm;