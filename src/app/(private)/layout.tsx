import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/shadcnui/separator";
import { UserNav } from "@/components/UserNav";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcnui/sidebar";
import { ReactNode } from "react";

type PrivateLayoutProps = Readonly<{
  children: ReactNode;
}>;

const PrivateLayout = ({ children }: PrivateLayoutProps) => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <div className="ml-auto px-4">
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
    </SidebarInset>
  </SidebarProvider>
);

export default PrivateLayout;
