import React, { useState, useEffect } from "react";
import SupplierService from "../services/supplier.service";
import SupplierForm from "./SupplierForm";
import Modal from "react-modal";

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        SupplierService.getAll()
            .then((response) => {
                setSuppliers(response.data);
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

    const modalStyles = {
        content: {
            width: '50%', // Adjust the width as needed
            height: '80%', // Adjust the height as needed
            margin: 'auto', // Center the modal
            padding: '20px', // Add padding if needed
        },
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Supplier List</h1>
            <button onClick={() => toggleModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add Supplier</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <SupplierForm supplier={selectedSupplier} onSave={handleSupplierSave} />
                    <button onClick={toggleModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Close</button>
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{ maxHeight: '72vh' }}>
                    <table className="min-w-full bg-white">
                        <thead className="sticky top-0 bg-white">
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier._id}>
                                <td className="py-2 px-4 border-b">{supplier._id}</td>
                                <td className="py-2 px-4 border-b">{supplier.username}</td>
                                <td className="py-2 px-4 border-b">{supplier.phone}</td>
                                <td className="py-2 px-4 border-b">{supplier.role_supplier}</td>
                                <td className="py-2 px-4 border-b">
                                    <button onClick={() => toggleModal(supplier)} className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                                    <button onClick={() => handleDelete(supplier._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
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