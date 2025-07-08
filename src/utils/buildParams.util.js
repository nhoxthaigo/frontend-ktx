/**
 * Gộp các cặp key‑value rồi loại bỏ giá trị rỗng ('' | null | undefined)
 * @param {object} base    – các tham số cố định (page, limit,…)
 * @param {object} filters – bộ lọc từ component
 */
export const buildParams = (base = {}, filters = {}) => {
  const merged = { ...base, ...filters };
  return Object.fromEntries(
    Object.entries(merged).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined
    )
  );
};