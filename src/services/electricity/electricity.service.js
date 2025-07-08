import { apiClient } from "../api";
import { API_ENDPOINTS } from "../api/endpoints";

class ElectricityService {
  // ===== ĐỔN GIÁ ĐIỆN =====

  /**
   * Lấy danh sách đơn giá điện
   */
  async getElectricityRates(params = {}) {
    const response = await apiClient.get(
      API_ENDPOINTS.ELECTRICITY.RATES.GET_ALL,
      { params }
    );
    return response.data; 
  }

  /**
   * Tạo đơn giá điện mới
   */
  async createElectricityRate(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.ELECTRICITY.RATES.CREATE,
      data
    );
    return response.data;
  }

  // ===== HÓA ĐƠN PHÒNG =====

  /**
   * Lấy danh sách hóa đơn tiền điện phòng
   */
  async getRoomElectricityBills(params = {}) {
    const response = await apiClient.get(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.GET_ALL,
      { params }
    );
    return response.data; // Sửa lại: chỉ trả về response.data
  }

  /**
   * Tạo hóa đơn tiền điện cho phòng
   */
  async createRoomElectricityBill(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.CREATE,
      data
    );
    return response.data;
  }

  /**
   * Lấy chi tiết hóa đơn tiền điện phòng
   */
  async getRoomElectricityBillById(id) {
    const response = await apiClient.get(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Cập nhật hóa đơn tiền điện phòng
   */
  async updateRoomElectricityBill(id, data) {
    const response = await apiClient.put(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Xóa hóa đơn tiền điện phòng
   */
  async deleteRoomElectricityBill(id) {
    const response = await apiClient.delete(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.DELETE(id)
    );
    return response.data;
  }

  /**
   * Tính tiền điện cho sinh viên trong phòng
   */
  async calculateStudentBills(id) {
    const response = await apiClient.post(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.CALCULATE(id)
    );
    return response.data;
  }

  /**
   * Hoàn thiện hóa đơn tiền điện
   */
  async finalizeElectricityBill(id) {
    const response = await apiClient.put(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.FINALIZE(id)
    );
    return response.data;
  }

  /**
   * Tạo hóa đơn hàng loạt
   */
  async bulkCreateRoomBills(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.BULK_CREATE,
      data
    );
    return response.data;
  }

  /**
   * Hoàn thiện hóa đơn hàng loạt
   */
  async bulkFinalizeElectricityBills(data) {
    const response = await apiClient.put(
      API_ENDPOINTS.ELECTRICITY.ROOM_BILLS.BULK_FINALIZE,
      data
    );
    return response.data;
  }

  // ===== HÓA ĐƠN SINH VIÊN =====

  /**
   * Lấy danh sách hóa đơn tiền điện sinh viên
   */
  async getStudentElectricityBills(params = {}) {
    const response = await apiClient.get(
      API_ENDPOINTS.ELECTRICITY.STUDENT_BILLS.GET_ALL,
      { params }
    );
    return response.data;
  }

  /**
   * Thanh toán hóa đơn tiền điện
   */
  async payElectricityBill(id, data) {
    const response = await apiClient.put(
      API_ENDPOINTS.ELECTRICITY.STUDENT_BILLS.PAYMENT(id),
      data
    );
    return response.data;
  }

  /**
   * Thanh toán hàng loạt
   */
  async bulkPayStudentBills(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.ELECTRICITY.STUDENT_BILLS.BULK_PAYMENT,
      data
    );
    return response.data;
  }

  // ===== THỐNG KÊ =====

  /**
   * Lấy thống kê tiền điện
   */
  async getElectricityStatistics() {
    const response = await apiClient.get(API_ENDPOINTS.ELECTRICITY.STATISTICS);
    return response.data;
  }

  /**
   * Lấy thống kê nâng cao
   */
  async getAdvancedStatistics(params = {}) {
    const response = await apiClient.get(
      API_ENDPOINTS.ELECTRICITY.ADVANCED_STATISTICS,
      { params }
    );
    return response.data;
  }

  // ===== EXPORT =====

  /**
   * Xuất Excel
   */
  async exportExcel(params = {}) {
    const response = await apiClient.get(
      API_ENDPOINTS.ELECTRICITY.EXPORT.EXCEL,
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  }

  /**
   * Xuất PDF
   */
  async exportPDF(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.ELECTRICITY.EXPORT.PDF, {
      params,
      responseType: "blob",
    });
    return response.data;
  }
}

export const electricityService = new ElectricityService();
