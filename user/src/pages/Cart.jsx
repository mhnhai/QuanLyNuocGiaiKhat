import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/order.service';
import payment_formService from "../services/payment_form.service";
import ProductService from '../services/product.service';
import { FaRegTrashAlt, FaInfo, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const { user } = useAuth();
    const [payment_forms, setPayment_forms] = useState([]);
    const [stockErrors, setStockErrors] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id_customer: '',
        id_staff: '',
        order_date: new Date().toISOString(),
        shipping_date: null,
        form_payment: '',
        total_price: '',
        status: 'Chưa xác nhận',
        order_items: []
    });

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
        checkStockAvailability(cartItems);

        const fetchPaymentForms = async () => {
            try {
                const response = await payment_formService.getPaymentForms();
                setPayment_forms(response);
            } catch (error) {
                console.error('Error fetching payment forms:', error);
            }
        };

        fetchPaymentForms();

        setFormData(prevFormData => ({
            ...prevFormData,
            order_items: cartItems.map(item => ({
                id_product: item._id,
                quantity: item.quantity,
                selling_price: item.selling_price
            })),
            total_price: cartItems.reduce((total, item) => total + item.selling_price * item.quantity, 0)
        }));
    }, []);

    const checkStockAvailability = async (cartItems) => {
        const errors = [];
        for (const item of cartItems) {
            try {
                const response = await ProductService.getById(item._id);
                const product = response.data;
                if (product.stock < item.quantity) {
                    errors.push({
                        productId: item._id,
                        name: item.name,
                        requestedQuantity: item.quantity,
                        availableStock: product.stock
                    });
                }
            } catch (error) {
                console.error(`Error checking stock for product ${item._id}:`, error);
            }
        }
        setStockErrors(errors);
    };

    const removeFromCart = (id) => {
        const updatedCart = cart.filter(item => item._id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setFormData(prevFormData => ({
            ...prevFormData,
            order_items: updatedCart.map(item => ({
                id_product: item._id,
                quantity: item.quantity,
                selling_price: item.selling_price
            })),
            total_price: updatedCart.reduce((total, item) => total + item.selling_price * item.quantity, 0)
        }));
        // Update stock errors when removing items
        setStockErrors(prevErrors => prevErrors.filter(error => error.productId !== id));
    };

    const handleSubmitOrder = async () => {
        if (!formData.form_payment || !formData.total_price || formData.order_items.length === 0) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if(!user){
            alert('Vui lòng đăng nhập để đặt hàng');
            return;
        }
        formData.id_customer = user.id;

        // Check for stock errors before submitting
        if (stockErrors.length > 0) {
            const errorMessage = stockErrors.map(error => 
                `${error.name}: Yêu cầu ${error.requestedQuantity} sản phẩm, chỉ còn ${error.availableStock} trong kho`
            ).join('\n');
            alert(`Không thể đặt hàng do số lượng trong kho không đủ:\n${errorMessage}`);
            return;
        }

        try {
            await OrderService.create(formData);
            localStorage.removeItem('cart');
            alert('Đặt hàng thành công!');
            navigate('/');
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Đặt hàng thất bại');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-64 flex flex-col items-center justify-center">
                <div className="alert alert-info shadow-lg max-w-md">
                    <div>
                        <FaInfo className="w-4 h-4 mb-3" />
                        <span>Giỏ hàng của bạn đang trống</span>
                    </div>
                </div>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
                    Tiếp tục mua sắm
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto my-10 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Giỏ hàng của bạn</h2>
                <div className="text-sm breadcrumbs justify-center">
                    <ul>
                        <li>Trang chủ</li>
                        <li>Giỏ hàng</li>
                    </ul>
                </div>
            </div>

            {stockErrors.length > 0 && (
                <div className="alert alert-warning shadow-lg mb-6">
                    <FaExclamationTriangle className="w-6 h-6" />
                    <div>
                        <h3 className="font-bold">Cảnh báo về số lượng!</h3>
                        <div className="text-sm">
                            {stockErrors.map((error, index) => (
                                <p key={index}>
                                    {error.name}: Yêu cầu {error.requestedQuantity} sản phẩm, chỉ còn {error.availableStock}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item._id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="card-title text-primary">{item.name}</h3>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="text-sm">
                                                    <p className="opacity-75">Danh mục: {item.category}</p>
                                                    <p className="opacity-75">Dung tích: {item.volume}</p>
                                                </div>
                                                <div className="text-sm">
                                                    <p className="opacity-75">Xuất xứ: {item.origin}</p>
                                                    <p className="opacity-75">Số lượng: {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">{item.selling_price.toLocaleString()} VND</p>
                                            <button 
                                                className="btn btn-error btn-sm mt-2"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                <FaRegTrashAlt />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl sticky top-4">
                        <div className="card-body">
                            <h3 className="card-title">Tổng đơn hàng</h3>
                            <div className="divider my-2"></div>
                            
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Phương thức thanh toán</span>
                                </label>
                                <select 
                                    className="select select-bordered w-full" 
                                    value={formData.form_payment}
                                    onChange={(e) => setFormData({ ...formData, form_payment: e.target.value })}
                                    required
                                >
                                    <option value="">Chọn phương thức thanh toán</option>
                                    {Array.isArray(payment_forms) && payment_forms.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="divider my-2"></div>
                            
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Tổng tiền:</span>
                                <span className="text-primary">{formData.total_price.toLocaleString()} VND</span>
                            </div>

                            <button 
                                className="btn btn-primary btn-block mt-4" 
                                onClick={handleSubmitOrder}
                            >
                                Đặt hàng
                            </button>

                            <button 
                                className="btn btn-ghost btn-block mt-2"
                                onClick={() => navigate('/')}
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;