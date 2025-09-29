import { supabase } from '@/integrations/supabase/client';

interface DemoUser {
  email: string;
  password: string;
  username: string;
  role: 'super' | 'admin' | 'user';
}

export const demoUsers: DemoUser[] = [
  {
    email: 'super@worklog.com',
    password: 'super601',
    username: '张超管',
    role: 'super'
  },
  {
    email: 'admin@worklog.com', 
    password: 'admin201',
    username: '李管理',
    role: 'admin'
  },
  {
    email: 'user@worklog.com',
    password: '201201',
    username: '王员工',
    role: 'user'
  }
];

export const createDemoUsers = async () => {
  const results: Array<{ user: DemoUser; success: boolean; error?: string }> = [];
  
  for (const demoUser of demoUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: demoUser.email,
        password: demoUser.password,
        options: {
          data: {
            username: demoUser.username,
            role: demoUser.role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      results.push({
        user: demoUser,
        success: !error,
        error: error?.message,
      });
    } catch (err) {
      results.push({
        user: demoUser,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
  
  return results;
};

export const getDemoUserByCredentials = (email: string, password: string) => {
  return demoUsers.find(user => user.email === email && user.password === password);
};