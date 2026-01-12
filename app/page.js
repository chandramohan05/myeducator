// app/page.js
export const dynamic = "force-dynamic";

import MainLayout from './components/MainLayout';
import Hero from './components/Hero';
import Whyis from './components/Whyis';
import HowItWorks from './components/HowItWorks';
import TeacherCTA from './components/TeacherCTA';
// import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import ChatButton from './components/ChatButton';   
import ImagePage from './images'; // Import the ImagePage component
import CoachProfile from "./coachProfile";
import CertificatesPage from './components/CertificatesPage';


export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <ImagePage />
      <HowItWorks />
      <Whyis />
      <CertificatesPage />
      <FAQ />
      <CTASection />
      <ChatButton />
    </MainLayout>
  );
}
