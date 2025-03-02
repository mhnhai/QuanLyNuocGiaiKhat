import React, { useState, useEffect } from "react";
import ImportationService from "../services/importation.service";
import ImportationForm from "./ImportationForm";
import Modal from "react-modal";
import { Button, DeleteButton, EditButton } from "./Button";
import SupplierService from "../services/supplier.service";
import formatDateTime from "../utils/formatDateTime";
import DateFilter from "./DateFilter";

const ImportationList = () => {
    const [importations, setImportations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImportation, setSelectedImportation] = useState(null);
    const [supplierNames, setSupplierNames] = useState({});
    const [originalImportations, setOriginalImportations] = useState([]);

    useEffect(() => {
        ImportationService.getAll()
            .then((response) => {
                setImportations(response.data);
                setOriginalImportations(response.data)
                setLoading(false);
                fetchSupplierNames(response.data);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);


    const fetchSupplierNames = async (importations) => {
        const names = {};
        for (const importation of importations) {
            if (importation.id_supplier && !names[importation.id_supplier]) {
                try {
                    const response = await SupplierService.getById(importation.id_supplier);
                    names[importation.id_supplier] = response.data.name;
                } catch (error) {
                    console.error(`Error fetching customer with id ${importation.id_customer}:`, error);
                }
            }
        }
        setSupplierNames(names);
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Bạn có chắc muốn xóa đơn nhập này?')) {
                await ImportationService.delete(id);
                setImportations(importations.filter((importation) => importation._id !== id));
            }
        }catch (error) {
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

    const handleDateFilter = (date) => {
        if (date) {
            const filteredImportations = originalImportations.filter(importation =>
                importation.import_date.startsWith(date)
            );
            setImportations(filteredImportations);
        } else {
            setImportations(originalImportations);
        }
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
        <div className="container pt-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách đơn nhập hàng</h1>
            <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span>Lọc theo ngày:</span>
                    <DateFilter onFilter={handleDateFilter}/>
                </div>
                <Button onClick={() => toggleModal()} className="flex-initial">Tạo đơn nhập hàng</Button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <ImportationForm importation={selectedImportation} onSave={handleImportationSave} onClose={toggleModal} />
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{ maxHeight: '72vh' }}>
                    <div className="overflow-x-auto">
                        <table className="table bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border">Tên nhà cung cấp</th>
                                <th className="py-2 px-4 border">Import Date</th>
                                <th className="py-2 px-4 border">Total Price</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {importations.map((importation) => (
                                <tr key={importation._id}>
                                    <td className="py-2 px-4 border">{supplierNames[importation.id_supplier]}</td>
                                    <td className="py-2 px-4 border">{formatDateTime(importation.import_date)}</td>
                                    <td className="py-2 px-4 border">{importation.total_price}</td>
                                    <td className="py-2 px-4 border">
                                        <div className="flex justify-center">
                                            <div className="flex justify-center">
                                                <button onClick={() => toggleModal(importation)}
                                                        className="btn btn-sm btn-outline btn-info">Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
}

export default ImportationList;