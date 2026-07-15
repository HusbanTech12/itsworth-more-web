import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | CashingTech",
  description: "Read CashingTech's privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-sm text-zinc-500">Last updated: January 1, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        CashingTech (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and payment information when you create an account, place an order, or contact us.</li>
        <li><strong>Device Information:</strong> Device specifications, IMEI numbers, serial numbers, and condition details for devices you sell.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and referral sources.</li>
        <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Communicate with you about your account and orders</li>
        <li>Improve our website and services</li>
        <li>Send marketing communications (with your consent)</li>
        <li>Comply with legal obligations</li>
        <li>Detect and prevent fraud</li>
      </ul>

      <h2>4. Information Sharing</h2>
      <p>
        We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, and shipping devices. These providers are contractually obligated to protect your information.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your personal information, including SSL encryption, secure data storage, and regular security audits.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Delete your data (subject to legal requirements)</li>
        <li>Opt out of marketing communications</li>
        <li>Export your data in a portable format</li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        For privacy-related inquiries, contact us at privacy@cashingtech.com.
      </p>
    </LegalPageLayout>
  );
}
