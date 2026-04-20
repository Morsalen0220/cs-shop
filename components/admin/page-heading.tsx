import Link from "next/link";

interface PageHeadingProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  backHref?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  action,
  backHref,
  description,
  title,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            Back
          </Link>
        ) : null}
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
