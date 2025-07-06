// src/utils/number.util.js
/**
 * Chuyển số → chuỗi định dạng tiền tệ VNĐ.
 * @param {number|string|null|undefined} value
 * @returns {string} vd: "1.234.567 ₫"
 */
export const currencyFormat = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // bỏ phần thập phân .00
    maximumFractionDigits: 0,
  });
};
