export const generatePatientId = () => {
  const prefix = 'P00122';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}`;
};
