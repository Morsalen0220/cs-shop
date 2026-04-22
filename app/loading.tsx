import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="h-[220px] rounded-[36px]" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-[180px] rounded-[32px]" />
            <Skeleton className="h-[180px] rounded-[32px]" />
            <Skeleton className="h-[180px] rounded-[32px]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="aspect-[0.9] rounded-[28px]" />
            <Skeleton className="aspect-[0.9] rounded-[28px]" />
            <Skeleton className="aspect-[0.9] rounded-[28px]" />
            <Skeleton className="aspect-[0.9] rounded-[28px]" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Loading;
