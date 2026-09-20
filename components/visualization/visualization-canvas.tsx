"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type { AlgorithmStep } from "@/types/algorithm";

interface VisualizationCanvasProps {
  step: AlgorithmStep;
  totalSteps: number;
}

/* =========================================================
   OPERATION TYPES
========================================================= */

type OperationType =
  | "insert"
  | "delete"
  | "reverse"
  | "search"
  | "traverse"
  | "update"
  | "default";

/* =========================================================
   COMPONENT
========================================================= */

export default function VisualizationCanvas({
  step,
  totalSteps,
}: VisualizationCanvasProps) {
  /* =======================================================
     DETECT CURRENT OPERATION
  ======================================================= */

  const description =
    step.description.toLowerCase();

  const getOperationType =
    (): OperationType => {
      if (
        description.includes("insert") ||
        description.includes("place") ||
        description.includes("shift the element")
      ) {
        /*
         * Shift can happen during insertion OR deletion.
         * Delete is checked separately below.
         */
        if (
          description.includes("shift the element") &&
          description.includes("to index")
        ) {
          /*
           * We cannot always identify insert/delete
           * from the description alone, so deletion
           * keywords get priority.
           */
        }

        if (
          description.includes("remove") ||
          description.includes("deletion")
        ) {
          return "delete";
        }

        return "insert";
      }

      if (
        description.includes("remove") ||
        description.includes("deletion") ||
        description.includes("delete")
      ) {
        return "delete";
      }

      if (
        description.includes("swap") ||
        description.includes("reverse") ||
        description.includes("pointer")
      ) {
        return "reverse";
      }

      if (
        description.includes("compare") ||
        description.includes("found") ||
        description.includes("not equal")
      ) {
        return "search";
      }

      if (
        description.includes("visit") ||
        description.includes("traversal")
      ) {
        return "traverse";
      }

      if (
        description.includes("update") ||
        description.includes("replace") ||
        description.includes("current value")
      ) {
        return "update";
      }

      return "default";
    };

  const operation =
    getOperationType();

  /* =======================================================
     OPERATION COLORS / LABELS
  ======================================================= */

  const operationConfig = {
    insert: {
      label: "INSERT",
      icon: "＋",
      badge:
        "bg-emerald-50 text-emerald-700",
      border:
        "border-emerald-100",
      panel:
        "bg-emerald-50",
      iconBg:
        "bg-emerald-100 text-emerald-600",
      title:
        "text-emerald-700",
      node:
        "border-emerald-500 bg-emerald-100 text-emerald-700",
      glow:
        "0 0 0 6px rgba(16,185,129,0.12)",
      accent:
        "bg-emerald-500",
    },

    delete: {
      label: "DELETE",
      icon: "−",
      badge:
        "bg-rose-50 text-rose-700",
      border:
        "border-rose-100",
      panel:
        "bg-rose-50",
      iconBg:
        "bg-rose-100 text-rose-600",
      title:
        "text-rose-700",
      node:
        "border-rose-500 bg-rose-100 text-rose-700",
      glow:
        "0 0 0 6px rgba(244,63,94,0.12)",
      accent:
        "bg-rose-500",
    },

    reverse: {
      label: "REVERSE",
      icon: "↔",
      badge:
        "bg-amber-50 text-amber-700",
      border:
        "border-amber-100",
      panel:
        "bg-amber-50",
      iconBg:
        "bg-amber-100 text-amber-600",
      title:
        "text-amber-700",
      node:
        "border-amber-500 bg-amber-100 text-amber-700",
      glow:
        "0 0 0 6px rgba(245,158,11,0.12)",
      accent:
        "bg-amber-500",
    },

    search: {
      label: "SEARCH",
      icon: "⌕",
      badge:
        "bg-blue-50 text-blue-700",
      border:
        "border-blue-100",
      panel:
        "bg-blue-50",
      iconBg:
        "bg-blue-100 text-blue-600",
      title:
        "text-blue-700",
      node:
        "border-blue-500 bg-blue-100 text-blue-700",
      glow:
        "0 0 0 6px rgba(59,130,246,0.12)",
      accent:
        "bg-blue-500",
    },

    traverse: {
      label: "TRAVERSE",
      icon: "→",
      badge:
        "bg-indigo-50 text-indigo-700",
      border:
        "border-indigo-100",
      panel:
        "bg-indigo-50",
      iconBg:
        "bg-indigo-100 text-indigo-600",
      title:
        "text-indigo-700",
      node:
        "border-indigo-500 bg-indigo-100 text-indigo-700",
      glow:
        "0 0 0 6px rgba(99,102,241,0.12)",
      accent:
        "bg-indigo-500",
    },

    update: {
      label: "UPDATE",
      icon: "✎",
      badge:
        "bg-violet-50 text-violet-700",
      border:
        "border-violet-100",
      panel:
        "bg-violet-50",
      iconBg:
        "bg-violet-100 text-violet-600",
      title:
        "text-violet-700",
      node:
        "border-violet-500 bg-violet-100 text-violet-700",
      glow:
        "0 0 0 6px rgba(139,92,246,0.12)",
      accent:
        "bg-violet-500",
    },

    default: {
      label: "EXECUTE",
      icon: "⚡",
      badge:
        "bg-slate-100 text-slate-700",
      border:
        "border-slate-200",
      panel:
        "bg-slate-50",
      iconBg:
        "bg-slate-100 text-slate-600",
      title:
        "text-slate-600",
      node:
        "border-indigo-500 bg-indigo-100 text-indigo-700",
      glow:
        "0 0 0 6px rgba(99,102,241,0.12)",
      accent:
        "bg-indigo-500",
    },
  } as const;

  const config =
    operationConfig[operation];

  /* =======================================================
     POINTER DETECTION
  ======================================================= */

  const isPointerStep =
    operation === "reverse" &&
    (
      description.includes("left pointer") ||
      description.includes("right pointer")
    );

  /* =======================================================
     CURRENT NODE HIGHLIGHT
  ======================================================= */

  const isHighlighted = (
    index: number
  ) =>
    step.highlightedIndices.includes(
      index
    );

  /* =======================================================
     NODE LABEL
  ======================================================= */

  const getNodeActionLabel = (
    index: number
  ): string | null => {
    if (!isHighlighted(index)) {
      return null;
    }

    if (operation === "insert") {
      if (
        description.includes("shift")
      ) {
        return "SHIFT";
      }

      if (
        description.includes("place")
      ) {
        return "PLACE";
      }

      if (
        description.includes("insertion position")
      ) {
        return "POSITION";
      }

      return "INSERT";
    }

    if (operation === "delete") {
      if (
        description.includes("shift")
      ) {
        return "SHIFT";
      }

      if (
        description.includes("remove")
      ) {
        return "REMOVE";
      }

      return "DELETE";
    }

    if (operation === "reverse") {
      if (
        description.includes("compare")
      ) {
        return "COMPARE";
      }

      if (
        description.includes("swap")
      ) {
        return "SWAP";
      }

      if (
        description.includes("pointer")
      ) {
        return "POINTER";
      }

      return "ACTIVE";
    }

    if (operation === "search") {
      if (
        description.includes("found")
      ) {
        return "FOUND";
      }

      return "COMPARE";
    }

    if (operation === "traverse") {
      return "VISIT";
    }

    if (operation === "update") {
      return "UPDATE";
    }

    return "ACTIVE";
  };

  /* =======================================================
     EMPTY ARRAY
  ======================================================= */

  if (!step) {
    return null;
  }

  const linkedList = step.linkedList;
  const structure = step.structure;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-200 px-6 py-5">

        <div className="flex items-start justify-between gap-4">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-semibold text-slate-900">
                {step.linkedList
                  ? `${step.linkedList.variant[0].toUpperCase()}${step.linkedList.variant.slice(1)} Linked List Visualization`
                  : step.matrix
                    ? "Matrix Visualization"
                    : "Array Visualization"}
              </h3>

              <motion.span
                key={config.label}
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  ${config.badge}
                `}
              >
                {config.label}
              </motion.span>

            </div>

            <AnimatePresence mode="wait">

              <motion.p
                key={step.description}
                initial={{
                  opacity: 0,
                  y: 4,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -4,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="mt-1 text-xs text-slate-500"
              >
                {step.description}
              </motion.p>

            </AnimatePresence>

          </div>

          <div className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">

            Step {step.step + 1} /{" "}
            {totalSteps}

          </div>

        </div>

      </div>

      {/* =====================================================
          VISUALIZATION AREA
      ===================================================== */}

      <div className="relative min-h-[330px] overflow-hidden bg-slate-50 p-6">

        {/* GRID */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-50
            [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
            [background-size:32px_32px]
          "
        />

        {/* TOP OPERATION INDICATOR */}

        <motion.div
          key={`${operation}-${step.step}`}
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            absolute
            left-1/2
            top-5
            z-20
            -translate-x-1/2
          "
        >

          <div
            className={`
              flex
              items-center
              gap-2
              rounded-full
              border
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-bold
              tracking-wide
              shadow-sm
              ${config.border}
              ${config.title}
            `}
          >

            <span>
              {config.icon}
            </span>

            <span>
              {config.label}
            </span>

          </div>

        </motion.div>

        {/* ===================================================
            ARRAY
        =================================================== */}

        <div className="relative z-10 flex min-h-[280px] items-center justify-center overflow-x-auto pt-8">

          {structure ? (
            <div className="relative flex min-w-max flex-col items-center gap-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-600">
                  {structure.kind === "stacks"
                    ? "TOP"
                    : structure.kind === "queues"
                      ? "FRONT"
                      : structure.kind === "trees"
                        ? "ROOT"
                        : "START"}
                </span>
                <span>{structure.kind === "graphs" ? "vertices and edges" : "structure parts"}</span>
                <span className="rounded bg-amber-50 px-2 py-1 text-amber-600">
                  {structure.kind === "stacks"
                    ? "LIFO"
                    : structure.kind === "queues"
                      ? "FIFO"
                      : structure.kind === "trees"
                        ? "LEAVES"
                        : "EDGES"}
                </span>
              </div>

              <div className={structure.kind === "trees" ? "grid grid-cols-4 gap-3" : "flex items-center gap-2"}>
                {structure.values.map((value, index) => {
                  const highlighted = structure.highlightedIndices.includes(index);
                  return (
                    <div key={`${value}-${index}`} className="flex items-center gap-2">
                      <motion.div
                        layout
                        animate={{
                          scale: highlighted ? 1.08 : 1,
                          boxShadow: highlighted ? config.glow : "0 0 0 0 rgba(0,0,0,0)",
                        }}
                        className={`flex h-16 min-w-16 items-center justify-center rounded-xl border px-3 text-lg font-bold ${
                          highlighted ? config.node : "border-slate-300 bg-white text-slate-800"
                        }`}
                      >
                        {value}
                      </motion.div>
                      {structure.kind === "graphs" && index < structure.values.length - 1 && (
                        <span className="text-xs font-semibold text-slate-400">--</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {structure.kind === "graphs" && (
                <div className="max-w-xl rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
                  Edges: {structure.edges?.map(([from, to]) => `${structure.values[from]}-${structure.values[to]}`).join(", ")}
                </div>
              )}
              {structure.kind === "trees" && (
                <p className="text-xs text-slate-500">Parent nodes connect downward to child nodes; leaves have no children.</p>
              )}
            </div>
          ) : linkedList ? (
            <div className="relative flex min-w-max flex-col items-center gap-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className="rounded bg-indigo-50 px-2 py-1 text-indigo-600">HEAD</span>
                <span>node.value</span>
                <span>node.next</span>
                {linkedList.variant === "doubly" && <span>node.prev</span>}
                <span className="rounded bg-amber-50 px-2 py-1 text-amber-600">TAIL</span>
              </div>

              <div className="flex items-center gap-2">
                {linkedList.values.map((value, index) => {
                  const highlighted = linkedList.highlightedIndices.includes(index);
                  return (
                    <div key={`${value}-${index}`} className="flex items-center gap-2">
                      <motion.div
                        layout
                        animate={{
                          scale: highlighted ? 1.08 : 1,
                          boxShadow: highlighted ? config.glow : "0 0 0 0 rgba(0,0,0,0)",
                        }}
                        className={`relative flex h-20 w-24 flex-col overflow-hidden rounded-xl border bg-white text-center shadow-sm ${
                          highlighted ? config.node : "border-slate-300"
                        }`}
                      >
                        <div className="flex flex-1 items-center justify-center text-lg font-bold">
                          {value}
                        </div>
                        <div className="border-t border-slate-200 bg-slate-50 px-1 py-1 text-[9px] font-mono text-slate-500">
                          {linkedList.variant === "doubly" ? "prev | next" : "next"}
                        </div>
                        {highlighted && <span className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${config.accent}`} />}
                      </motion.div>

                      {index < linkedList.values.length - 1 && (
                        <div className="flex flex-col items-center gap-0.5 text-slate-400">
                          {linkedList.variant === "doubly" && <span className="text-xs">↔</span>}
                          {linkedList.variant !== "doubly" && <span className="text-xs">→</span>}
                          <span className="text-[9px] font-mono">next</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {linkedList.variant === "circular" && linkedList.values.length > 1 && (
                <div className="rounded-full border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-[10px] font-semibold text-amber-700">
                  tail.next → head
                </div>
              )}

              <div className="flex gap-3 text-[10px] font-medium text-slate-500">
                <span>head = first node</span>
                <span>tail = last node</span>
                {linkedList.variant === "doubly" && <span>prev links backward</span>}
              </div>
            </div>
          ) : step.array.length > 0 ? (

            <div
              className={step.matrix ? "grid min-w-max" : "flex min-w-max items-end"}
              style={
                step.matrix
                  ? { gridTemplateColumns: `repeat(${step.matrix[0].length}, minmax(0, 5rem))` }
                  : undefined
              }
            >

              <AnimatePresence mode="popLayout">

                {step.array.map(
                  (value, index) => {

                    const highlighted =
                      isHighlighted(index);

                    const actionLabel =
                      getNodeActionLabel(
                        index
                      );

                    /*
                     * During reverse operations,
                     * the two highlighted nodes represent
                     * the left/right pointers.
                     */
                    const pointerPosition =
                      operation ===
                        "reverse" &&
                      highlighted
                        ? index ===
                          step.highlightedIndices[0]
                          ? "LEFT"
                          : "RIGHT"
                        : null;

                    return (
                      <motion.div
                        key={`${value}-${index}`}
                        layout
                        initial={{
                          opacity: 0,
                          scale: 0.75,
                          y: -40,
                        }}
                        animate={{
                          opacity: 1,
                          scale:
                            highlighted
                              ? 1.08
                              : 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.7,
                          y: 40,
                        }}
                        transition={{
                          layout: {
                            type: "spring",
                            stiffness: 420,
                            damping: 30,
                          },

                          opacity: {
                            duration: 0.25,
                          },

                          scale: {
                            duration: 0.25,
                          },

                          y: {
                            duration: 0.3,
                          },
                        }}
                        className="
                          relative
                          flex
                          flex-col
                          items-center
                        "
                      >

                        {/* ACTION LABEL */}

                        <AnimatePresence>

                          {highlighted &&
                            actionLabel && (

                              <motion.div
                                initial={{
                                  opacity: 0,
                                  y: 8,
                                  scale: 0.85,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                  y: -5,
                                  scale: 0.85,
                                }}
                                className="
                                  absolute
                                  -top-12
                                  z-30
                                  whitespace-nowrap
                                  rounded-md
                                  bg-slate-900
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-bold
                                  tracking-wide
                                  text-white
                                  shadow-md
                                "
                              >
                                {pointerPosition
                                  ? pointerPosition
                                  : actionLabel}
                              </motion.div>

                            )}

                        </AnimatePresence>

                        {/* POINTER ARROW */}

                        {isPointerStep &&
                          highlighted && (

                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              className="
                                absolute
                                -bottom-12
                                text-xs
                                font-bold
                                text-slate-500
                              "
                            >
                              {pointerPosition ===
                              "LEFT"
                                ? "↑ LEFT"
                                : "↑ RIGHT"}
                            </motion.div>

                          )}

                        {/* NODE */}

                        <motion.div
                          animate={
                            highlighted
                              ? {
                                  boxShadow:
                                    config.glow,
                                  y:
                                    operation ===
                                    "reverse"
                                      ? -3
                                      : 0,
                                }
                              : {
                                  boxShadow:
                                    "0 0 0 0 rgba(0,0,0,0)",
                                  y: 0,
                                }
                          }
                          transition={{
                            duration: 0.3,
                          }}
                          className={`
                            relative
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            border
                            text-lg
                            font-bold
                            transition-colors
                            duration-300

                            ${
                              highlighted
                                ? config.node
                                : "border-slate-300 bg-white text-slate-800"
                            }

                            ${
                              index ===
                              0
                                ? "rounded-l-xl"
                                : ""
                            }

                            ${
                              index ===
                              step.array.length -
                                1
                                ? "rounded-r-xl"
                                : ""
                            }
                          `}
                        >

                          {/* VALUE */}

                          <AnimatePresence mode="wait">

                            <motion.span
                              key={`${value}-${step.step}`}
                              initial={{
                                opacity: 0,
                                scale: 0.75,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                duration: 0.2,
                              }}
                            >
                              {value}
                            </motion.span>

                          </AnimatePresence>

                          {/* HIGHLIGHT DOT */}

                          {highlighted && (
                            <motion.div
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                              className={`
                                absolute
                                right-1.5
                                top-1.5
                                h-2
                                w-2
                                rounded-full
                                ${config.accent}
                              `}
                            />
                          )}

                        </motion.div>

                        {/* INDEX */}

                        <motion.span
                          layout
                          className={`
                            mt-2
                            font-mono
                            text-xs
                            transition-colors
                            duration-300

                            ${
                              highlighted
                                ? `font-semibold ${config.title}`
                                : "text-slate-400"
                            }
                          `}
                        >
                          [{index}]
                        </motion.span>

                      </motion.div>
                    );
                  }
                )}

              </AnimatePresence>

            </div>

          ) : (

            /* EMPTY ARRAY */

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="
                relative
                z-10
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-8
                py-6
                text-sm
                text-slate-400
              "
            >
              Array is empty
            </motion.div>

          )}

        </div>

      </div>

      {/* =====================================================
          OPERATION EXPLANATION
      ===================================================== */}

      <motion.div
        key={`${operation}-${step.step}`}
        initial={{
          opacity: 0,
          y: 6,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className={`
          mx-6
          mb-6
          rounded-xl
          border
          p-4
          ${config.border}
          ${config.panel}
        `}
      >

        <div className="flex items-start gap-3">

          {/* ICON */}

          <motion.div
            initial={{
              scale: 0.8,
            }}
            animate={{
              scale: 1,
            }}
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-sm
              font-bold
              ${config.iconBg}
            `}
          >
            {config.icon}
          </motion.div>

          {/* TEXT */}

          <div className="min-w-0">

            <p
              className={`
                text-xs
                font-bold
                uppercase
                tracking-wider
                ${config.title}
              `}
            >
              Current Operation
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-700">
              {step.description}
            </p>

          </div>

        </div>

      </motion.div>

      {/* =====================================================
          LEGEND
      ===================================================== */}

      <div className="border-t border-slate-100 px-6 py-4">

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">

          <span className="font-semibold uppercase tracking-wider text-slate-400">
            Legend
          </span>

          <span className="flex items-center gap-1.5">

            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

            Normal

          </span>

          <span className="flex items-center gap-1.5">

            <span
              className={`
                h-2.5
                w-2.5
                rounded-full
                ${config.accent}
              `}
            />

            Active

          </span>

          {operation ===
            "reverse" && (

            <span className="flex items-center gap-1.5">

              <span className="font-semibold text-amber-600">
                ← →
              </span>

              Two-pointer operation

            </span>

          )}

        </div>

      </div>

    </div>
  );
}