// frontend-ktx/src/services/payment/payment.service.js
import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const paymentService = {

    getActiveAllocation: async () => {
        const res = await apiClient.get(API_ENDPOINTS.ACTIVE_ALLOCATION);
        return res.data;               // { id_allocation }
    },
    /**
     * Lấy thông tin thanh toán cho một phân bổ phòng
     * (dùng để render RoomPaymentDetails trước khi thanh toán)
     */
    getDetails: async (allocationId) => {
        const res = await apiClient.get(
            API_ENDPOINTS.PAYMENT.GET_DETAILS(allocationId)
        );
        return res.data.data; // Trả về trực tiếp object { allocation, ... }
    },

    /**
     * Tạo phiên thanh toán PayOS ➜ trả về { checkoutUrl }
     */
    createCheckout: async (allocationId) => {
        const res = await apiClient.post(
            API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT(allocationId)
        );
        return res.data;               // { data: { checkoutUrl } }
    },
};
