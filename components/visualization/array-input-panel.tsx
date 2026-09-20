"use client";

import { useState } from "react";

import type { ArrayOperation } from "@/types/algorithm";

interface ArrayInputPanelProps {
  operation: ArrayOperation;

  array: number[];
  onArrayChange: (array: number[]) => void;

  target: number;
  onTargetChange: (target: number) => void;

  index: number;
  onIndexChange: (index: number) => void;

  value: number;
  onValueChange: (value: number) => void;

  onApply: () => void;
}

export default function ArrayInputPanel({
  operation,
  array,
  onArrayChange,
  target,
  onTargetChange,
  index,
  onIndexChange,
  value,
  onValueChange,
  onApply,
}: ArrayInputPanelProps) {
  const [arrayText, setArrayText] = useState(
    array.join(", ")
  );

  const [error, setError] = useState("");

  const handleArrayChange = (
    text: string
  ) => {
    setArrayText(text);
    setError("");

    if (text.trim() === "") {
      onArrayChange([]);
      return;
    }

    const parts = text
      .split(",")
      .map((item) => item.trim());

    const hasInvalidValue = parts.some(
      (item) =>
        item !== "" &&
        !Number.isFinite(Number(item))
    );

    if (hasInvalidValue) {
      setError(
        "Please enter only numbers separated by commas."
      );
      return;
    }

    const values = parts
      .filter((item) => item !== "")
      .map(Number);

    onArrayChange(values);
  };

  const handleApply = () => {
    setError("");

    if (array.length === 0) {
      setError(
        "Array cannot be empty."
      );
      return;
    }

    if (array.length > 20) {
      setError(
        "Please use a maximum of 20 elements for visualization."
      );
      return;
    }

    if (
      operation === "search" &&
      !Number.isFinite(target)
    ) {
      setError(
        "Please enter a valid search target."
      );
      return;
    }

    if (
      operation === "insert" &&
      (index < 0 ||
        index > array.length)
    ) {
      setError(
        `Insert index must be between 0 and ${array.length}.`
      );
      return;
    }

    if (
      operation === "delete" &&
      (index < 0 ||
        index >= array.length)
    ) {
      setError(
        `Delete index must be between 0 and ${
          array.length - 1
        }.`
      );
      return;
    }

    if (
      operation === "update" &&
      (index < 0 ||
        index >= array.length)
    ) {
      setError(
        `Update index must be between 0 and ${
          array.length - 1
        }.`
      );
      return;
    }

    if (
      (operation === "insert" ||
        operation === "update") &&
      !Number.isFinite(value)
    ) {
      setError(
        "Please enter a valid value."
      );
      return;
    }

    onApply();
  };

  const showTarget =
    operation === "search";

  const showIndex =
    operation === "insert" ||
    operation === "delete" ||
    operation === "update";

  const showValue =
    operation === "insert" ||
    operation === "update";

  const operationName =
    operation.charAt(0).toUpperCase() +
    operation.slice(1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* HEADER */}

      <div className="mb-5 flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Operation Input
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Configure parameters for{" "}
            <span className="font-medium text-slate-700">
              {operationName}
            </span>
            .
          </p>
        </div>

        <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          {array.length} elements
        </div>

      </div>


      {/* INPUT GRID */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* ARRAY */}

        <div className="lg:col-span-2">

          <label
            htmlFor="array-input"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Array
          </label>

          <input
            id="array-input"
            type="text"
            value={arrayText}
            onChange={(event) =>
              handleArrayChange(
                event.target.value
              )
            }
            placeholder="10, 20, 30, 40, 50"
            className="
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-100
            "
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Separate numbers with commas.
          </p>

        </div>


        {/* TARGET */}

        {showTarget && (

          <div>

            <label
              htmlFor="target-input"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Search Target
            </label>

            <input
              id="target-input"
              type="number"
              value={target}
              onChange={(event) =>
                onTargetChange(
                  Number(event.target.value)
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
            />

          </div>

        )}


        {/* INDEX */}

        {showIndex && (

          <div>

            <label
              htmlFor="index-input"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Index
            </label>

            <input
              id="index-input"
              type="number"
              min="0"
              value={index}
              onChange={(event) =>
                onIndexChange(
                  Number(event.target.value)
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
            />

            <p className="mt-1.5 text-xs text-slate-400">
              {operation === "insert"
                ? `0 to ${array.length}`
                : `0 to ${
                    Math.max(
                      0,
                      array.length - 1
                    )
                  }`}
            </p>

          </div>

        )}


        {/* VALUE */}

        {showValue && (

          <div>

            <label
              htmlFor="value-input"
              className="mb-2 block text-xs font-semibold text-slate-600"
            >
              Value
            </label>

            <input
              id="value-input"
              type="number"
              value={value}
              onChange={(event) =>
                onValueChange(
                  Number(event.target.value)
                )
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-indigo-400
                focus:ring-2
                focus:ring-indigo-100
              "
            />

          </div>

        )}

      </div>


      {/* ERROR */}

      {error && (

        <div
          className="
            mt-4
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          ⚠ {error}
        </div>

      )}


      {/* APPLY */}

      <div className="mt-5 flex items-center justify-between gap-4">

        <p className="text-xs text-slate-400">
          Changes are applied to the visualizer
          when you click Apply.
        </p>

        <button
          onClick={handleApply}
          className="
            shrink-0
            rounded-lg
            bg-indigo-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-indigo-700
            active:scale-[0.98]
          "
        >
          Apply Operation
        </button>

      </div>

    </div>
  );
}