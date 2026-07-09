import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <UserProfile />
    </div>
  );
}
