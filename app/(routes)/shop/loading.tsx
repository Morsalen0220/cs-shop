import Container from "@/components/ui/container";
import CollectionPageSkeleton from "@/components/ui/collection-page-skeleton";

const Loading = () => {
  return (
    <Container>
      <CollectionPageSkeleton
        gridClassName="gap-6 lg:grid-cols-[300px_minmax(0,1fr)]"
        heroClassName="h-[160px]"
        showHeader
        sidebarHeightClassName="h-[720px]"
        topOffsetClassName="mt-0"
      />
    </Container>
  );
};

export default Loading;
