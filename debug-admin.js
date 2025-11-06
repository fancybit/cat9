// 调试脚本：检查管理员权限相关状态
console.log('===== 管理员权限调试信息 =====');

// 1. 检查localStorage中的用户数据
const userData = localStorage.getItem('user');
console.log('localStorage中的用户数据:', userData);

// 2. 解析用户数据并检查角色
if (userData) {
  const user = JSON.parse(userData);
  console.log('用户角色:', user.roles);
  console.log('用户组:', user.groups);
  console.log('是否包含admin角色:', user.roles && user.roles.includes('admin'));
}

// 3. 手动模拟App.vue中的isAdmin计算
const simulateIsAdmin = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  
  const user = JSON.parse(userStr);
  return user.roles && user.roles.includes('admin');
};

console.log('模拟的isAdmin值:', simulateIsAdmin());

// 4. 检查路由配置中的管理员页面
console.log('请确保以admin用户身份登录后查看此信息');