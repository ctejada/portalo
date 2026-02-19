interface PhonePreviewProps {
  children: React.ReactNode;
}

export function PhonePreview({ children }: PhonePreviewProps) {
  return (
    <div className="w-[375px] h-[667px] bg-bg-primary rounded-[2.5rem] border border-border-primary shadow-sm overflow-hidden">
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  );
}
