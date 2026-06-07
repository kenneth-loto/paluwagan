import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Link href="/login" className={buttonVariants({ variant: "outline" })}>
        Login
      </Link>
      <ModeToggle />
    </section>
  );
}
