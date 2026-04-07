import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-[var(--navbar-height)] min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms of Service for VannaTamilNews</h1>
          <p className="text-sm text-slate-500 mt-3">Last updated: March 26, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <p>
            Welcome to VannaTamilNews (“we,” “our,” “us”). By accessing or using{' '}
            <span className="font-mono">https://vannatamilnews.com</span> (the “Site”), you agree to these Terms of Service (“Terms”). If you do
            not agree, do not use the Site.
          </p>

          <h2>1. Use of the Site</h2>
          <p>You may use the Site for lawful purposes only.</p>
          <p>You agree not to use the Site to:</p>
          <ul>
            <li>Violate any local or international law</li>
            <li>Post harmful, abusive, or illegal content</li>
            <li>Attempt unauthorized access to any part of the Site or systems</li>
          </ul>

          <h2>2. Content</h2>
          <p>
            The Site displays content from our official social media accounts, including Instagram, and news content we create. All content is
            for informational purposes only.
          </p>
          <p>We do not guarantee accuracy, completeness, or timeliness of any news or social media posts displayed.</p>

          <h2>3. Intellectual Property</h2>
          <p>
            All content on the Site, including text, images, and media, is owned by VannaTamilNews or used under proper licenses. You may not
            copy, reproduce, distribute, or create derivative works without written permission.
          </p>

          <h2>4. Third-Party Content</h2>
          <p>
            Some content comes from third-party social media (Instagram, Threads, etc.). We are not responsible for third-party content or any
            inaccuracies in their posts.
          </p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            The Site is provided “as is” without warranties of any kind. We do not guarantee uninterrupted access, error-free operation, or that
            the content is free of errors or viruses.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            VannaTamilNews will not be liable for any damages arising from use of the Site, including indirect, incidental, or consequential
            damages. This includes reliance on social media posts or news content displayed on the Site.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Changes will be posted on this page with an updated “Last updated” date. Continued use of the
            Site after changes indicates your acceptance.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Chennai, Tamil Nadu.
          </p>

          <h2>9. Contact</h2>
          <p>For questions about these Terms:</p>
          <ul>
            <li>
              Email: <a href="mailto:info@vannatamilnews.com">info@vannatamilnews.com</a>
            </li>
            <li>
              Website: <a href="https://vannatamilnews.com" target="_blank" rel="noreferrer">https://vannatamilnews.com</a>
            </li>
          </ul>
        </article>
      </div>
    </motion.main>
  );
}

