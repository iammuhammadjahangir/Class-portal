"use client";

import { useMemo, useState } from "react";
import { MaterialTag } from "@prisma/client";
import { MATERIAL_TAG_META, MATERIAL_TAG_OPTIONS } from "@/lib/materialTags";
import MaterialRow from "./MaterialRow";

type Material = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  linkUrl: string | null;
  tag: MaterialTag;
};

export default function MaterialFilterList({ materials }: { materials: Material[] }) {
  const [active, setActive] = useState<Set<MaterialTag>>(new Set());

  const tagsPresent = useMemo(
    () => MATERIAL_TAG_OPTIONS.filter((tag) => materials.some((m) => m.tag === tag)),
    [materials]
  );

  const visible = active.size === 0 ? materials : materials.filter((m) => active.has(m.tag));

  function toggle(tag: MaterialTag) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <div>
      {tagsPresent.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tagsPresent.map((tag) => (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                active.has(tag) ? MATERIAL_TAG_META[tag].active : MATERIAL_TAG_META[tag].inactive
              }`}
            >
              {MATERIAL_TAG_META[tag].label}
            </button>
          ))}
          {active.size > 0 && (
            <button
              onClick={() => setActive(new Set())}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="divide-y divide-stone-100 dark:divide-stone-900">
        {visible.map((m) => (
          <MaterialRow key={m.id} title={m.title} description={m.description} fileUrl={m.fileUrl} linkUrl={m.linkUrl} />
        ))}
        {visible.length === 0 && <p className="py-4 text-sm text-stone-400">Nothing matches that filter.</p>}
      </div>
    </div>
  );
}
