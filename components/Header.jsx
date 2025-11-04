import ThemeToggle from "./ThemeToggle";
export default function Header() {
  return (
    <header className="flex items-center justify-between p-3">
      <div className="font-semibold text-lg">Operations Dashboard</div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
