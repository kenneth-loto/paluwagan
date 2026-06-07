import { Card } from "@/components/ui/card";
import { SignupForm } from "@/features/auth/signup";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-lg">
      <SignupForm />
    </Card>
  );
}
