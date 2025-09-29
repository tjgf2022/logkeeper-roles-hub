import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { demoUsers, createDemoUsers } from "@/services/demoUsers";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "请输入邮箱和密码",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "登录失败",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "登录成功",
          description: "欢迎回来！",
        });
        onLoginSuccess();
      }
    } catch (error) {
      toast({
        title: "登录失败", 
        description: "发生未知错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    
    setIsLoading(true);
    try {
      const { data, error } = await signIn(demoUser.email, demoUser.password);
      
      if (error) {
        toast({
          title: "快速登录失败",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "快速登录成功",
          description: `以${demoUser.username}身份登录`,
        });
        onLoginSuccess();
      }
    } catch (error) {
      toast({
        title: "快速登录失败",
        description: "发生未知错误", 
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemoUsers = async () => {
    setIsCreatingUsers(true);
    try {
      const results = await createDemoUsers();
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: "演示用户创建完成",
        description: `成功创建 ${successful} 个用户${failed > 0 ? `，${failed} 个失败` : ''}`,
      });
    } catch (error) {
      toast({
        title: "创建演示用户失败",
        description: "请检查网络连接或数据库配置",
        variant: "destructive",
      });
    } finally {
      setIsCreatingUsers(false);
    }
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
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">快速体验</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCreateDemoUsers}
                  disabled={isCreatingUsers}
                  className="text-xs h-8 px-2"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {isCreatingUsers ? "创建中..." : "创建演示用户"}
                </Button>
              </div>
              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.role}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => quickLogin(user)}
                    disabled={isLoading}
                  >
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email} - 密码: {user.password}
                      </div>
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