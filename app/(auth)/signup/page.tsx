import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { SignupForm } from "@/features/auth/signup";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-lg">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </Card>
  );
}
