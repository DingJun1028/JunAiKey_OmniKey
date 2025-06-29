export class RuneEngravingSystem {
    constructor() {
        this.runes = [];
    }
    /**
     * 創建一個新的符文
     * @param name 符文名稱
     * @param effect 符文效果
     * @returns Rune 符文物件
     */
    engraveRune(name, effect) {
        const rune = {
            id: `rune_${Date.now()}`,
            name,
            effect,
            engravedAt: new Date().toISOString()
        };
        this.runes.push(rune);
        return rune;
    }
    /**
     * 取得所有符文
     * @returns Rune[]
     */
    getAllRunes() {
        return this.runes;
    }
}
