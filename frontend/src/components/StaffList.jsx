import React, { useState, useEffect } from "react";
import StaffService from "../services/staff.service";
import StaffForm from "./StaffForm";
import Modal from "react-modal";
import {Button, DeleteButton, EditButton} from "./Button";
import SearchBar from "./SearchBar";
import {FaEye} from "react-icons/fa";

const StaffList = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [originalStaffs, setOriginalStaffs] = useState([]);

    useEffect(() => {
        StaffService.getAll()
            .then((response) => {
                setStaffs(response.data);
                setOriginalStaffs(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await StaffService.delete(id);
            setStaffs(staffs.filter((staff) => staff._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModal = (staff = null) => {
        setSelectedStaff(staff);
        setModalIsOpen(!modalIsOpen);
    };

    const handleStaffSave = (savedStaff) => {
        setStaffs((prevStaffs) => {
            const existingStaffIndex = prevStaffs.findIndex(staff => staff._id === savedStaff._id);
            if (existingStaffIndex !== -1) {
                const updatedStaffs = [...prevStaffs];
                updatedStaffs[existingStaffIndex] = savedStaff;
                return updatedStaffs;
            } else {
                return [...prevStaffs, savedStaff];
            }
        });
        toggleModal();
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setStaffs(originalStaffs);
            return;
        }
        const filteredProducts = originalStaffs.filter(staff =>
            staff.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setStaffs(filteredProducts);
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
            <h1 className="text-2xl font-bold mb-4">Staff List</h1>
            <div className="flex justify-between items-center mb-4">
                <SearchBar onSearch={handleSearch} className="flex-1"/>
                <Button onClick={() => toggleModal()} className="flex-initial">Thêm nhân viên</Button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <StaffForm staff={selectedStaff} onSave={handleStaffSave} onClose={toggleModal}/>
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{ maxHeight: '69vh' }}>
                    <table className="table bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border">Tên</th>
                            <th className="py-2 px-4 border">Vị trí công việc</th>
                            <th className="py-2 px-4 border">Lương</th>
                            <th className="py-2 px-4 border">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff._id}>
                                <td className="py-2 px-4 border">{staff.name}</td>
                                <td className="py-2 px-4 border">{staff.position}</td>
                                <td className="py-2 px-4 border">{staff.salary}</td>
                                <td className="py-2 px-4 border">
                                    <div className="flex justify-center">
                                        <button onClick={() => toggleModal(staff)}
                                                className="btn btn-sm btn-outline btn-info">
                                            <FaEye/>
                                            Xem chi tiết
                                        </button>

                                    </div>
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

export default StaffList;