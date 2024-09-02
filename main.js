const { app } = require("electron");
const createTray = require("./src/tray");
const server = require("./src/server");
const openWebPage = require("electron").shell.openExternal; // 用于打开外部浏览器
const appConfig = require("./config/appConfig.json");
const path = require("path");

module.exports = function bootstrap(k) {
  // sanity check
  if (!Array.isArray(k) || k.length === 0) {
    throw new Error("Failed to bootstrap application.");
  }

  // key should be valid at this point, but you can access it here to perform additional checks.
  console.log("decryption key: " + k);

  // start the app
  app
    .whenReady()
    .then(() => {
      mainProcess();
    })
    .catch(console.log);
};

const mainProcess = () => {
  let configPath;
  if (process.env.PORTABLE_EXECUTABLE_DIR) {
    // 在打包后的环境中使用 PORTABLE_EXECUTABLE_DIR
    const exePath = process.env.PORTABLE_EXECUTABLE_DIR;
    configPath = path.join(exePath, "config.json");
  } else {
    // 在开发环境中使用项目目录中的路径
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
      configPath = path.join(__dirname, "config/config.json");
    } else {
      //非开发环境下，未从porable入口进入，直接退出。防止解包asar文件运行
      app.quit();
    }
  }
  console.log("configPath", configPath);

  server.start(configPath); // 启动服务
  openWebPage(appConfig.menu[0].url); // 打开配置中的第一个菜单项的URL
  createTray(app, openWebPage); // 创建系统托盘
};

app.on("window-all-closed", () => {
  // 在Electron中，通常所有窗口关闭时会退出应用。
  // 由于我们没有主窗口，不需要执行任何操作，这可以防止应用退出。
});

if (!app.isPackaged) {
  // start the app
  app.whenReady().then(() => {
    mainProcess();
  });
}
