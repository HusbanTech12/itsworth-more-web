import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <SignUp
          signInUrl="/sign-in"
          appearance={{
            elements: {
              footer: "hidden",
              card: "shadow-lg rounded-xl",
            },
          }}
        />
        <p className="text-center text-sm text-ink-muted mt-4">
          Already have an account?{" "}
          <a href="/sign-in" className="font-medium text-orange hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
