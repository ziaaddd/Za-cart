import toast from "react-hot-toast";

const baseOptions = {
  duration: 2500,
  style: {
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
  },
};

export const showSuccess = (message: string) =>
  toast.success(message, {
    ...baseOptions,
    iconTheme: { primary: "#0dcaf0", secondary: "#fff" },
  });

export const showError = (message: string) => toast.error(message, baseOptions);

export const showInfo = (message: string) =>
  toast(message, { ...baseOptions, icon: "ℹ️" });
