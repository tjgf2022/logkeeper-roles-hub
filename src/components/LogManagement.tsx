import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  User,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogManagementProps {
  currentUser: {
    name: string;
    role: 'super' | 'admin' | 'user';
  };
  onNavigate: (path: string) => void;
}

// 模拟日志数据
const mockLogs = [
  {
    id: 1,
    title: "完成项目需求分析报告",
    content: "针对新项目进行了详细的需求分析，整理了功能清单和技术方案...",
    author: "张三",
    authorRole: "admin",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T14:20:00",
    status: "completed",
    priority: "high",
    tags: ["项目管理", "需求分析"]
  },
  {
    id: 2,
    title: "客户沟通会议纪要",
    content: "与客户讨论了产品功能细节，确认了交付时间节点...",
    author: "李四",
    authorRole: "user",
    createdAt: "2024-01-14T16:45:00",
    updatedAt: "2024-01-14T17:30:00",
    status: "in_progress",
    priority: "medium",
    tags: ["客户沟通", "会议"]
  },
  {
    id: 3,
    title: "代码审查和优化建议",
    content: "对核心模块进行了代码审查，发现了几个性能优化点...",
    author: "王五",
    authorRole: "admin",
    createdAt: "2024-01-13T09:15:00",
    updatedAt: "2024-01-13T11:45:00",
    status: "pending",
    priority: "low",
    tags: ["代码审查", "优化"]
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

export function LogManagement({ currentUser, onNavigate }: LogManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const { toast } = useToast();

  const canEditAll = currentUser.role === 'super' || currentUser.role === 'admin';

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || log.priority === priorityFilter;
    
    // 普通用户只能看到自己的日志
    const canView = canEditAll || log.author === currentUser.name;
    
    return matchesSearch && matchesStatus && matchesPriority && canView;
  });

  const handleEdit = (logId: number) => {
    toast({
      title: "编辑日志",
      description: `正在编辑日志 ID: ${logId}`,
    });
    onNavigate(`/logs/edit/${logId}`);
  };

  const handleDelete = (logId: number) => {
    toast({
      title: "删除日志",
      description: "日志删除功能需要后端支持",
      variant: "destructive",
    });
  };

  const handleView = (logId: number) => {
    onNavigate(`/logs/view/${logId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">工作日志管理</h1>
          <p className="text-muted-foreground mt-1">
            管理和查看工作日志记录
          </p>
        </div>
        <Button 
          onClick={() => onNavigate('/logs/new')}
          className="bg-gradient-primary hover:shadow-glow transition-smooth"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建新日志
        </Button>
      </div>

      {/* 搜索和过滤器 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>搜索和筛选</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索日志标题、内容或作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="in_progress">进行中</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="优先级筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">高优先级</SelectItem>
                <SelectItem value="medium">中优先级</SelectItem>
                <SelectItem value="low">低优先级</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
            >
              清除筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 日志列表 */}
      <div className="grid gap-4">
        {filteredLogs.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">暂无日志记录</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? '没有找到符合条件的日志' 
                  : '还没有创建任何日志'}
              </p>
              <Button onClick={() => onNavigate('/logs/new')}>
                <Plus className="w-4 h-4 mr-2" />
                创建第一个日志
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="shadow-card hover:shadow-elegant transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2 truncate">{log.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {log.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {log.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Badge className={getStatusColor(log.status)}>
                      {getStatusText(log.status)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(log.priority)}
                    >
                      {log.priority === 'high' ? '高' : log.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{log.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>创建: {formatDate(log.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleView(log.id)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    查看
                  </Button>
                  
                  {(canEditAll || log.author === currentUser.name) && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(log.id)}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                  )}
                  
                  {canEditAll && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(log.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      删除
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}