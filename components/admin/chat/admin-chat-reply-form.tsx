"use client";

import { KeyboardEvent, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type AdminChatReplyFormProps = {
  replyAction: (formData: FormData) => Promise<void>;
};

export function AdminChatReplyForm({ replyAction }: AdminChatReplyFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    const body = String(formData.get("body") || "").trim();
    if (!body || pending) return;

    startTransition(async () => {
      await replyAction(formData);
      formRef.current?.reset();
      textareaRef.current?.focus();
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={submit} className="grid gap-3 md:grid-cols-[1fr_auto]">
      <Textarea
        ref={textareaRef}
        name="body"
        placeholder="Escribe una respuesta para el cliente. Enter envia, Shift+Enter salta linea."
        className="min-h-20"
        onKeyDown={handleKeyDown}
      />
      <Button type="submit" disabled={pending}>{pending ? "Enviando..." : "Responder"}</Button>
    </form>
  );
}
