export const metadata = {
  title: "MMC Admin Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base">
      {children}
    </div>
  );
}
