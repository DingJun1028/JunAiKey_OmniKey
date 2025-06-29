"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var greet_1 = require("./greet");
function main() {
    console.log('🚀 JunAiKey_OmniKey TypeScript 專案啟動！');
    var user = process.env.USER || '世界';
    console.log((0, greet_1.greet)(user));
}
main();
