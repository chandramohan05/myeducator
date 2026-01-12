// components/Footer.jsx
"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "About Us", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Contact Us", href: "/contact" },
    ],
    resources: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  };

  const socialLinks = [
    { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
    { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
    { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
    { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  ];

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Top section */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Brand */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-3">
              <img
                src="/Azroute.jpeg"
                alt="Azroute Logo"
                className="h-12 w-12 object-contain rounded-md"
              />
              <div>
                <p className="font-semibold text-lg">Azroute Chess Institute</p>
                <p className="text-xs text-slate-500">
                  Learn, teach and grow with structured chess programs.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Online and offline coaching for students, schools and aspiring professionals.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide text-slate-700">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wide text-slate-700">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>




        {/* Bottom bar */}
        <div className="border-t border-slate-200 pt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            © {currentYear} Azroute Chess Institute. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
