import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  currentUser: {
    name: string;
    role: 'super' | 'admin' | 'user';
  };
  onNavigate: (path: string) => void;
}

// 模拟数据
const mockStats = {
  totalLogs: 156,
  todayLogs: 8,
  totalUsers: 24,
  activeUsers: 18,
  completionRate: 92,
};

const mockRecentLogs = [
  {
    id: 1,
    title: "完成项目需求分析",
    author: "张三",
    time: "2小时前",
    status: "completed",
    priority: "high"
  },
  {
    id: 2,
    title: "客户沟通会议纪要",
    author: "李四",
    time: "4小时前",
    status: "in_progress",
    priority: "medium"
  },
  {
    id: 3,
    title: "代码review和优化建议",
    author: "王五",
    time: "6小时前",
    status: "pending",
    priority: "low"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success text-success-foreground';
    case 'in_progress':
      return 'bg-warning text-warning-foreground';
    case 'pending':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return '已完成';
    case 'in_progress':
      return '进行中';
    case 'pending':
      return '待处理';
    default:
      return '未知';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'border-destructive text-destructive';
    case 'medium':
      return 'border-warning text-warning';
    case 'low':
      return 'border-muted-foreground text-muted-foreground';
    default:
      return 'border-muted-foreground text-muted-foreground';
  }
};

export function Dashboard({ currentUser, onNavigate }: DashboardProps) {
  const canManageUsers = currentUser.role === 'super' || currentUser.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">仪表板</h1>
          <p className="text-muted-foreground mt-1">
            欢迎回来，{currentUser.name}！今天是 {new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
        <Button 
          onClick={() => onNavigate('/logs/new')}
          className="bg-gradient-primary hover:shadow-glow transition-smooth"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          创建日志
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总日志数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalLogs}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              较上周 +12%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日日志</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.todayLogs}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline w-3 h-3 mr-1" />
              活跃度良好
            </p>
          </CardContent>
        </Card>

        {canManageUsers && (
          <>
            <Card className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">用户总数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.activeUsers} 人在线
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">完成率</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1 text-success" />
                  表现优秀
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 最近日志 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>最近日志</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate('/logs')}
            >
              查看全部
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center space-x-4 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-smooth cursor-pointer"
                onClick={() => onNavigate(`/logs/${log.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{log.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">作者: {log.author}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(log.priority)}
                  >
                    {log.priority === 'high' ? '高' : log.priority === 'medium' ? '中' : '低'}
                  </Badge>
                  <Badge className={getStatusColor(log.status)}>
                    {getStatusText(log.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 快捷操作 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:shadow-card transition-smooth"
              onClick={() => onNavigate('/logs/new')}
            >
              <PlusCircle className="h-6 w-6" />
              <span className="text-sm">创建日志</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 hover:shadow-card transition-smooth"
              onClick={() => onNavigate('/logs')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">查看日志</span>
            </Button>
            
            {canManageUsers && (
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:shadow-card transition-smooth"
                onClick={() => onNavigate('/users')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">用户管理</span>
              </Button>
            )}
            
            {currentUser.role === 'super' && (
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2 hover:shadow-card transition-smooth"
                onClick={() => onNavigate('/settings')}
              >
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">系统设置</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}