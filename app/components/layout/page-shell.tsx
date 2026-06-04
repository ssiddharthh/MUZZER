import { Footer } from "@/app/components/layout/footer";
import { Navbar } from "@/app/components/layout/navbar";

type PageShellProps = {
  children: React.ReactNode;
  showFooter?: boolean;
};

export function PageShell({ children, showFooter = true }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}
