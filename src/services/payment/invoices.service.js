import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

export const invoiceService = {
  // getAll: async (page) => {
  //   return await apiClient.get(`API_ENDPOINTS.INVOICE.GET_ALL?page=${page}`);
  // }, 
  getAll: async () => {
    return await apiClient.get(API_ENDPOINTS.INVOICE.GET_ALL);
  },
  getMy: () =>
  apiClient.get(API_ENDPOINTS.INVOICE.GET_MY, {
    headers: { 'Cache-Control': 'no-cache' },
  }),
  getOne: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.INVOICE.GET_ONE(id));
    // backend trả về { data: { invoice } }
    return response.data.invoice; // trả về đúng object invoice
  },
  checkout: (allocationId) =>
    apiClient
      .post(`/invoices/${allocationId}/checkout`)
      .then((res) => {
        // THÊM DÒNG LOG NÀY ĐỂ KIỂM TRA ĐỐI TƯỢNG 'res' ĐẦY ĐỦ
        console.log("invoiceService: Full API response object (res):", res);
        
        // Đã sửa: 'res' chính là dữ liệu cần thiết, không cần res.data
        if (res) { // Kiểm tra xem res (đối tượng dữ liệu) có tồn tại không
          console.log("invoiceService: Returning data directly:", res);
          return res; // Trả về res trực tiếp
        } else {
          console.error("invoiceService: Response data is undefined/null", res);
          // Ném lỗi để bắt ở handleOnlinePayment nếu res không tồn tại
          throw new Error("Dữ liệu phản hồi từ server không hợp lệ.");
        }
      }),
};
