"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type FormSubmitButtonProps = ComponentProps<typeof Button> & {
  idleLabel: string;
  pendingLabel?: string;
};

export function FormSubmitButton({
  idleLabel,
  pendingLabel = "Procesando...",
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
