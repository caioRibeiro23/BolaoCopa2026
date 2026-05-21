import NavBar from "@/src/components/NavBar/navbar";
import { requireUser } from "@/src/lib/supabase/auth-actions";
import { getUserData } from "@/src/lib/supabase/user-actions";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
await requireUser();
const userData = (await getUserData() ?? undefined);
  return (
    <>
      <NavBar userData={userData}/>
      <main>
        {children}
      </main>
    </>
  );
}