const AdminLoading = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-3 border-b pb-5">
        <div className="h-9 w-64 animate-pulse rounded-xl bg-black/10" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-black/5" />
      </div>

      <div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-white shadow-sm" />

      <div className="overflow-hidden rounded-md border bg-white">
        <div className="grid grid-cols-4 gap-4 border-b px-4 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-4 animate-pulse rounded-full bg-black/8"
            />
          ))}
        </div>

        <div className="space-y-3 px-4 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-black/[0.04]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLoading;
