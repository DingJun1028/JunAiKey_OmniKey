"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuneEngravingSystem = void 0;
var RuneEngravingSystem = /** @class */ (function () {
    function RuneEngravingSystem() {
        this.runes = [];
    }
    /**
     * 創建一個新的符文
     * @param name 符文名稱
     * @param effect 符文效果
     * @returns Rune 符文物件
     */
    RuneEngravingSystem.prototype.engraveRune = function (name, effect) {
        var rune = {
            id: "rune_".concat(Date.now()),
            name: name,
            effect: effect,
            engravedAt: new Date().toISOString()
        };
        this.runes.push(rune);
        return rune;
    };
    /**
     * 取得所有符文
     * @returns Rune[]
     */
    RuneEngravingSystem.prototype.getAllRunes = function () {
        return this.runes;
    };
    return RuneEngravingSystem;
}());
exports.RuneEngravingSystem = RuneEngravingSystem;
