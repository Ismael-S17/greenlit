import { useCallback, useEffect, useRef, useState } from "react";
import type { Status } from "../types";
import { STATUS_ORDER, STATUS_LABELS } from "../types";
import { statusColor } from "./StatusBadge";

interface StatusSliderProps {
  status: Status;
  onChange: (status: Status) => void;
  className?: string;
}

const THUMB = 30;
const PAD = 5;

export default function StatusSlider({ status, onChange, className }: StatusSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(280);
  const [dragPercent, setDragPercent] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setTrackWidth(width);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const activeIndex = STATUS_ORDER.indexOf(status);
  const stops = STATUS_ORDER.length;
  const usable = Math.max(trackWidth - THUMB - PAD * 2, 1);

  const indexToPercent = (index: number) => (index / (stops - 1)) * 100;

  const percentToIndex = useCallback(
    (percent: number) => {
      const raw = (percent / 100) * (stops - 1);
      return Math.min(stops - 1, Math.max(0, Math.round(raw)));
    },
    [stops],
  );

  const percentFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left - PAD - THUMB / 2, 0), usable);
      return (x / usable) * 100;
    },
    [usable],
  );

  const commitFromPercent = useCallback(
    (percent: number) => {
      const index = percentToIndex(percent);
      onChange(STATUS_ORDER[index]);
    },
    [onChange, percentToIndex],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setDragPercent(percentFromClientX(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragPercent(percentFromClientX(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const percent = percentFromClientX(e.clientX);
    commitFromPercent(percent);
    setDragPercent(null);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (dragging) return;
    const percent = percentFromClientX(e.clientX);
    commitFromPercent(percent);
  };

  const displayPercent = dragPercent ?? indexToPercent(activeIndex);
  const displayIndex = dragging ? percentToIndex(dragPercent ?? 0) : activeIndex;
  const color = statusColor(STATUS_ORDER[displayIndex]);
  const thumbLeft = PAD + (displayPercent / 100) * usable;

  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, [dragging]);

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-10 rounded-full cursor-pointer select-none touch-none"
        style={{
          background: "linear-gradient(180deg, #1c1d24, #101116)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {STATUS_ORDER.map((s, i) => {
          const pct = indexToPercent(i);
          const reached = i <= displayIndex;
          const markerLeft = PAD + THUMB / 2 + (pct / 100) * usable;
          return (
            <div
              key={s}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-colors duration-200"
              style={{
                left: markerLeft,
                width: 7,
                height: 7,
                background: reached ? statusColor(s) : "rgba(255,255,255,0.18)",
                boxShadow: reached ? `0 0 6px 1px ${statusColor(s)}aa` : "none",
              }}
            />
          );
        })}
        <div
          onPointerDown={handlePointerDown}
          className="absolute top-1/2 rounded-full"
          style={{
            width: THUMB,
            height: THUMB,
            left: thumbLeft,
            transform: "translateY(-50%)",
            background: `radial-gradient(circle at 35% 30%, ${color}, ${color}cc 60%, ${color}88 100%)`,
            boxShadow: `0 0 14px 3px ${color}aa, 0 1px 3px rgba(0,0,0,0.5), inset 0 0 3px rgba(0,0,0,0.3)`,
            transition: dragging ? "none" : "left 180ms cubic-bezier(.2,.8,.2,1), background 180ms",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        {STATUS_ORDER.map((s) => (
          <span
            key={s}
            className="text-[10px] font-medium tracking-wide uppercase"
            style={{ color: s === STATUS_ORDER[displayIndex] ? statusColor(s) : "var(--text-muted)" }}
          >
            {STATUS_LABELS[s].split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
