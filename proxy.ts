import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/sell/box/checkout",
  "/account(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|xml|ttf|woff2?|ico|svg|png|jpg|jpeg|gif|webp)).*)",
    "/(api|trpc)(.*)",
  ],
};
