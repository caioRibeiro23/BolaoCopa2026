import NavBar from "@/src/components/Navbar/navbar";
import Footer from "@/src/components/Footer/footer";
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
      <Footer />
    </>
  );
}