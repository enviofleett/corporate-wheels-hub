import { Star } from "lucide-react";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
};

export function StarRating({ value, onChange, size = 28, readOnly = false }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            className="rounded-full p-1 transition-transform active:scale-90 disabled:cursor-default disabled:active:scale-100"
            aria-label={`Rate ${n} stars`}
          >
            <Star
              style={{ width: size, height: size }}
              className={
                active ? "fill-accent text-accent" : "fill-transparent text-muted-foreground/40"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
