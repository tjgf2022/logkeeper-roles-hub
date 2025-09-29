import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Users,
  Shield,
  ShieldCheck,
  Crown,
  Calendar,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserManagementProps {
  currentUser: {
    name: string;
    role: 'super' | 'admin' | 'user';
  };
}

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: "张超管",
    email: "super@company.com",
    role: "super" as const,
    status: "active",
    lastLogin: "2024-01-15T10:30:00",
    createdAt: "2023-12-01T09:00:00",
    logsCount: 45,
    department: "技术部"
  },
  {
    id: 2,
    name: "李管理",
    email: "admin@company.com", 
    role: "admin" as const,
    status: "active",
    lastLogin: "2024-01-14T16:45:00",
    createdAt: "2023-12-05T14:20:00",
    logsCount: 32,
    department: "产品部"
  },
  {
    id: 3,
    name: "王员工",
    email: "user1@company.com",
    role: "user" as const,
    status: "active",
    lastLogin: "2024-01-13T09:15:00",
    createdAt: "2024-01-02T11:30:00",
    logsCount: 18,
    department: "技术部"
  },
  {
    id: 4,
    name: "赵开发",
    email: "user2@company.com",
    role: "user" as const,
    status: "inactive",
    lastLogin: "2024-01-10T14:22:00",
    createdAt: "2024-01-03T16:45:00",
    logsCount: 8,
    department: "技术部"
  },
  {
    id: 5,
    name: "钱设计",
    email: "user3@company.com",
    role: "user" as const,
    status: "active",
    lastLogin: "2024-01-14T18:30:00",
    createdAt: "2024-01-05T10:15:00",
    logsCount: 12,
    department: "设计部"
  }
];

const roleLabels = {
  super: '超级管理员',
  admin: '管理员',
  user: '普通用户'
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'super':
      return Crown;
    case 'admin':
      return ShieldCheck;
    case 'user':
      return Shield;
    default:
      return Shield;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'super':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    case 'admin':
      return 'bg-primary text-primary-foreground';
    case 'user':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-success text-success-foreground';
    case 'inactive':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '活跃';
    case 'inactive':
      return '非活跃';
    default:
      return '未知';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

export function UserManagement({ currentUser }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const canManageUsers = currentUser.role === 'super' || currentUser.role === 'admin';
  const canManageAdmins = currentUser.role === 'super';

  if (!canManageUsers) {
    return (
      <div className="text-center py-20">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">访问受限</h2>
        <p className="text-muted-foreground">您没有权限访问用户管理功能</p>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    // 管理员不能管理超级管理员
    const canManage = canManageAdmins || user.role !== 'super';
    
    return matchesSearch && matchesRole && matchesStatus && canManage;
  });

  const handleEdit = (userId: number) => {
    toast({
      title: "编辑用户",
      description: `正在编辑用户 ID: ${userId}`,
    });
  };

  const handleDelete = (userId: number) => {
    toast({
      title: "删除用户",
      description: "用户删除功能需要后端支持",
      variant: "destructive",
    });
  };

  const handleAddUser = () => {
    toast({
      title: "添加用户",
      description: "添加用户功能需要后端支持",
    });
  };

  const handleChangeRole = (userId: number, newRole: string) => {
    toast({
      title: "角色变更",
      description: `用户角色变更功能需要后端支持`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">用户管理</h1>
          <p className="text-muted-foreground mt-1">
            管理系统用户和权限设置
          </p>
        </div>
        {canManageAdmins && (
          <Button 
            onClick={handleAddUser}
            className="bg-gradient-primary hover:shadow-glow transition-smooth"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加用户
          </Button>
        )}
      </div>

      {/* 搜索和过滤器 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>搜索和筛选</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、邮箱或部门..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="角色筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="user">普通用户</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                {canManageAdmins && <SelectItem value="super">超级管理员</SelectItem>}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
            >
              清除筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 用户统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">总用户数</p>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">活跃用户</p>
                <p className="text-2xl font-bold">
                  {mockUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">管理员</p>
                <p className="text-2xl font-bold">
                  {mockUsers.filter(u => u.role === 'admin' || u.role === 'super').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">本月新增</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户列表 */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              
              return (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-smooth"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <Badge className={getRoleColor(user.role)}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleLabels[user.role]}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusText(user.status)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{user.email}</p>
                        <div className="flex items-center space-x-4">
                          <span>部门: {user.department}</span>
                          <span>日志: {user.logsCount}篇</span>
                          <span>最后登录: {formatDate(user.lastLogin)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {canManageAdmins && (
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleChangeRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">普通用户</SelectItem>
                          <SelectItem value="admin">管理员</SelectItem>
                          <SelectItem value="super">超级管理员</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(user.id)}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    
                    {canManageAdmins && user.id !== 1 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        删除
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}