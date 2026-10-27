import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminUser } from "@/lib/admin/auth";

export const metadata = { title: "Inloggen" };

const safeNext = (v: unknown) => (typeof v === "string" && v.startsWith("/admin") && !v.startsWith("//") ? v : "/admin");

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getAdminUser()) redirect(next);
  return (
    <main className="grid min-h-dvh place-items-center bg-paper p-4">
      <div className="w-full max-w-[400px] rounded-[20px] border border-line bg-white p-7 shadow-[var(--shadow-form)] sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <Image src="/brand/mark.svg" alt="" width={36} height={36} />
          <div className="flex flex-col">
            <h1 className="text-[20px] font-bold [font-stretch:118%]">MMC Beheer</h1>
            <span className="t-mono text-graphite">mmctechniek.nl</span>
          </div>
        </div>
        <LoginForm next={next} initialError={sp.error ? "De inloglink is verlopen of al gebruikt. Vraag een nieuwe aan." : undefined} />
      </div>
    </main>
  );
}
