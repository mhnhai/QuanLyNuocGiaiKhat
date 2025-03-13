import React, { useState, useEffect } from 'react';
import CustomerService from '../services/customer.service';
import CustomerForm from './CustomerForm';
import Modal from "react-modal";
import { Button, DeleteButton, EditButton } from "./Button";
import SearchBar from "./SearchBar";
import {FaEye} from "react-icons/fa";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [originalCustomers, setOriginalCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await CustomerService.getAll();
            setCustomers(response.data);
            setOriginalCustomers(response.data);
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
            height: '35%',
            margin: 'auto',
            padding: '20px',
        },
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setCustomers(originalCustomers);
            return;
        }
        const filteredProducts = originalCustomers.filter(customer =>
            customer.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCustomers(filteredProducts);
    };

    return (
        <div className="container pt-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách khách hàng</h1>
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                <Button onClick={() => toggleModal()} className="flex-initial">Thêm khách hàng</Button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <CustomerForm customer={selectedCustomer} onSave={handleCustomerSave} onClose={toggleModal}/>
                </div>
            </Modal>
            <div className="overflow-auto" style={{maxHeight: '72vh'}}>
                <div className="overflow-x-auto">
                    <table className="table bg-white">
                        <thead>
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
                                    <td className="py-2 px-4 border">{customer.name}</td>
                                    <td className="py-2 px-4 border">{customer.address}</td>
                                    <td className="py-2 px-4 border">{customer.phone}</td>
                                    <td className="py-2 px-4 border">
                                        <div className="flex justify-center">
                                            <button onClick={() => toggleModal(customer)} className="btn btn-sm btn-outline btn-info">
                                                <FaEye/>
                                                Xem chi tiết</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/*<table className="min-w-full bg-white">*/}
                {/*    <thead className="sticky top-0 bg-white">*/}
                {/*    <tr>*/}
                {/*        <th className="py-2 px-4 border">Họ tên</th>*/}
                {/*        <th className="py-2 px-4 border">Địa chỉ</th>*/}
                {/*        <th className="py-2 px-4 border">Số điện thoại</th>*/}
                {/*        <th className="py-2 px-4 border">Hành động</th>*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {customers.map((customer) => (*/}
                {/*        <tr key={customer._id}>*/}
                {/*            <td className="py-2 px-4 border">{customer.fullname}</td>*/}
                {/*            <td className="py-2 px-4 border">{customer.address}</td>*/}
                {/*            <td className="py-2 px-4 border">{customer.phone}</td>*/}
                {/*            <td className="py-2 px-4 border">*/}
                {/*                <div className="flex justify-center">*/}
                {/*                    <EditButton onClick={() => toggleModal(customer)} className="mr-2">Edit</EditButton>*/}
                {/*                    <DeleteButton onClick={() => handleDelete(customer._id)}*/}
                {/*                                  className="">Delete</DeleteButton>*/}
                {/*                </div>*/}
                {/*            </td>*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </tbody>*/}
                {/*</table>*/}
            </div>
        </div>
    );
};

export default CustomerList;