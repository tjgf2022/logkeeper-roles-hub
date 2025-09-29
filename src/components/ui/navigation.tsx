import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  currentUser: {
    name: string;
    role: 'super' | 'admin' | 'user';
    avatar?: string;
  };
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const roleLabels = {
  super: '超级管理员',
  admin: '管理员', 
  user: '普通用户'
};

const navigationItems = [
  { 
    path: '/dashboard', 
    label: '仪表板', 
    icon: LayoutDashboard,
    roles: ['super', 'admin', 'user']
  },
  { 
    path: '/logs', 
    label: '工作日志', 
    icon: FileText,
    roles: ['super', 'admin', 'user']
  },
  { 
    path: '/users', 
    label: '用户管理', 
    icon: Users,
    roles: ['super', 'admin']
  },
  { 
    path: '/settings', 
    label: '系统设置', 
    icon: Settings,
    roles: ['super']
  },
];

export function Navigation({ currentUser, currentPath, onNavigate, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const NavigationContent = () => (
    <>
      <div className="p-6 border-b border-border/50">
        <h2 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
          工作日志系统
        </h2>
      </div>
      
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{roleLabels[currentUser.role]}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <li key={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-smooth",
                    isActive && "bg-primary text-primary-foreground shadow-elegant"
                  )}
                  onClick={() => {
                    onNavigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          退出登录
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-card border-r border-border/50 flex flex-col shadow-card transition-transform duration-300",
        "md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavigationContent />
      </aside>
    </>
  );
}