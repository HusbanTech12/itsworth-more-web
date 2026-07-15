export default function SignUpLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <div className="h-8 w-32 bg-zinc-200 rounded animate-pulse mx-auto" />
          <div className="h-10 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-primary/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
