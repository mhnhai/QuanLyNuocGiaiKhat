import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import AccountForm from "./AccountForm";
import Modal from "react-modal";
import { Button, DeleteButton, EditButton } from "./Button";
import SearchBar from "./SearchBar";

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await AccountService.getAll();
            setAccounts(response.data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (window.confirm('Bạn có chắc muốn xóa khách hàng này?')) {
                await AccountService.delete(id);
                setAccounts(accounts.filter((account) => account._id !== id));
            }
        }catch (error) {
            console.error(error);
        }
    };

    const toggleModal = (account = null) => {
        setSelectedAccount(account);
        setModalIsOpen(!modalIsOpen);
    };

    const handleAccountSave = (savedAccount) => {
        setAccounts((prevAccounts) => {
            const existingAccountIndex = prevAccounts.findIndex(account => account._id === savedAccount._id);
            if (existingAccountIndex !== -1) {
                const updatedAccounts = [...prevAccounts];
                updatedAccounts[existingAccountIndex] = savedAccount;
                return updatedAccounts;
            } else {
                return [...prevAccounts, savedAccount];
            }
        });
        toggleModal();
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm) {
            const filteredProducts = accounts.filter(account =>
                account.fullname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setAccounts(filteredProducts);
        } else {
            fetchAccounts();
        }
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
            <h2 className="text-2xl font-bold mb-4">Account List</h2>
            {/*nếu bị lỗi chưa có create mà lại hiện update là do toggleModal không có toggleModal()*/}
            <Button onClick={() => toggleModal()}>Add Account</Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={toggleModal}
                style={modalStyles}
            >
                <div>
                    <AccountForm account={selectedAccount} onSave={handleAccountSave} />
                    <button onClick={toggleModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Close</button>
                </div>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-auto" style={{ maxHeight: '72vh' }}>
                    <table className="min-w-full bg-white ">
                        <thead className="sticky top-0 bg-gray-400">
                        <tr>
                            <th className="py-2 px-4 border">ID</th>
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Phone</th>
                            <th className="py-2 px-4 border">Role</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {accounts.map((account) => (
                            <tr key={account._id}>
                                <td className="py-2 px-4 border">{account._id}</td>
                                <td className="py-2 px-4 border">{account.username}</td>
                                <td className="py-2 px-4 border">{account.phone}</td>
                                <td className="py-2 px-4 border">{account.role_account}</td>
                                <td className="py-2 px-4 border">
                                    <button onClick={() => toggleModal(account)} className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Edit</button>
                                    <button onClick={() => handleDelete(account._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
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

export default AccountList;