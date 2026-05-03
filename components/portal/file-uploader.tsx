"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type UploadedFile = {
  url: string;
  fileName: string;
};

type PortalFileUploaderProps = {
  name: string;
  label: string;
  description?: string;
};

export function PortalFileUploader({ name, label, description }: PortalFileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const value = useMemo(() => files.map((file) => file.url).join("\n"), [files]);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    setIsUploading(true);
    setStatus("Subiendo archivos...");

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/uploads/customer-files", {
        method: "POST",
        body: formData
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No se pudieron subir los archivos.");

      const uploaded = payload.files as UploadedFile[];
      setFiles((current) => [...current, ...uploaded]);
      setStatus(`${uploaded.length} archivo(s) adjuntado(s).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudieron subir los archivos.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeFile(url: string) {
    setFiles((current) => current.filter((file) => file.url !== url));
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-col justify-between gap-3 rounded-md border bg-muted/35 p-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
          className="hidden"
          onChange={(event: ChangeEvent<HTMLInputElement>) => uploadFiles(event.target.files)}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          Subir archivo
        </Button>
      </div>

      {files.length ? (
        <div className="grid gap-2">
          {files.map((file) => (
            <div key={file.url} className="flex items-center justify-between gap-3 rounded-md border bg-white p-2 text-sm">
              <span className="truncate">{file.fileName}</span>
              <Button type="button" variant="ghost" size="icon" aria-label="Quitar archivo" onClick={() => removeFile(file.url)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
    </div>
  );
}
