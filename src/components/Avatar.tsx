// Simple initials-based avatar. Swap for real images later by adding an
// <img> branch when profiles.avatar_url is populated.
export default function Avatar({
  username,
  size = "sm",
}: {
  username: string;
  size?: "sm" | "md";
}) {
  const initials = username.slice(0, 2).toUpperCase();
  const dims = size === "md" ? "h-9 w-9 text-sm" : "h-6 w-6 text-[10px]";

  return (
    <div
      className={`flex ${dims} shrink-0 items-center justify-center rounded-full bg-violet-50 font-semibold text-violet-700 ring-1 ring-violet-100`}
    >
      {initials}
    </div>
  );
}
