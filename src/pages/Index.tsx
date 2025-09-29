import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Navigation } from "@/components/ui/navigation";
import { Dashboard } from "@/components/Dashboard";
import { LogManagement } from "@/components/LogManagement";
import { UserManagement } from "@/components/UserManagement";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const { user, profile, loading, signOut } = useAuth();

  const handleLoginSuccess = () => {
    setCurrentPath('/dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPath('/dashboard');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow animate-pulse">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Create a compatible user object for existing components
  const currentUser = {
    name: profile.username,
    role: profile.role,
  };

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
