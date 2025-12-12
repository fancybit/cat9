﻿// 绠€鍗曟祴璇曟ā鍧楀姞杞?
console.log('寮€濮嬫祴璇曟ā鍧楀姞杞?..');

try {
  const { MetaJadeNode } = require('./metajade-csharp/MetaJadeNode/nodejs');
  console.log('鉁?妯″潡鍔犺浇鎴愬姛');
  console.log('鉁?MetaJadeNode绫?', typeof MetaJadeNode);
} catch (error) {
  console.error('妯″潡鍔犺浇澶辫触:', error);
  console.error('閿欒璇︽儏:', error.stack);
}
