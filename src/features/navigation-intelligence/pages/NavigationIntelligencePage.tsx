import { NavigationDashboard } from '../components/NavigationDashboard';
import { NavigationChat } from '../components/NavigationChat';
import { StaffClosurePanel } from '../components/StaffClosurePanel';

export default function NavigationIntelligencePage() {
  return (
    <div className="h-full bg-slate-950 flex flex-col gap-8 p-4 overflow-y-auto">
      <NavigationDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
        <NavigationChat />
        <StaffClosurePanel />
      </div>
    </div>
  );
}
