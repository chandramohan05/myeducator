// app/dashboard/layout.jsx
import { Navbar } from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";  // <-- import footer

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {children}
      </main>

      <Footer />   {/* <-- footer added here */}
    </div>
  );
}
