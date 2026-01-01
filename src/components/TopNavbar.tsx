import { Mountain, LayoutDashboard, Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNavbar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#111827] border-b border-border">

      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
            <Mountain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              GLOF Intelligence
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">
              Glacier Lake Monitoring
            </p>
          </div>
        </div>

        {/* Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={`
                  gap-2 h-9 px-4 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/50">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[11px] text-muted-foreground font-medium">Live</span>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
