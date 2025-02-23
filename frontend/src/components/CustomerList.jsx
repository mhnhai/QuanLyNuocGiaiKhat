import React, { useState, useEffect } from 'react';
import CustomerService from '../services/customer.service';
import CustomerForm from './CustomerForm';
import Modal from "react-modal";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await CustomerService.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await CustomerService.delete(id);
            setCustomers(customers.filter(customer => customer._id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const toggleModal = (customer = null) => {
        setSelectedCustomer(customer);
        setModalIsOpen(!modalIsOpen);
    };

    const handleCustomerSave = (savedCustomer) => {
        setCustomers((prevCustomers) => {
            const existingCustomerIndex = prevCustomers.findIndex(customer => customer._id === savedCustomer._id);
            if (existingCustomerIndex !== -1) {
                const updatedCustomers = [...prevCustomers];
                updatedCustomers[existingCustomerIndex] = savedCustomer;
                return updatedCustomers;
            } else {
                return [...prevCustomers, savedCustomer];
            }
        });
        toggleModal();
    };

        const modalStyles = {
            content: {
                width: '50%',
                height: '80%',
                margin: 'auto',
                padding: '20px',
            },
        };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>
            <button onClick={() => toggleModal()}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Thêm khách hàng
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <CustomerForm customer={selectedCustomer} onSave={handleCustomerSave}/>
                    <button onClick={toggleModal}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Close
                    </button>
                </div>
            </Modal>
                <div className="overflow-auto" style={{maxHeight: '72vh'}}>
                    <table className="min-w-full bg-white">
                        <thead className="sticky top-0 bg-white">
                        <tr>
                            <th className="py-2 px-4 border">Họ tên</th>
                            <th className="py-2 px-4 border">Địa chỉ</th>
                            <th className="py-2 px-4 border">Số điện thoại</th>
                            <th className="py-2 px-4 border">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customers.map((customer) => (
                            <tr key={customer._id}>
                                <td className="py-2 px-4 border">{customer.fullname}</td>
                                <td className="py-2 px-4 border">{customer.address}</td>
                                <td className="py-2 px-4 border">{customer.phone}</td>
                                <td className="py-2 px-4 border flex justify-center">
                                    <button onClick={() => toggleModal(customer)}
                                            className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit
                                    </button>
                                    <button onClick={() => handleDelete(customer._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}
;

export default CustomerList;