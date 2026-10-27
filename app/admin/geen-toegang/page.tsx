import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { getAdminUser } from "@/lib/admin/auth";

export const metadata = { title: "Geen toegang" };

export default async function NoAccessPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return (
    <main className="grid min-h-dvh place-items-center bg-paper p-4">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-[20px] border border-line bg-white p-8">
        <h1 className="text-[22px] font-bold [font-stretch:118%]">Geen toegang tot dit onderdeel</h1>
        <p className="text-slate">
          {user.active
            ? "Uw rol geeft geen toegang tot deze pagina. Vraag de eigenaar om uw rechten aan te passen."
            : "Uw account is nog niet geactiveerd. De eigenaar van MMC Techniek moet u eerst toegang geven."}
        </p>
        <p className="t-mono text-graphite">{user.email}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {user.active && (
            <Link href="/admin" className="btn btn-secondary btn-sm btn-plain">
              Naar het dashboard
            </Link>
          )}
          <SignOutButton className="btn btn-secondary btn-sm btn-plain" />
        </div>
      </div>
    </main>
  );
}
