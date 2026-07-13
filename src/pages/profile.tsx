import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Role } from '@/types/auth';
import { ROLES } from '@/config/roles';

export function ProfilePage() {
  const { user, updateUserRole } = useAuth();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="bg-card border rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
          <p className="text-lg">{user?.displayName || 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
          <p className="text-lg font-semibold text-primary">{user?.role}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
          <p className="text-lg">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {/* This is a temporary feature for Phase 3 testing to switch roles */}
        <div className="pt-6 mt-6 border-t">
          <h3 className="text-md font-medium mb-3">Testing: Switch Role</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(ROLES).map((role) => (
              <button
                key={role}
                onClick={() => updateUserRole(role as Role)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  user?.role === role
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: This is for local testing of RBAC only. In a production app, roles would be
            managed by an admin.
          </p>
        </div>
      </div>
    </div>
  );
}
