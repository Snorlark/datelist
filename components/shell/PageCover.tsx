import type { PersonId } from "@/types";
import { Pet } from "@/components/illustrations/Pet";
import { Scallop } from "@/components/scrapbook/Scallop";
import { ThemePicker } from "./ThemePicker";
import { cn } from "@/lib/utils/format";

/**
 * The top of every page, Notion style: a breadcrumb line, then a matcha cover
 * band with a scalloped bottom edge and one of the pets sitting on it.
 */
export function PageCover({ crumb, aside, who = "sophia", tall }: { crumb: string; aside?: React.ReactNode; who?: PersonId; tall?: boolean }) {
  return (
    <div>
      <div className="relative z-20 flex h-11 items-center justify-between px-5 text-label text-muted lg:px-6">
        <p>
          <span className="lg:hidden">datelist / </span>
          {crumb}
        </p>
        <div className="flex items-center gap-3">
          {aside}
          {/* phones have no sidebar, so the theme picker lives up here */}
          <div className="lg:hidden">
            <ThemePicker align="right" />
          </div>
        </div>
      </div>
      <div className={cn("relative bg-matcha", tall ? "h-24 lg:h-36" : "h-16 lg:h-24")}>
        <Pet who={who} size={tall ? 62 : 48} priority className={cn("absolute bottom-[-10px] z-10", who === "sophia" ? "right-[12%]" : "left-[12%]")} />
        <div className="absolute inset-x-0 -bottom-[14px]">
          <Scallop flip />
        </div>
      </div>
    </div>
  );
}
