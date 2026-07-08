import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-zinc prose-sm sm:prose-base max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
