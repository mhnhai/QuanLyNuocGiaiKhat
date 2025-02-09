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
    }

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
    }

    const modalStyles = {
        content: {
            width: '50%', // Adjust the width as needed
            height: '80%', // Adjust the height as needed
            margin: 'auto', // Center the modal
            padding: '20px', // Add padding if needed
        },
    };

    return(
        <div className="container mx-auto p-4">
            <button onClick={toggleModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4">Add Staff</button>
            <Modal isOpen={modalIsOpen} style={modalStyles} onRequestClose={toggleModal}>
                <div>
                    <StaffForm staff={selectedStaff} onSave={handleStaffSave} />
                    <button onClick={toggleModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-4">Close</button>
                </div>
            </Modal>
            <div className="overflow-auto" style={{height: '72vh'}}>
                <table className="min-w-full bg-white">
                    <thead className="sticky top-0 bg-white">
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Position</th>
                        <th className="py-2 px-4 border-b">Salary</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staffs.map((staff) => (
                        <tr key={staff._id}>
                            <td className="py-2 px-4 border-b">{staff._id}</td>
                            <td className="py-2 px-4 border-b">{staff.name}</td>
                            <td className="py-2 px-4 border-b">{staff.position}</td>
                            <td className="py-2 px-4 border-b">{staff.salary}</td>
                            <td className="py-2 px-4 border-b">
                                <button onClick={() => toggleModal(staff)}
                                        className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit
                                </button>
                                <button onClick={() => handleDelete(staff._id)}
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

export default StaffList;