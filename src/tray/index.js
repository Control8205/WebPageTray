const { Tray, Menu } = require('electron');
const path = require('path');
const appConfig = require('../../config/appConfig.json');

module.exports = (app, openWebPage) => {
    let tray = new Tray(path.join(__dirname, '../../public/images/favicon.ico'));
    let trayMenuTemplate = appConfig.menu.map(menuitem => ({
        label: `${menuitem.label}`,
        click: () => {
            if (menuitem.url != "#") {
                openWebPage(menuitem.url)
            }
        }
    }));

    trayMenuTemplate.push({ type: 'separator' }); //分割线

    trayMenuTemplate.push({
        label: '退出',
        click: () => {
            app.isQuiting = true;
            app.quit();
        }
    });

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
    tray.setToolTip('吉奥云渲染管理平台');
    tray.setContextMenu(trayMenu);

    tray.on('double-click', () => {
        openWebPage(appConfig.menu[0].url);
    });
};
