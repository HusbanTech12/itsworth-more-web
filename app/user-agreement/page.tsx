import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "User Agreement | CashingTech",
  description: "The user agreement governing the relationship between CashingTech and its users.",
};

export default function UserAgreementPage() {
  return (
    <LegalPageLayout title="User Agreement">
      <p className="text-sm text-zinc-500">Last updated: January 1, 2026</p>

      <h2>1. Account Registration</h2>
      <p>
        When you create an account on CashingTech, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
      </p>

      <h2>2. Prohibited Conduct</h2>
      <ul>
        <li>You may not use the platform for any illegal purpose.</li>
        <li>You may not attempt to manipulate pricing or the evaluation process.</li>
        <li>You may not submit fraudulent or counterfeit devices.</li>
        <li>You may not interfere with the proper functioning of the platform.</li>
      </ul>

      <h2>3. Device Ownership &amp; Title</h2>
      <p>
        By submitting a device for sale, you represent that you are the lawful owner and that the device is free from all liens, claims, and encumbrances. Title transfers to CashingTech upon our acceptance of the device.
      </p>

      <h2>4. Data Privacy</h2>
      <p>
        You agree to our collection and use of your data as described in our Privacy Policy. You are responsible for erasing all personal data from devices before shipping.
      </p>

      <h2>5. Communications</h2>
      <p>
        By creating an account, you consent to receive electronic communications from us regarding your account, orders, and service updates.
      </p>

      <h2>6. Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate this agreement. You may close your account at any time by contacting support.
      </p>

      <h2>7. Dispute Resolution</h2>
      <p>
        Any disputes arising from this agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
      </p>
    </LegalPageLayout>
  );
}
