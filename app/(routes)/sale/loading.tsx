import Container from "@/components/ui/container";
import CollectionPageSkeleton from "@/components/ui/collection-page-skeleton";

const Loading = () => {
  return (
    <Container>
      <CollectionPageSkeleton
        heroClassName="h-[320px]"
        mobileTiles={7}
        sidebarHeightClassName="h-[700px]"
        topOffsetClassName="mt-5"
      />
    </Container>
  );
};

export default Loading;
