// app/dashboard/layout.jsx
import { Navbar } from "@/app/components/Navbar";
import Footer from "@/app/components/Footer"; // ✅ footer import

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
