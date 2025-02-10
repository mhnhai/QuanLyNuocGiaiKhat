import React, { useState, useEffect } from "react";
import ImportationService from "../services/importation.service";
import ImportationForm from "./ImportationForm";
import Modal from "react-modal";

const ImportationList = () => {
    const [importations, setImportations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImportation, setSelectedImportation] = useState(null);

    useEffect(() => {
        ImportationService.getAll()
            .then((response) => {
                setImportations(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await ImportationService.delete(id);
            setImportations(importations.filter((importation) => importation._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModal = (importation = null) => {
        setSelectedImportation(importation);
        setModalIsOpen(!modalIsOpen);
    };

    const handleImportationSave = (savedImportation) => {
        setImportations((prevImportations) => {
            const existingImportationIndex = prevImportations.findIndex(importation => importation._id === savedImportation._id);
            if (existingImportationIndex !== -1) {
                const updatedImportations = [...prevImportations];
                updatedImportations[existingImportationIndex] = savedImportation;
                return updatedImportations;
            } else {
                return [...prevImportations, savedImportation];
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
            <h1 className="text-2xl font-bold mb-4">Importation List</h1>
            <button onClick={() => toggleModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add Importation</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <ImportationForm importation={selectedImportation} onSave={handleImportationSave} />
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
                            <th className="py-2 px-4 border">ID</th>
                            <th className="py-2 px-4 border">Supplier ID</th>
                            <th className="py-2 px-4 border">Staff ID</th>
                            <th className="py-2 px-4 border">Import Date</th>
                            <th className="py-2 px-4 border">Total Price</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {importations.map((importation) => (
                            <tr key={importation._id}>
                                <td className="py-2 px-4 border">{importation._id}</td>
                                <td className="py-2 px-4 border">{importation.id_supplier}</td>
                                <td className="py-2 px-4 border">{importation.id_staff}</td>
                                <td className="py-2 px-4 border">{importation.import_date}</td>
                                <td className="py-2 px-4 border">{importation.total_price}</td>
                                <td className="py-2 px-4 border">
                                    <button onClick={() => toggleModal(importation)} className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                                    <button onClick={() => handleDelete(importation._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
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

export default ImportationList;