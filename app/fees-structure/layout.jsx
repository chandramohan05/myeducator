import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FeesStructureLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
