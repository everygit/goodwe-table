console.log("版本校验");

var versionBuild = require('./version');
var versionPublish = require('../package.json').version;

console.log("已编译版本：" + versionBuild);
console.log("要发布版本：" + versionPublish);

if(versionBuild !== versionPublish) {
    throw new Error("版本不一致");
} else {
    console.log('验证通过，正在发布');
}