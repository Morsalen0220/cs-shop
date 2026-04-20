interface PageHeadingProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  action,
  description,
  title,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  );
};

export default PageHeading;
