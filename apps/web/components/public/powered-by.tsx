interface PoweredByProps {
  show: boolean;
  isDark?: boolean;
}

export function PoweredBy({ show, isDark }: PoweredByProps) {
  if (!show) return null;

  return (
    <div className="mt-12 text-center">
      <a
        href="https://portalo.so"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs ${
          isDark ? "text-[#4B5563]" : "text-text-tertiary"
        } hover:underline`}
      >
        Powered by Portalo
      </a>
    </div>
  );
}
