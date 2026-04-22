"use client";

import { db } from "@/lib/instant/db";
import { cld } from "@/lib/cloudflare";

const LOTUS_BG_FILE_ID = "15381c34-2384-4196-a5a8-e7b7dcd377ef";

export function useLotusBackground(): string | null {
  const { data } = db.useQuery({
    $files: { $: { where: { id: LOTUS_BG_FILE_ID } } },
  });
  const file = data?.$files?.[0];
  return file ? cld(file.url, { width: 1920, quality: 90 }) : null;
}
