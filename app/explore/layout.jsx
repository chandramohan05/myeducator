// app/explore/layout.jsx
import { Navbar } from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ExploreLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        {children}
      </main>

      <Footer />  {/* <-- NOW FOOTER WILL SHOW */}
    </>
  );
}
