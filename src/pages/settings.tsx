import React from 'react';

export function SettingsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-card border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and security.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">Toggle application theme</p>
            </div>
            <button className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
              Toggle
            </button>
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">Manage your alerts and emails</p>
            </div>
            <button className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
