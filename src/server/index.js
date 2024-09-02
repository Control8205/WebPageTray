const express = require("express");
const path = require("path");
const appConfig = require("../../config/appConfig.json");
const electron = require("electron");
const app = express();

exports.start = (configPath) => {
  // 配置静态文件服务
  if (process.env.NODE_ENV === "development") {
    app.use(express.static(path.join(__dirname, "../../public")));
  } else {
    app.use(express.static(path.join(process.resourcesPath, "./public")));
  }

  app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, "../../public/index.html"));
    if (process.env.NODE_ENV === "development") {
      res.sendFile(path.join(__dirname, "../../public/index.html"));
    } else {
      res.sendFile(path.join(process.resourcesPath, "./public/index.html"));
    }
  });

  app.get("/config", (req, res) => {
    console.log("Config path:", configPath);
    res.sendFile(configPath, (err) => {
      if (err) {
        console.error("Error sending config file:", err);
        res.status(500).send("Error reading config file");
      }
    });
  });
  app.get("/test", (req, res) => {
    // 路径测试
    let electronApp = electron.app;
    const exePath = electronApp.getPath("exe");
    const rootPath = path.dirname(exePath);
    const paths = {
      "process.execPath": process.execPath,
      "path.dirname(process.execPath)": path.dirname(process.execPath),
      "process.resourcesPath": process.resourcesPath,
      'app.getPath("home")': electronApp.getPath("home"),
      'app.getPath("appData")': electronApp.getPath("appData"),
      'app.getPath("userData")': electronApp.getPath("userData"),
      'app.getPath("temp")': electronApp.getPath("temp"),
      "process.cwd()": process.cwd(),
      rootPath: rootPath,
      'path.join(process.resourcesPath, "./public/index.html")': path.join(process.resourcesPath, "./public/index.html"),
      "process.env.PORTABLE_EXECUTABLE_DIR":
        process.env.PORTABLE_EXECUTABLE_DIR,
    };

    res.json(paths); // 将路径信息作为JSON对象发送
  });

  app.listen(appConfig.server.port, () => {
    console.log(`Server running on http://localhost:${appConfig.server.port}`);
  });
};
