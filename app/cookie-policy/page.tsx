import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <p className="text-sm text-zinc-500">Last updated: January 1, 2026</p>

      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device by your web browser. They help websites function properly, improve user experience, and provide analytics to site owners.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies for the following purposes:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the website to function, including authentication and security.</li>
        <li><strong>Functional Cookies:</strong> Remember your preferences, language, and region settings.</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site (e.g., Google Analytics, Microsoft Clarity).</li>
        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track affiliate referrals (e.g., ShareASale).</li>
      </ul>

      <h2>3. Third-Party Cookies</h2>
      <p>
        We use services from Google Analytics, Microsoft Clarity, and ShareASale that may set their own cookies. These providers have their own privacy policies governing data use.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may affect website functionality.
      </p>

      <h2>5. Contact</h2>
      <p>
        For questions about our cookie policy, contact us at privacy@cashingtech.com.
      </p>
    </LegalPageLayout>
  );
}
