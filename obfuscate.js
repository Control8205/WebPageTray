//打包前对js代码进行混淆，避免可以通过asar解包获取源码

// 引入必要的模块
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// 定义源代码目录和输出目录
const srcDir = path.join(__dirname, 'src'); // 源代码目录
const outDir = path.join(__dirname, 'obfuscated/src'); // 输出目录

// 递归读取目录中的文件
function readDirRecursive(dir, filelist = []) {
  // 读取当前目录中的所有文件和子目录
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file); // 获取文件的完整路径

    // 检查当前路径是否为目录
    if (fs.statSync(filePath).isDirectory()) {
      // 如果是目录，则递归读取子目录
      readDirRecursive(filePath, filelist);
    } else {
      // 如果是文件，则将文件路径添加到文件列表中
      filelist.push(filePath);
    }
  });

  // 返回文件列表
  return filelist;
}

// 混淆源目录中的每个文件
readDirRecursive(srcDir).forEach(filePath => {
  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // 使用JavaScript Obfuscator对文件内容进行混淆
  const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
    // 具体的混淆配置选项
    compact: true, // 启用代码压缩
    controlFlowFlattening: true, // 启用控制流扁平化
    deadCodeInjection: true, // 启用死代码注入
    debugProtection: false, // 禁用调试保护
    disableConsoleOutput: true, // 禁用控制台输出
    identifierNamesGenerator: 'hexadecimal', // 标识符名称生成器设置为十六进制
    log: false, // 禁用日志
    renameGlobals: false, // 禁用全局变量重命名
    selfDefending: true, // 启用自我防御
    stringArray: true, // 启用字符串数组
    stringArrayEncoding: ['base64'], // 启用字符串数组编码（base64）
    stringArrayThreshold: 0.75, // 字符串数组混淆的阈值
    transformObjectKeys: true, // 启用对象键转换
    unicodeEscapeSequence: false // 禁用Unicode转义序列
  });

  // 获取相对于源目录的相对路径
  const relativePath = path.relative(srcDir, filePath);
  // 构建输出文件的完整路径
  const outputPath = path.join(outDir, relativePath);
  // 获取输出文件的目录路径
  const outputDir = path.dirname(outputPath);

  // 如果输出目录不存在，则创建它
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 将混淆后的代码写入输出文件
  fs.writeFileSync(outputPath, obfuscationResult.getObfuscatedCode(), 'utf8');
});
