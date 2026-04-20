import Link from "next/link";
import { X } from "lucide-react";

const CreateStorePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <div className="w-full max-w-3xl rounded-md border border-gray-800 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create Store</h1>
            <p className="mt-3 text-lg text-gray-400">
              Add a new store to manage products and categories
            </p>
          </div>
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-800"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-10">
          <label className="text-sm font-semibold" htmlFor="store-name">
            Name
          </label>
          <input
            id="store-name"
            className="mt-4 h-12 w-full rounded-md border border-gray-800 bg-gray-950 px-4 text-white outline-none"
            placeholder="Store name..."
          />
        </div>
        <div className="mt-9 flex justify-end gap-3">
          <Link href="/admin" className="rounded-md border border-gray-800 px-6 py-3 font-semibold">
            Cancel
          </Link>
          <Link href="/admin" className="rounded-md bg-white px-6 py-3 font-semibold text-gray-950">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateStorePage;
