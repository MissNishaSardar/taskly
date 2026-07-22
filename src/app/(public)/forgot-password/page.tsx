import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
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
  title: "Forgot password",
  description: "Reset your Taskly password.",
};

const ForgotPasswordPage = () => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Forgot password?</CardTitle>
      <CardDescription>
        Enter your email and we'll send you a reset link.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <ForgotPasswordForm />
    </CardContent>

    <div className="text-muted-foreground border-t px-4 py-4 text-center text-sm">
      <Link
        href="/"
        className="text-foreground hover:text-primary font-medium underline underline-offset-4">
        Back to sign in
      </Link>
    </div>
  </Card>
);

export default ForgotPasswordPage;
