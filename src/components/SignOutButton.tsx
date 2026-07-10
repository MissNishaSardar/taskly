"use client";

import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./shadcnui/button";

const SignOutButton = () => {
  const { replace } = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    replace("/");
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline">
      <LogOutIcon />
      Sign out
    </Button>
  );
};

export { SignOutButton };
