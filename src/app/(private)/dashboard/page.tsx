import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your tasks and projects.",
};

const stats = [
  { label: "Total Tasks", value: "12" },
  { label: "Completed", value: "8" },
  { label: "In Progress", value: "3" },
  { label: "Overdue", value: "1" },
];

const DashboardPage = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-6">
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back! Here&apos;s your overview.
        </p>
      </div>
    </header>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-normal">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-medium">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <p>No recent activity to show. Start by creating a task.</p>
      </CardContent>
    </Card>
  </div>
);

export default DashboardPage;
