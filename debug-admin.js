// 璋冭瘯鑴氭湰锛氭鏌ョ鐞嗗憳鏉冮檺鐩稿叧鐘舵€?console.log('===== 绠＄悊鍛樻潈闄愯皟璇曚俊鎭?=====');

// 1. 妫€鏌ocalStorage涓殑鐢ㄦ埛鏁版嵁
const userData = localStorage.getItem('user');
console.log('localStorage涓殑鐢ㄦ埛鏁版嵁:', userData);

// 2. 瑙ｆ瀽鐢ㄦ埛鏁版嵁骞舵鏌ヨ鑹?if (userData) {
  const user = JSON.parse(userData);
  console.log('鐢ㄦ埛瑙掕壊:', user.roles);
  console.log('鐢ㄦ埛缁?', user.groups);
  console.log('鏄惁鍖呭惈admin瑙掕壊:', user.roles && user.roles.includes('admin'));
}

// 3. 鎵嬪姩妯℃嫙App.vue涓殑isAdmin璁＄畻
const simulateIsAdmin = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  
  const user = JSON.parse(userStr);
  return user.roles && user.roles.includes('admin');
};

console.log('妯℃嫙鐨刬sAdmin鍊?', simulateIsAdmin());

// 4. 妫€鏌ヨ矾鐢遍厤缃腑鐨勭鐞嗗憳椤甸潰
console.log('璇风‘淇濅互admin鐢ㄦ埛韬唤鐧诲綍鍚庢煡鐪嬫淇℃伅');
