# WebPageTray

## 安装使用

### 环境要求

运行之前确保机器上有以下环境：
- Node 18 以上的环境
- Python3.x 以上的环境 3.12以下的环境(代码加密的库asarmore引用了node-gyp，3.12的环境会报错)


### 安装依赖

```bash
npm install
```

### 运行项目

```bash
npm run serve
```

### 打包项目

首先需要全局安装electron-builder，执行以下命令进行安装：

```bash
npm install -g electron-builder
```

然后执行以下命令进行打包：
```bash
npm run build
```

- 打包过程中会自动将main.js和src目录下的所有js文件进行代码混淆，并以混淆后的代码进行打包

- 打包后可以看见一个exe文件和win-unpacked目录，exe文件可以直接运行，win-unpacked目录下是打包后的所有文件。win-unpacked目录下的内容是执行单个exe时在用户环境下解压临时目录的内容。
- 打包后目录中有一个config.json文件，请确保他存在且和exe文件同级，否则exe文件运行结果错误。
