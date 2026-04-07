import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy for VannaTamilNews</h1>
          <p className="text-sm text-slate-500 mt-3">Last updated: March 26, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <p>
            VannaTamilNews (“we,” “our,” “us”) operates <span className="font-mono">https://vannatamilnews.com</span> (the “Site”). This
            Privacy Policy explains how we collect, use, and share information when displaying social media content, including Instagram
            posts, for our news content.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Public Social Media Content:</strong> We automatically display publicly available posts from our official Instagram and
              other social media accounts.
            </li>
            <li>
              <strong>Website Analytics:</strong> Non-identifiable data such as IP addresses, browser type, and pages visited may be collected
              to improve the website.
            </li>
          </ul>
          <p>We do not collect personal information from social media users or visitors beyond publicly available data.</p>

          <h2>2. How We Use Information</h2>
          <ul>
            <li>To display social media content from our official accounts.</li>
            <li>To monitor and improve website performance.</li>
            <li>To comply with Instagram and other social media platform policies.</li>
          </ul>

          <h2>3. Sharing Information</h2>
          <p>
            We do not sell, rent, or share visitor information with third parties. Public social media content is displayed in accordance with
            platform guidelines.
          </p>

          <h2>4. Cookies &amp; Tracking</h2>
          <p>Our website may use cookies or analytics tools for performance tracking. No personal visitor data is shared with third parties.</p>

          <h2>5. Instagram API Use</h2>
          <p>
            We use the Instagram Basic Display API to fetch posts from our official Instagram account(s). We do not access private messages or
            personal user data.
          </p>
          <p>All use of Instagram data complies with Instagram Platform Policies.</p>

          <h2>6. Your Rights</h2>
          <p>You may contact us to request removal of content you posted on our official social media pages from our Site.</p>

          <h2>7. Contact Us</h2>
          <p>For questions about this Privacy Policy:</p>
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

