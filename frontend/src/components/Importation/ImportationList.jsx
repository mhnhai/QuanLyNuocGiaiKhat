import React, { useState, useEffect } from "react";
import ImportationService from "../../services/importation.service";
import ImportationForm from "./ImportationForm";
import Modal from "react-modal";
import SupplierService from "../../services/supplier.service";
import formatDateTime from "../../utils/formatDateTime";
import DateFilter from "../DateFilter";
import {FaEye, FaTrash} from "react-icons/fa";

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
            height: '60%',
            margin: 'auto',
            padding: '20px',
        },
    };

    return (
        <div className="container pt-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex shadow-lg items-center space-x-2 bg-base-100 p-3 rounded-lg">
                    <span>Lọc theo ngày:</span>
                    <DateFilter onFilter={handleDateFilter}/>
                </div>
                <button onClick={() => toggleModal()} className="btn btn-neutral flex-initial">Tạo đơn nhập hàng</button>
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
            <h1 className="text-2xl font-bold mb-4">Danh sách đơn nhập hàng</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{ maxHeight: '69vh' }}>
                    <div className="overflow-x-auto">
                        <table className="table bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border">Tên nhà cung cấp</th>
                                <th className="py-2 px-4 border">Ngày nhập</th>
                                <th className="py-2 px-4 border">Tổng tiền</th>
                                <th className="py-2 px-4 border">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {importations.map((importation) => (
                                <tr key={importation._id}>
                                    <td className="py-2 px-4 border">{supplierNames[importation.id_supplier]}</td>
                                    <td className="py-2 px-4 border">{formatDateTime(importation.import_date)}</td>
                                    <td className="py-2 px-4 border">{importation.total_price.toLocaleString()}</td>
                                    <td className="py-2 px-4 border">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => toggleModal(importation)}
                                                    className="btn btn-sm btn-outline btn-info">
                                                <FaEye/>
                                                Xem chi tiết
                                            </button>
                                            <button onClick={() => handleDelete(importation._id)}
                                                    className="btn btn-sm btn-outline btn-error">
                                                <FaTrash/>
                                                Xóa
                                            </button>
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