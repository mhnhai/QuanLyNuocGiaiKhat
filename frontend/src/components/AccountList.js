import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AccountService.getAll()
            .then((response) => {
                setAccounts(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await AccountService.delete(id);
            setAccounts(accounts.filter((account) => account._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Account List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((account) => (
                        <tr key={account._id}>
                            <td>{account._id}</td>
                            <td>{account.username}</td>
                            <td>{account.phone}</td>
                            <td>{account.role_account}</td>
                            <td>{account.address}</td>
                            <td>
                                <button onClick={() => handleDelete(account._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AccountList;