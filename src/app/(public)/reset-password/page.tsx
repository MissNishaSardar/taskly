import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Taskly account.",
};

const ResetPasswordPage = () => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Set new password</CardTitle>
      <CardDescription>Enter your new password below.</CardDescription>
    </CardHeader>

    <CardContent>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
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

export default ResetPasswordPage;
