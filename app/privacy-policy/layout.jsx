// app/events/layout.jsx
import { Navbar } from "@/app/components/Navbar";

export default function CoursesLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}