// 更好的child_process模块
const execa = require("execa");

function getMaxSatisfying(packageName, range) {
  let version = JSON.parse(
    execa.shellSync(`npm view ${packageName}@${range} version --json`).stdout
  );

  // 如果模块多版本，则返回字符串列表第一个元素
  if (typeof version !== "string") {
    version = version[0];
  }

  return version;
}

// 针对模块的语言版本信息升级处理
module.exports = function getUpgradableVersion(
  packageName,
  currRange,
  semverLevel
) {
  let newRange;
  if (semverLevel === "patch") {
    const currMaxVersion = getMaxSatisfying(packageName, currRange);
    newRange = `~${currMaxVersion}`;
    const newMaxVersion = getMaxSatisfying(packageName, newRange);
    newRange = `~${newMaxVersion}`;
  } else if (semverLevel === "minor") {
    const currMaxVersion = getMaxSatisfying(packageName, currRange);
    newRange = `^${currMaxVersion}`;
    const newMaxVersion = getMaxSatisfying(packageName, newRange);
    newRange = `^${newMaxVersion}`;
  } else if (semverLevel === "major") {
    newRange = `^${getMaxSatisfying(packageName, "latest")}`;
  } else {
    throw new Error("Release type must be one of patch | minor | major!");
  }

  return newRange;
};
