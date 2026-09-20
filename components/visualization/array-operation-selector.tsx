"use client";

import type { ArrayOperation } from "@/types/algorithm";

interface ArrayOperationSelectorProps {
  operation: ArrayOperation;
  onChange: (operation: ArrayOperation) => void;
}

const operations: {
  id: ArrayOperation;
  label: string;
}[] = [
  {
    id: "traverse",
    label: "Traverse",
  },
  {
    id: "search",
    label: "Search",
  },
  {
    id: "insert",
    label: "Insert",
  },
  {
    id: "delete",
    label: "Delete",
  },
  {
    id: "update",
    label: "Update",
  },
  {
    id: "reverse",
    label: "Reverse",
  },
];

export default function ArrayOperationSelector({
  operation,
  onChange,
}: ArrayOperationSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-4">

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Array Operations
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Choose an operation to visualize.
        </p>

      </div>

      <div className="flex flex-wrap gap-2">

        {operations.map((item) => {

          const active =
            item.id === operation;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`
                rounded-lg
                px-4 py-2
                text-sm font-medium
                transition

                ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}

      </div>

    </div>
  );
}