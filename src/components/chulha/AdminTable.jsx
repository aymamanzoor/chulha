import { cn } from "@/lib/utils";

export function AdminTable({ columns, children }) {
  return (
    <div className="card-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="bg-muted text-left text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusPill({ status }) {
  const tone =
    status === "Active" || status === "Approved" || status === "Published"
      ? "bg-success/15 text-success"
      : status === "Suspended" || status === "Open" || status === "Removed"
        ? "bg-destructive/12 text-destructive"
        : "bg-warning/20 text-warning-foreground";

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", tone)}>{status}</span>
  );
}

export function StatsCard({ label, value, change }) {
  const positive = change?.startsWith("+");
  return (
    <div className="card-soft p-5">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {change && (
        <p className={cn("mt-1 text-xs", positive ? "text-success" : "text-destructive")}>
          {change} vs last month
        </p>
      )}
    </div>
  );
}
