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
    <div className="flex flex-col gap-4 rounded-[28px] border border-black/10 bg-white/85 p-5 shadow-[0_18px_50px_rgba(17,17,17,0.04)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex text-sm font-semibold text-gray-500 transition hover:text-gray-900"
          >
            Back
          </Link>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">{description}</p>
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
};

export default PageHeading;
