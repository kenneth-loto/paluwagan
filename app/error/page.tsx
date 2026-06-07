import { AlertCircle, MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-4 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle className="text-xl tracking-tight">
            Authentication failed
          </CardTitle>
          <CardDescription className="text-base">
            Your session may have expired or the request was interrupted. Please
            try signing in again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "w-full",
            )}
          >
            <MoveLeftIcon />
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
