import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | CashingTech",
  description: "Read CashingTech's terms and conditions governing the use of our electronics trade-in marketplace.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms &amp; Conditions">
      <p className="text-sm text-zinc-500">Last updated: January 1, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using CashingTech (&quot;the Platform&quot;), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
      </p>

      <h2>2. Services Description</h2>
      <p>
        CashingTech provides a marketplace platform for users to sell used electronics. We facilitate the evaluation, pricing, and payment process for electronic devices.
      </p>

      <h2>3. User Obligations</h2>
      <ul>
        <li>You must be at least 18 years old to use our services.</li>
        <li>You represent that you own the devices you list for sale.</li>
        <li>You agree to provide accurate information about your devices.</li>
        <li>You are responsible for removing all personal data from devices before shipping.</li>
      </ul>

      <h2>4. Device Evaluation &amp; Pricing</h2>
      <p>
        All quotes are preliminary and based on the condition you select. Upon receipt, we inspect each device. If the condition matches, the original quote stands. If it differs, we provide a revised offer.
      </p>

      <h2>5. Payment</h2>
      <p>
        Payments are processed within 24-48 hours after inspection approval via your selected payment method (Check, PayPal, or Zelle). We reserve the right to delay payment for fraud prevention.
      </p>

      <h2>6. Shipping</h2>
      <p>
        We provide free prepaid shipping labels. You are responsible for securely packing your device. We are not liable for damage during transit if our packaging instructions are not followed.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        CashingTech shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific transaction.
      </p>

      <h2>8. Modifications</h2>
      <p>
        We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated effective date.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These terms are governed by the laws of the State of Delaware, without regard to conflict of law principles.
      </p>
    </LegalPageLayout>
  );
}
