"use client";

import type { AlgorithmDefinition } from "@/types/algorithm";

interface CodeExecutionPanelProps {
  algorithm: AlgorithmDefinition;
  currentLine: number;
}

export default function CodeExecutionPanel({
  algorithm,
  currentLine,
}: CodeExecutionPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">

        <div>
          <h3 className="text-sm font-semibold text-white">
            Code Execution
          </h3>

          <p className="text-xs text-slate-500">
            Synchronized with visualization
          </p>
        </div>

        <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
          {algorithm.language}
        </span>

      </div>


      {/* CODE */}
      <div className="overflow-x-auto p-5">

        <pre className="font-mono text-sm leading-7">

          {algorithm.code
            .split("\n")
            .map((line, index) => {

              const lineNumber = index + 1;

              const active =
                lineNumber === currentLine;

              return (
                <div
                  key={index}
                  className={`
                    flex min-w-max rounded-md px-2
                    transition-colors duration-200
                    ${
                      active
                        ? "bg-indigo-500/20 text-white"
                        : "text-slate-400"
                    }
                  `}
                >

                  {/* LINE NUMBER */}
                  <span
                    className={`
                      mr-5 w-7 select-none text-right
                      ${
                        active
                          ? "text-indigo-300"
                          : "text-slate-600"
                      }
                    `}
                  >
                    {lineNumber}
                  </span>

                  {/* ACTIVE INDICATOR */}
                  <span className="mr-2 w-3">
                    {active ? "›" : ""}
                  </span>

                  {/* CODE */}
                  <code>
                    {line || " "}
                  </code>

                </div>
              );
            })}

        </pre>

      </div>

    </div>
  );
}