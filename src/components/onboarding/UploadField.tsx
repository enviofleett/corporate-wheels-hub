import { Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface UploadFieldProps {
  label: string;
  hint?: string;
}

export function UploadField({ label, hint }: UploadFieldProps) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setUploaded((v) => !v)}
      className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-4 text-left transition-colors hover:border-accent hover:bg-accent-soft"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          uploaded ? "bg-success text-success-foreground" : "bg-accent-soft text-accent"
        }`}
      >
        {uploaded ? <CheckCircle2 className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">
          {uploaded ? "Document uploaded" : label}
        </div>
        {hint && !uploaded && <div className="text-xs text-muted-foreground">{hint}</div>}
        {uploaded && <div className="text-xs text-muted-foreground">Tap to remove</div>}
      </div>
    </button>
  );
}
