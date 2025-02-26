import React, { useState, useEffect } from "react";
import StaffService from "../services/staff.service";
import StaffForm from "./StaffForm";
import Modal from "react-modal";
import {Button, DeleteButton, EditButton} from "./Button";
import searchBar from "./SearchBar";
import SearchBar from "./SearchBar";

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
                    <StaffForm staff={selectedStaff} onSave={handleStaffSave}/>
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
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">position</th>
                            <th className="py-2 px-4 border">salary</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff._id}>
                                <td className="py-2 px-4 border">{staff.name}</td>
                                <td className="py-2 px-4 border">{staff.position}</td>
                                <td className="py-2 px-4 border">{staff.salary}</td>
                                <td className="py-2 px-4 border">
                                    <EditButton onClick={() => toggleModal(staff)}>Edit</EditButton>
                                    <DeleteButton onClick={() => handleDelete(staff._id)}>Delete</DeleteButton>
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