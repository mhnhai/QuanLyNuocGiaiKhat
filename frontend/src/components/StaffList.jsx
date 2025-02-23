import React, { useState, useEffect } from "react";
import StaffService from "../services/staff.service";
import StaffForm from "./StaffForm";
import Modal from "react-modal";

const StaffList = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    useEffect(() => {
        StaffService.getAll()
            .then((response) => {
                setStaffs(response.data);
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
            <h1 className="text-2xl font-bold mb-4">Staff List</h1>
            <button onClick={() => toggleModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Add Staff</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <StaffForm staff={selectedStaff} onSave={handleStaffSave} />
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
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">position</th>
                            <th className="py-2 px-4 border">salary</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff._id}>
                                <td className="py-2 px-4 border">{staff._id}</td>
                                <td className="py-2 px-4 border">{staff.name}</td>
                                <td className="py-2 px-4 border">{staff.position}</td>
                                <td className="py-2 px-4 border">{staff.salary}</td>
                                <td className="py-2 px-4 border">
                                    <button onClick={() => toggleModal(staff)} className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                                    <button onClick={() => handleDelete(staff._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
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