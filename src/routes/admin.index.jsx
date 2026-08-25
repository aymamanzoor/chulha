import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";

import { AdminShell } from "@/components/chulha/AdminShell";
import { StatsCard } from "@/components/chulha/AdminTable";
import { Button } from "@/components/ui/button";
import { adminChart as mockChart, adminStats as mockStats } from "@/lib/mock-data";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

function ChartCard({ title, children }) {
  return (
    <section className="card-soft p-5">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const tooltipStyle = {
  contentStyle: {
    borderRadius: "1rem",
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    color: "var(--color-foreground)",
    fontSize: 12,
  },
};

function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [chartData, setChartData] = useState(mockChart);

  useEffect(() => {
    api
      .getAdminStats()
      .then((res) => {
        if (res?.stats && res.stats.length > 0) {
          setStats(res.stats);
        }
        if (res?.chart && res.chart.length > 0) {
          setChartData(res.chart);
        }
      })
      .catch(() => {
        // Fallback to mock data
      });
  }, []);

  const handleExport = () => {
    let csv = "--- SUMMARY STATS ---\n";
    csv += "Metric,Value,Change\n";
    stats.forEach((s) => {
      const val = String(s.value).replace(/,/g, "");
      csv += `${s.label},${val},${s.change}\n`;
    });

    csv += "\n--- MONTHLY TRENDS ---\n";
    if (chartData.length > 0) {
      const keys = Object.keys(chartData[0]);
      csv += keys.join(",") + "\n";
      chartData.forEach((row) => {
        csv += keys.map((k) => row[k]).join(",") + "\n";
      });
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `chulha_admin_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: show a small toast or notification if we had 'toast' imported
    // For now, it just smoothly triggers the download.
  };

  return (
    <AdminShell
      title="Dashboard"
      description="How the Chulha community is growing this year."
      actions={<Button variant="outline" onClick={handleExport}>Export report</Button>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="New users">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartCard>

          <ChartCard title="Recipes created">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="recipes" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Daily posts">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="var(--color-chart-4)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="User engagement (%)">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="var(--color-chart-3)"
                fill="var(--color-chart-3)"
                fillOpacity={0.18}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartCard>
        </div>
      </div>
    </AdminShell>
  );
}
