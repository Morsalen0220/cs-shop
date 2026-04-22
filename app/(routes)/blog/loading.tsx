import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-[340px] rounded-[36px]" />
        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-32 rounded-[28px]" key={index} />
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_340px]">
          <div className="space-y-5">
            <Skeleton className="h-[420px] rounded-[30px]" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-[260px] rounded-[26px]" key={index} />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <Skeleton className="h-[360px] rounded-[28px]" />
            <Skeleton className="h-[320px] rounded-[30px]" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Loading;
