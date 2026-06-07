import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { AUTH_ERROR_MESSAGES } from "@/lib/constants";

export function useAuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;
    toast.error(
      AUTH_ERROR_MESSAGES[error] ?? "An error occurred. Please try again.",
    );
  }, [error]);
}
