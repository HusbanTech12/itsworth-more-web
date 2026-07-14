import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export default function AccessibilityPage() {
  return (
    <LegalPageLayout title="Accessibility">
      <p className="text-sm text-zinc-500">Last updated: January 1, 2026</p>

      <h2>Our Commitment</h2>
      <p>
        CashingTech is committed to ensuring digital accessibility for all users, including those with disabilities. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
      </p>

      <h2>Accessibility Features</h2>
      <ul>
        <li>Semantic HTML structure for screen reader compatibility</li>
        <li>Keyboard-navigable interface with visible focus indicators</li>
        <li>Sufficient color contrast ratios throughout the site</li>
        <li>Alt text for all informative images</li>
        <li>ARIA labels on interactive elements</li>
        <li>Responsive design that adapts to different screen sizes and zoom levels</li>
        <li>Form validation errors are clearly communicated</li>
        <li>Skip navigation links for keyboard users</li>
      </ul>

      <h2>Ongoing Efforts</h2>
      <p>
        Accessibility is an ongoing process. We regularly:
      </p>
      <ul>
        <li>Conduct accessibility audits using automated tools and manual testing</li>
        <li>Train our development team on accessible design practices</li>
        <li>Review and update our components for accessibility compliance</li>
        <li>Test with screen readers (NVDA, VoiceOver, JAWS)</li>
      </ul>

      <h2>Third-Party Content</h2>
      <p>
        Some portions of our site may include third-party content or services (e.g., Clerk for authentication, ShareASale for affiliate tracking). We cannot guarantee the accessibility of these third-party services.
      </p>

      <h2>Feedback</h2>
      <p>
        We welcome feedback on the accessibility of our platform. If you encounter any barriers, please contact us:
      </p>
      <ul>
        <li>Email: accessibility@cashingtech.com</li>
        <li>Phone: (555) 123-4567</li>
      </ul>
      <p>
        We aim to respond to accessibility feedback within 5 business days and resolve issues promptly.
      </p>
    </LegalPageLayout>
  );
}
