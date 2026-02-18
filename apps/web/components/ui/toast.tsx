import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

export function showToast(message: string, type: ToastType = "success") {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast(message);
      break;
  }
}

export { toast };
