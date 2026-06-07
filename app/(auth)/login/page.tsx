import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login";

export default function LoginPage() {
  return (
    <div className="w-full max-w-xs">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
