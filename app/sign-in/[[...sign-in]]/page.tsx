import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <SignIn
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              footer: "hidden",
              card: "shadow-lg rounded-xl",
            },
          }}
        />
        <p className="text-center text-sm text-ink-muted mt-4">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="font-medium text-orange hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
