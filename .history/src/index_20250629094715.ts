import { greet } from './greet';

function main() {
    console.log('🚀 JunAiKey_OmniKey TypeScript 專案啟動！');
    const user = process.env.USER || '世界';
    console.log(greet(user));
}

main();
