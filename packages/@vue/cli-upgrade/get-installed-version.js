const path = require("path");
const getPackageJson = require("./get-package-json");

// 获得安装模块的版本信息
module.exports = function getInstalledVersion(packageName) {
  try {
    const packageJson = getPackageJson(
      path.resolve(process.cwd(), "node_modules", packageName)
    );
    return packageJson.version;
  } catch (e) {
    return "N/A";
  }
};
