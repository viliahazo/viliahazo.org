"use client";

import { Trash2 } from "lucide-react";
import { deleteRecord } from "@/app/actions/content";

/**
 * Suppression d'un enregistrement, avec confirmation (le bouton reste
 * inactif côté serveur sans session admin valide).
 */
export function AdminDeleteForm({
  tableKey,
  id,
  message,
  label,
  compact = false,
}: {
  tableKey: string;
  id: string;
  message: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <form
      action={deleteRecord}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={compact ? "inline-flex" : "mt-5 border-t border-earth-200 pt-5"}
    >
      <input type="hidden" name="__table" value={tableKey} />
      <input type="hidden" name="__id" value={id} />
      <button
        type="submit"
        className={
          compact
            ? "inline-flex items-center gap-1 rounded-lg p-2 text-red-700 hover:bg-red-50"
            : "inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100"
        }
        title={label}
        aria-label={label}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        {compact ? null : label}
      </button>
    </form>
  );
}
