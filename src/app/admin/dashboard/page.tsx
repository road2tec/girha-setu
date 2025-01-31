import {
  HomeIcon,
  ListIcon,
  UsersIcon,
  BellIcon,
  SettingsIcon,
  MessageSquareIcon,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Total Listings */}
        <div className="card bg-base-300 shadow-lg p-4 flex items-center gap-4">
          <ListIcon className="w-10 h-10 text-primary" />
          <div>
            <h2 className="text-lg font-medium">Total Listings</h2>
            <p className="text-gray-500">120 Properties</p>
          </div>
        </div>

        {/* Card 2 - Total Users */}
        <div className="card bg-base-300 shadow-lg p-4 flex items-center gap-4">
          <UsersIcon className="w-10 h-10 text-secondary" />
          <div>
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-gray-500">345 Registered</p>
          </div>
        </div>

        {/* Card 3 - Messages */}
        <div className="card bg-base-300 shadow-lg p-4 flex items-center gap-4">
          <MessageSquareIcon className="w-10 h-10 text-accent" />
          <div>
            <h2 className="text-lg font-medium">Messages</h2>
            <p className="text-gray-500">23 Unread</p>
          </div>
        </div>

        {/* Card 4 - Notifications */}
        <div className="card bg-base-300 shadow-lg p-4 flex items-center gap-4">
          <BellIcon className="w-10 h-10 text-warning" />
          <div>
            <h2 className="text-lg font-medium">Notifications</h2>
            <p className="text-gray-500">5 New</p>
          </div>
        </div>

        {/* Card 5 - Settings */}
        <div className="card bg-base-300 shadow-lg p-4 flex items-center gap-4">
          <SettingsIcon className="w-10 h-10 text-error" />
          <div>
            <h2 className="text-lg font-medium">Settings</h2>
            <p className="text-gray-500">Manage Preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
