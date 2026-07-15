import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Law Enforcement | CashingTech",
  description: "Guidelines for law enforcement agencies requesting user data from CashingTech.",
};

export default function LawEnforcementPage() {
  return (
    <LegalPageLayout title="Law Enforcement Compliance">
      <p className="text-sm text-zinc-500">Last updated: January 1, 2026</p>

      <h2>Legal Requests</h2>
      <p>
        CashingTech complies with valid legal process requests from law enforcement and government agencies. We review each request individually to ensure it meets applicable legal standards.
      </p>

      <h2>Types of Requests We Honor</h2>
      <ul>
        <li>Valid subpoenas issued by a court of competent jurisdiction</li>
        <li>Search warrants supported by probable cause</li>
        <li>Court orders issued by a judge</li>
        <li>Emergency requests involving imminent harm (reviewed on a case-by-case basis)</li>
      </ul>

      <h2>Information We May Disclose</h2>
      <p>To the extent required by law, we may disclose:</p>
      <ul>
        <li>Basic subscriber information (name, email, account creation date)</li>
        <li>Transaction records and order history</li>
        <li>Device information (IMEI, serial numbers)</li>
        <li>IP addresses and access logs</li>
        <li>Shipping and payment information</li>
      </ul>

      <h2>Our Policy</h2>
      <ul>
        <li>We require all legal requests to be served at our registered agent address.</li>
        <li>We notify users of requests involving their data unless prohibited by law.</li>
        <li>We object to overly broad or vague requests.</li>
        <li>We seek to quash or narrow requests when appropriate.</li>
      </ul>

      <h2>Service of Process</h2>
      <p>
        Legal process should be served to our registered agent. For inquiries, law enforcement officials may contact us at legal@cashingtech.com.
      </p>

      <h2>Emergency Requests</h2>
      <p>
        In cases involving imminent danger of death or serious physical injury, we may voluntarily disclose information in good faith. Emergency requests should be directed to legal@cashingtech.com with appropriate documentation.
      </p>
    </LegalPageLayout>
  );
}
