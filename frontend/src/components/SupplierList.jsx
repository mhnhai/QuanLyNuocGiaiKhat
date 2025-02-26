import React, { useState, useEffect } from "react";
import SupplierService from "../services/supplier.service";
import SupplierForm from "./SupplierForm";
import Modal from "react-modal";
import {Button, DeleteButton, EditButton} from "./Button";
import SearchBar from "./SearchBar";

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [originalSuppliers, setOriginalSuppliers] = useState([]);

    useEffect(() => {
        SupplierService.getAll()
            .then((response) => {
                setSuppliers(response.data);
                setOriginalSuppliers(response.data)
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await SupplierService.delete(id);
            setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModal = (supplier = null) => {
        setSelectedSupplier(supplier);
        setModalIsOpen(!modalIsOpen);
    };

    const handleSupplierSave = (savedSupplier) => {
        setSuppliers((prevSuppliers) => {
            const existingSupplierIndex = prevSuppliers.findIndex(supplier => supplier._id === savedSupplier._id);
            if (existingSupplierIndex !== -1) {
                const updatedSuppliers = [...prevSuppliers];
                updatedSuppliers[existingSupplierIndex] = savedSupplier;
                return updatedSuppliers;
            } else {
                return [...prevSuppliers, savedSupplier];
            }
        });
        toggleModal();
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setSuppliers(originalSuppliers);
            return;
        }
        const filteredProducts = originalSuppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuppliers(filteredProducts);
    };

    const modalStyles = {
        content: {
            width: '50%', // Adjust the width as needed
            height: '80%', // Adjust the height as needed
            margin: 'auto', // Center the modal
            padding: '20px', // Add padding if needed
        },
    };
    return (
        <div className="container pt-4">
            <h1 className="text-2xl font-bold mb-4">Supplier List</h1>
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                <Button onClick={() => toggleModal()} className="flex-initial">Thêm nhà cung cấp</Button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <SupplierForm supplier={selectedSupplier} onSave={handleSupplierSave}/>
                    <button onClick={toggleModal}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Close
                    </button>
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{maxHeight: '72vh'}}>
                    <table className="min-w-full bg-white">
                        <thead className="sticky top-0 bg-white">
                        <tr>
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Phone</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier._id}>
                                <td className="py-2 px-4 border">{supplier.name}</td>
                                <td className="py-2 px-4 border">{supplier.phone}</td>
                                <td className="py-2 px-4 border flex justify-center">
                                    <DeleteButton onClick={() => toggleModal(supplier)}>Edit</DeleteButton>
                                    <EditButton onClick={() => handleDelete(supplier._id)}>Delete</EditButton>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SupplierList;