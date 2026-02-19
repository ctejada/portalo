interface PoweredByProps {
  show: boolean;
  className?: string;
}

export function PoweredBy({ show, className }: PoweredByProps) {
  if (!show) return null;

  return (
    <div className="mt-12 text-center">
      <a
        href="https://portalo.so"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs hover:underline ${className ?? "text-text-tertiary"}`}
      >
        Powered by Portalo
      </a>
    </div>
  );
}
