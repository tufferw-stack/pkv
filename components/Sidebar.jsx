import {
  BarChart3,
  Settings,
  LayoutGrid,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
export default function Sidebar() {
  const Item = ({ icon: Icon, label, active }) => (
    <a
      className={
        "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 " +
        (active ? "bg-neutral-100 dark:bg-neutral-800" : "")
      }
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </a>
  );
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 gap-2 p-3">
      <div className="text-xl font-bold px-2 py-1">Ops Hub</div>
      <Item icon={LayoutGrid} label="Dashboard" active />
      <Item icon={ShoppingCart} label="Orders" />
      <Item icon={DollarSign} label="Accounting" />
      <Item icon={BarChart3} label="Reports" />
      <Item icon={Settings} label="Settings" />
      <div className="mt-auto text-xs text-neutral-500 px-2">v0.1 • local</div>
    </aside>
  );
}
