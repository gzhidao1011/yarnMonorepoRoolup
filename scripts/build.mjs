import { execa } from "execa";
import fs from "fs";
// const execa = require('execa')
// 获取打包目录
const dirs = fs.readdirSync("packages").filter((path) => {
  if (!fs.statSync(`packages/${path}`).isDirectory()) {
    return false;
  }
  return true;
});
console.log("🚀 ~ file: build.js:9 ~ dirs ~ dirs:", dirs);
async function build(target) {
  console.log("🚀 ~ file: build.js:12 ~ build ~ target:", target);
  // execa -c 执行rullop配置 环境变量 -env
  await execa("rollup", ["-c", "--environment", [`TARGET:${target}`].filter(Boolean).join(","),'--bundleConfigAsCjs'], {
    stdio: "inherit", // 子进程的输出在父包中输出
  });
}
// 并行打包
async function runParaller(dirs, itemBuildFn) {
  const results = [];
  for (let item of dirs) {
    results.push(itemBuildFn(item));
  }
  return Promise.all(results);
}
runParaller(dirs, build).then(() => {
  console.log("打包成功");
});
