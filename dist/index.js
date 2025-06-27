"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const greet_1 = require("./greet");
function main() {
    console.log('🚀 JunAiKey_OmniKey TypeScript 專案啟動！');
    const user = process.env.USER || '世界';
    console.log((0, greet_1.greet)(user));
}
main();
