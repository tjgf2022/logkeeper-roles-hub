import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield } from "lucide-react";

interface LoginFormProps {
  onLogin: (user: { name: string; role: 'super' | 'admin' | 'user' }) => void;
}

const demoUsers = [
  { name: "张超管", role: 'super' as const, description: "超级管理员 - 全部权限" },
  { name: "李管理", role: 'admin' as const, description: "管理员 - 部分管理权限" },
  { name: "王员工", role: 'user' as const, description: "普通用户 - 基础权限" },
];

export function LoginForm({ onLogin }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<'super' | 'admin' | 'user'>('user');
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "请输入用户名",
        variant: "destructive",
      });
      return;
    }

    const user = { name: username, role: selectedRole };
    onLogin(user);
    
    toast({
      title: "登录成功",
      description: `欢迎回来，${user.name}！`,
    });
  };

  const quickLogin = (demoUser: typeof demoUsers[0]) => {
    setUsername(demoUser.name);
    setSelectedRole(demoUser.role);
    onLogin(demoUser);
    
    toast({
      title: "快速登录成功",
      description: `以${demoUser.description}身份登录`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            工作日志系统
          </h1>
          <p className="text-muted-foreground">请登录以访问您的工作台</p>
        </div>

        <Card className="shadow-elegant backdrop-blur-sm bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LogIn className="w-5 h-5" />
              <span>用户登录</span>
            </CardTitle>
            <CardDescription>
              输入用户信息或使用快速登录体验不同权限
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">权限等级</Label>
                <Select value={selectedRole} onValueChange={(value: 'super' | 'admin' | 'user') => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择权限等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">普通用户</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="super">超级管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
              >
                登录
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-3">快速体验</p>
              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.role}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => quickLogin(user)}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}