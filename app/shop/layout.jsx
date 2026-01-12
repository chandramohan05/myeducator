import  Navbar  from "@/app/components/Navbar";
import Footer from "@/app/components/Footer"; // or { Footer } if named export

export default function ShopLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
