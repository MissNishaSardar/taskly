import { SignUpForm } from "@/components/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Taskly account to get started.",
};

const SignUpPage = () => (
  <section className="flex min-h-dvh items-center justify-center px-4">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Enter your details to get started.</CardDescription>
      </CardHeader>

      <CardContent>
        <SignUpForm />
      </CardContent>

      <div className="text-muted-foreground border-t px-4 py-4 text-center text-sm">
        {"Already have an account? "}
        <Link
          href="/"
          className="text-foreground hover:text-primary font-medium underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </Card>
  </section>
);

export default SignUpPage;
