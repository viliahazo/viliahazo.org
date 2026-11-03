"use client";

import { useActionState, useState } from "react";
import { Check, Eye, Lock, MessageSquare, Send, ShieldAlert, X } from "lucide-react";
import type { ActualiteReply, SessionUser } from "@/lib/types";
import { createReply, moderateReply, type ReplyState } from "@/app/actions/news";
import { useLang } from "./lang-provider";
import { Badge, buttonClass, inputClass } from "./ui";
import { formatDate } from "@/lib/format";

export function VaovaoReplies({
  actualiteId,
  initialReplies,
  currentUser,
}: {
  actualiteId: string;
  initialReplies: ActualiteReply[];
  currentUser: SessionUser | null;
}) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ReplyState, FormData>(
    createReply,
    null,
  );

  const isAdmin = currentUser?.role === "admin";
  const replyCount = initialReplies.length;

  return (
    <div className="mt-4 border-t border-earth-100 pt-3">
      {/* Bouton de bascule pour afficher les réponses */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-leaf-700 hover:bg-leaf-50 transition"
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          <span>
            {replyCount > 0
              ? `${replyCount} ${t.news.replyCount}`
              : t.news.replies}
          </span>
        </button>

        {isAdmin && initialReplies.some((r) => r.statut === "en_attente") && (
          <Badge tone="amber">
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" aria-hidden />
              {t.news.pendingValidation}
            </span>
          </Badge>
        )}
      </div>

      {open && (
        <div className="mt-4 space-y-4 rounded-xl bg-earth-50/80 p-4 border border-earth-200">
          {/* Liste des réponses */}
          {initialReplies.length === 0 ? (
            <p className="text-xs text-earth-500 italic text-center py-2">
              {t.news.noReplies}
            </p>
          ) : (
            <ul className="space-y-3">
              {initialReplies.map((reply) => {
                const isPending = reply.statut === "en_attente";
                const isAuthor =
                  currentUser &&
                  (reply.user_id === currentUser.id ||
                    reply.auteur_nom === currentUser.nom);

                return (
                  <li
                    key={reply.id}
                    className={`rounded-xl border p-3.5 transition text-sm ${
                      isPending
                        ? "border-amber-200 bg-amber-50/60"
                        : "border-earth-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-earth-900">
                          {reply.auteur_nom}
                        </span>
                        <span className="text-xs text-earth-500">
                          {formatDate(lang, reply.created_at)}
                        </span>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-1.5">
                          <Badge tone="amber">
                            <span className="flex items-center gap-1">
                              <Lock className="h-2.5 w-2.5" aria-hidden />
                              {t.news.pendingValidation}
                            </span>
                          </Badge>
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-earth-700 leading-relaxed whitespace-pre-line">
                      {reply.message}
                    </p>

                    {/* Note privée pour l'auteur */}
                    {isPending && isAuthor && !isAdmin && (
                      <p className="mt-2 text-xs text-amber-800 bg-amber-100/70 rounded-lg px-2 py-1">
                        {t.news.replyPrivateNote}
                      </p>
                    )}

                    {/* Actions de modération admin directes */}
                    {isAdmin && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-earth-200/60 pt-2.5">
                        {isPending ? (
                          <form action={moderateReply}>
                            <input type="hidden" name="id" value={reply.id} />
                            <input type="hidden" name="statut" value="publie" />
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-leaf-700"
                            >
                              <Check className="h-3 w-3" aria-hidden />
                              {t.news.makePublic}
                            </button>
                          </form>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-leaf-700 font-medium">
                            <Eye className="h-3 w-3" aria-hidden />
                            {t.common.published}
                          </span>
                        )}

                        <form action={moderateReply}>
                          <input type="hidden" name="id" value={reply.id} />
                          <input type="hidden" name="statut" value="supprimer" />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" aria-hidden />
                            {t.news.deleteReply}
                          </button>
                        </form>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Formulaire de réponse */}
          {state?.ok ? (
            <div className="rounded-xl border border-leaf-200 bg-leaf-50 p-3.5 text-xs text-leaf-900">
              <p className="font-semibold">{t.news.replySuccess}</p>
            </div>
          ) : (
            <form action={formAction} className="mt-3 space-y-3">
              <input type="hidden" name="actualiteId" value={actualiteId} />

              {!currentUser && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <input
                    type="text"
                    name="nom"
                    required
                    minLength={2}
                    placeholder={t.common.name}
                    className={`${inputClass} text-xs py-2`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={`${t.common.email} (${t.common.optional})`}
                    className={`${inputClass} text-xs py-2`}
                  />
                </div>
              )}

              <textarea
                name="message"
                required
                minLength={3}
                maxLength={1000}
                rows={3}
                placeholder={t.news.replyPlaceholder}
                className={`${inputClass} text-xs py-2 resize-y min-h-[70px]`}
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] text-earth-500">
                  {t.news.replyPrivateNote}
                </p>

                <button
                  type="submit"
                  disabled={pending}
                  className={`${buttonClass} px-3 py-1.5 text-xs`}
                >
                  <Send className="h-3 w-3" aria-hidden />
                  {pending ? t.common.submitting : t.news.reply}
                </button>
              </div>

              {state?.error && (
                <p className="text-xs text-red-700 font-medium">
                  {t.common.error}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
