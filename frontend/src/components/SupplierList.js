import React, { useState, useEffect } from "react";
import SupplierService from "../services/supplier.service";

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        SupplierService.getAll()
            .then((response) => {
                setSuppliers(response.data);
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
            await SupplierService.delete(id);
            setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Supplier List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier._id}>
                            <td>{supplier._id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact}</td>
                            <td>{supplier.address}</td>
                            <td>
                                <button onClick={() => handleDelete(supplier._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SupplierList;