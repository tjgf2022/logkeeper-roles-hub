import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Navigation } from "@/components/ui/navigation";
import { Dashboard } from "@/components/Dashboard";
import { LogManagement } from "@/components/LogManagement";
import { UserManagement } from "@/components/UserManagement";

type User = {
  name: string;
  role: 'super' | 'admin' | 'user';
};

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPath('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPath('/dashboard');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/dashboard':
        return <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />;
      case '/logs':
        return <LogManagement currentUser={currentUser} onNavigate={handleNavigate} />;
      case '/users':
        return <UserManagement currentUser={currentUser} />;
      case '/settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">系统设置</h2>
            <p className="text-muted-foreground">系统设置功能开发中...</p>
          </div>
        );
      default:
        return <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation
        currentUser={currentUser}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main className="md:ml-64 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
