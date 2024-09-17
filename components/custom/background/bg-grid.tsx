"use client";

export function BGGrid({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative">
      {children}
      <div
        className="fixed inset-0 z-[-1] bg-gradient-to-b from-muted to-background h-screen w-screen"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--muted)), hsl(var(--background)))",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(0deg, transparent 19%, hsl(var(--muted)/70%) 20%, hsl(var(--muted)/70%) 21%, transparent 22%, transparent 79%, hsl(var(--muted)/70%) 80%, hsl(var(--muted)/70%) 81%, transparent 82%, transparent), linear-gradient(90deg, transparent 19%, hsl(var(--muted)/70%) 20%, hsl(var(--muted)/70%) 21%, transparent 22%, transparent 79%, hsl(var(--muted)/70%) 80%, hsl(var(--muted)/70%) 81%, transparent 82%, transparent), linear-gradient(45deg, transparent 50%, hsl(var(--muted)/60%) 51%, hsl(var(--muted)/60%) 52%, transparent 53%)", // Diagonal lines for subtle pattern
          }}
        />
      </div>
    </div>
  );
}
