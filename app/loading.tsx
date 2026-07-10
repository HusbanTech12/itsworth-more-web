export default function RootLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
