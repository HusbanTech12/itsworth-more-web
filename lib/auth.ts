import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "husbantech08@gmail.com";

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user && user.role === "admin") return;
  } catch {
    // DB query failed, fall through to Clerk check
  }

  // Fallback: check if the Clerk user's email matches the admin
  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase();
    if (email === ADMIN_EMAIL) return;
  } catch {
    // Clerk fallback also failed
  }

  throw new Error("Unauthorized");
}
