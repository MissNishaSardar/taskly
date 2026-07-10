import { SignInForm } from "@/components/SignInForm";
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
  title: "Sign in",
  description: "Sign in to your Taskly account to continue.",
};

const SignInPage = () => (
  <section className="flex min-h-dvh items-center justify-center px-4">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Taskly account to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignInForm />
      </CardContent>

      <div className="text-muted-foreground border-t px-4 py-4 text-center text-sm">
        {"No account yet? "}
        <Link
          href="/register"
          className="text-foreground hover:text-primary font-medium underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </Card>
  </section>
);

export default SignInPage;
