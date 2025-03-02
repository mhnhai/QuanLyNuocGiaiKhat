// frontend/src/components/Authentication.jsx
import StaffService from "../services/staff.service";

const isStaff = async (username, password) => {
    try {
        const response = await StaffService.getAll();
        const staffs = response.data;
        return staffs.find(staff => staff.username === username && staff.password === password);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default isStaff;