import { ReactNode } from "react";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

const PublicLayout = ({ children }: PublicLayoutProps) => (
  <section className="flex min-h-dvh items-center justify-center px-4">
    {children}
  </section>
);

export default PublicLayout;
