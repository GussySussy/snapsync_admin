import { Button } from "../../components/ui/button";
import DashboardLayout from "./layout";

// filepath: d:\Projects\Development\snapsync_admin\src\app\dashboard\page.tsx

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="text-gray-700">
        Use the sidebar to navigate through different sections of the dashboard.
      </p>
      <Button>
        <h2>Button</h2>
      </Button>
    </div>
  );
}
