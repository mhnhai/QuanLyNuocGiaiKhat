// frontend/src/components/Authentication.jsx
import CustomerService from "../services/customer.service";

const isCustomer = async (username, password) => {
    try {
        const response = await CustomerService.getAll();
        const customers = response.data;
        return customers.find(customer => customer.username === username && customer.password === password);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default isCustomer;
