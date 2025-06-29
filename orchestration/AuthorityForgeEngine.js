"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorityForgeEngine = void 0;
var AuthorityForgeEngine = /** @class */ (function () {
    function AuthorityForgeEngine() {
        this.authorities = [];
    }
    /**
     * 創建一個新的權限物件
     * @param type 權限類型
     * @param permissions 權限清單
     * @returns Authority 權限物件
     */
    AuthorityForgeEngine.prototype.forgeAuthority = function (type, permissions) {
        var authority = {
            id: "auth_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8)),
            type: type,
            permissions: permissions,
            createdAt: new Date().toISOString()
        };
        this.authorities.push(authority);
        return authority;
    };
    /**
     * 取得所有權限物件
     * @returns Authority[]
     */
    AuthorityForgeEngine.prototype.getAllAuthorities = function () {
        return this.authorities;
    };
    /**
     * 根據 id 查詢權限物件
     * @param id 權限 id
     * @returns Authority | undefined
     */
    AuthorityForgeEngine.prototype.getAuthorityById = function (id) {
        return this.authorities.find(function (a) { return a.id === id; });
    };
    /**
     * 移除權限物件
     * @param id 權限 id
     * @returns boolean 是否成功移除
     */
    AuthorityForgeEngine.prototype.removeAuthority = function (id) {
        var idx = this.authorities.findIndex(function (a) { return a.id === id; });
        if (idx >= 0) {
            this.authorities.splice(idx, 1);
            return true;
        }
        return false;
    };
    /**
     * 將多個權限鍛造成一個模組化能力（能力鍛造）
     * @param ids 權限 id 陣列
     * @param moduleType 模組化能力類型
     * @returns Authority 模組化能力物件
     */
    AuthorityForgeEngine.prototype.forgeModule = function (ids, moduleType) {
        var _this = this;
        var permissions = [];
        ids.forEach(function (id) {
            var auth = _this.getAuthorityById(id);
            if (auth) {
                permissions.push.apply(permissions, auth.permissions);
            }
        });
        return this.forgeAuthority(moduleType, Array.from(new Set(permissions)));
    };
    return AuthorityForgeEngine;
}());
exports.AuthorityForgeEngine = AuthorityForgeEngine;
