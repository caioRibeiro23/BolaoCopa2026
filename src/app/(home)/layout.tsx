import NavBar from "@/src/components/NavBar/navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar/>
      <main>
        {children}
      </main>
    </>
  );
}