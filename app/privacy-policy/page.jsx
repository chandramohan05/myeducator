// app/privacy-policy/page.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Privacy Policy – Azroute Chess Institute
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            

            {/* 1. Who we are */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                1. Who We Are
              </h2>
              <p className="text-gray-600">
                Azroute Chess Institute is a chess coaching and learning
                platform offering online and offline classes, courses,
                tournaments, and training programs. We are based in the United
                Kingdom and act as the data controller for personal information
                collected through our website and related services.
              </p>
            </section>

            {/* 2. Information we collect */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                2. Information We Collect
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  We collect and process the following types of personal
                  information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Student and parent/guardian names</li>
                  <li>Email addresses and contact numbers</li>
                  <li>
                    Basic profile details (age group, chess level, preferences)
                  </li>
                  <li>Course, batch, and tournament booking history</li>
                  <li>Payment and transaction information</li>
                  <li>
                    Learning progress data (attendance, performance,
                    assessments where applicable)
                  </li>
                  <li>
                    Messages and feedback shared with coaches or support team
                  </li>
                  <li>
                    Technical data such as IP address, browser type and device
                    information
                  </li>
                </ul>
              </div>
            </section>

            {/* 3. How we use your info */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  To register students and manage their chess courses or
                  coaching batches
                </li>
                <li>To process class, camp and tournament bookings</li>
                <li>
                  To track learning progress and provide feedback or reports
                </li>
                <li>
                  To communicate important updates about schedules, classes, or
                  platform changes
                </li>
                <li>
                  To personalise training based on level, performance and
                  interests
                </li>
                <li>
                  To improve our coaching programs, curriculum and platform
                </li>
                <li>To meet legal, regulatory and accounting obligations</li>
              </ul>
            </section>

            {/* 4. Legal basis */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                4. Legal Basis for Processing
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <span className="font-medium">Contract:</span> to deliver
                  classes, coaching and services you have registered for
                </li>
                <li>
                  <span className="font-medium">Legitimate Interests:</span> to
                  run, improve and secure our chess platform and operations
                </li>
                <li>
                  <span className="font-medium">Consent:</span> for optional
                  communications such as newsletters or promotions
                </li>
                <li>
                  <span className="font-medium">Legal Obligation:</span> to
                  comply with applicable UK laws and regulations
                </li>
              </ul>
            </section>

            {/* 5. Data retention */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                5. Data Retention
              </h2>
              <p className="text-gray-600">
                We retain your personal data only for as long as necessary to
                provide our services and meet legal or accounting requirements.
                Basic account and payment records may be kept for up to 6 years
                after account closure, in line with standard UK record-keeping
                practice. Learning and performance records may be kept for a
                reasonable period to support future training history, certificates
                or reference requests.
              </p>
            </section>

            {/* 6. Your rights */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                6. Your Rights
              </h2>
              <p className="text-gray-600">
                Under GDPR and UK data protection law, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Request access to your personal data</li>
                <li>Ask us to correct inaccurate or incomplete data</li>
                <li>Request deletion of your data (in certain circumstances)</li>
                <li>Request restriction of processing</li>
                <li>Request a copy of your data in portable format</li>
                <li>Object to certain types of processing</li>
              </ul>
            </section>

            {/* 7. Contact */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                7. Contact Us
              </h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy or how we
                handle your data, please contact us at:
                <br />
                Email: privacy@azroutechess.com
                <br />
                Website: azroutechess.com
                <br />
                <br />
                You also have the right to lodge a complaint with the UK
                Information Commissioner&apos;s Office (ICO) if you are unhappy
                with how we handle your data. Visit{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  ico.org.uk
                </a>{" "}
                for more information.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
