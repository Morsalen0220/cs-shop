import Container from "@/components/ui/container";
import CollectionPageSkeleton from "@/components/ui/collection-page-skeleton";

const Loading = () => {
  return (
    <Container>
      <CollectionPageSkeleton heroClassName="h-[300px]" />
    </Container>
  );
};

export default Loading;
