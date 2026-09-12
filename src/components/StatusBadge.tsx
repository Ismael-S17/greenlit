import type { Status } from "../types";
import { STATUS_LABELS } from "../types";

const GLOW: Record<Status, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  grey: "#9ca3af",
};

const sizeMap = {
  sm: { box: 22, radius: 6, screw: 2 },
  md: { box: 32, radius: 9, screw: 2.5 },
  lg: { box: 52, radius: 14, screw: 4 },
};

interface StatusBadgeProps {
  status: Status;
  size?: keyof typeof sizeMap;
  title?: string;
}

export default function StatusBadge({ status, size = "md", title }: StatusBadgeProps) {
  const color = GLOW[status];
  const { box, radius, screw } = sizeMap[size];
  const inset = box * 0.16;

  return (
    <div
      className="relative shrink-0"
      style={{ width: box, height: box }}
      title={title ?? STATUS_LABELS[status]}
      role="img"
      aria-label={STATUS_LABELS[status]}
    >
      <div
        className="absolute inset-0"
        style={{
          borderRadius: radius,
          background: "linear-gradient(155deg, #3a3b42, #17181c 65%)",
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.4)",
        }}
      />
      {size !== "sm" && (
        <>
          <Screw x={screw + 1} y={screw + 1} size={screw} />
          <Screw x={box - screw - 1} y={screw + 1} size={screw} />
          <Screw x={screw + 1} y={box - screw - 1} size={screw} />
          <Screw x={box - screw - 1} y={box - screw - 1} size={screw} />
        </>
      )}
      <div
        className="absolute"
        style={{
          top: inset,
          left: inset,
          right: inset,
          bottom: inset,
          borderRadius: Math.max(radius - inset / 2, 3),
          background: `radial-gradient(circle at 35% 30%, ${color}, ${color}cc 55%, ${color}66 100%)`,
          boxShadow: `0 0 ${box * 0.5}px ${box * 0.12}px ${color}99, inset 0 0 4px rgba(0,0,0,0.35)`,
          backgroundImage: `radial-gradient(circle at 35% 30%, ${color}, ${color}cc 55%, ${color}66 100%), repeating-radial-gradient(circle, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 0.5px, transparent 1px, transparent 2.4px)`,
        }}
      />
    </div>
  );
}

function Screw({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 30%, #6b6c74, #0c0d10)",
      }}
    />
  );
}

export function statusColor(status: Status) {
  return GLOW[status];
}
