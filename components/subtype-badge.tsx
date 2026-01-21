import {
  type CreatureSubtype,
  SUBTYPE_METADATA,
} from "@/lib/type-effectiveness";
import { cn } from "@/lib/utils";

type SubtypeBadgeProps = {
  subtype: CreatureSubtype;
  size?: "sm" | "md";
  className?: string;
};

export default function SubtypeBadge({
  subtype,
  size = "sm",
  className,
}: SubtypeBadgeProps) {
  const metadata = SUBTYPE_METADATA[subtype];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border",
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-0.5 text-xs",
        className
      )}
      style={{
        backgroundColor: `${metadata.color}20`,
        borderColor: `${metadata.color}50`,
        color: metadata.color,
      }}
    >
      {metadata.label}
    </span>
  );
}

type SubtypeBadgeListProps = {
  subtypes: CreatureSubtype[];
  size?: "sm" | "md";
  className?: string;
};

export function SubtypeBadgeList({
  subtypes,
  size = "sm",
  className,
}: SubtypeBadgeListProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {subtypes.map((subtype) => (
        <SubtypeBadge key={subtype} subtype={subtype} size={size} />
      ))}
    </div>
  );
}
