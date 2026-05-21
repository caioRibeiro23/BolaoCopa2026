import NavBar from "@/src/components/NavBar/navbar";
import { requireUser } from "@/src/lib/supabase/auth-actions";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const user = await requireUser();
  return (
    <>
      <NavBar user={user}/>
      <main>
        {children}
      </main>
    </>
  );
}