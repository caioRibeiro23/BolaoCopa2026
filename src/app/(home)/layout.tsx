import NavBar from "@/src/components/NavBar/navbar";
import Footer from "@/src/components/Footer/footer";
import { requireUser } from "@/src/lib/supabase/auth-actions";
import { getUserData } from "@/src/lib/supabase/user-actions";
import OneSignalInit from "@/src/components/OneSignal/oneSignalInit";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
await requireUser();
const userData = (await getUserData() ?? undefined);
  return (
    <>
      {userData?.id && <OneSignalInit userId={userData.id} />}
      <NavBar userData={userData}/>
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}