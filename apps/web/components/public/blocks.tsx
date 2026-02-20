import type { BlockConfig } from "@portalo/shared";
import type { ResolvedTheme } from "@/lib/themes";

interface BlockProps {
  block: BlockConfig;
  theme: ResolvedTheme;
}

export function Block({ block, theme }: BlockProps) {
  switch (block.kind) {
    case "spacer":
      return <div style={{ height: block.props.height ?? 24 }} />;
    case "divider":
      return (
        <div
          className={`border-t ${theme.divider}`}
          style={theme.customStyles.secondary ? { borderColor: "currentColor", ...theme.customStyles.secondary } : undefined}
        />
      );
    case "text":
      return (
        <p
          className={`text-sm text-center leading-relaxed ${theme.textSecondary}`}
          style={theme.customStyles.secondary}
        >
          {block.props.text}
        </p>
      );
    default:
      return null;
  }
}
