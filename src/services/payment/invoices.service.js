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
    .post(API_ENDPOINTS.INVOICE.CHECKOUT(allocationId))   // dùng hằng ENDPOINT cho nhất quán
    .then((data) => {                                     // data chính là response.data
      if (data.checkoutUrl && data.qrCode && data.orderCode) {
        return data;          // <- trả thẳng object chứa checkoutUrl, qrCode, ...
      }
      throw new Error("Thiếu dữ liệu từ server.");
    }),
};
