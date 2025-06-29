export class AuthorityForgeEngine {
    constructor() {
        this.authorities = [];
    }
    /**
     * 創建一個新的權限物件
     * @param type 權限類型
     * @param permissions 權限清單
     * @returns Authority 權限物件
     */
    forgeAuthority(type, permissions) {
        const authority = {
            id: `auth_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            type,
            permissions,
            createdAt: new Date().toISOString()
        };
        this.authorities.push(authority);
        return authority;
    }
    /**
     * 取得所有權限物件
     * @returns Authority[]
     */
    getAllAuthorities() {
        return this.authorities;
    }
    /**
     * 根據 id 查詢權限物件
     * @param id 權限 id
     * @returns Authority | undefined
     */
    getAuthorityById(id) {
        return this.authorities.find(a => a.id === id);
    }
    /**
     * 移除權限物件
     * @param id 權限 id
     * @returns boolean 是否成功移除
     */
    removeAuthority(id) {
        const idx = this.authorities.findIndex(a => a.id === id);
        if (idx >= 0) {
            this.authorities.splice(idx, 1);
            return true;
        }
        return false;
    }
    /**
     * 將多個權限鍛造成一個模組化能力（能力鍛造）
     * @param ids 權限 id 陣列
     * @param moduleType 模組化能力類型
     * @returns Authority 模組化能力物件
     */
    forgeModule(ids, moduleType) {
        const permissions = [];
        ids.forEach(id => {
            const auth = this.getAuthorityById(id);
            if (auth) {
                permissions.push(...auth.permissions);
            }
        });
        return this.forgeAuthority(moduleType, Array.from(new Set(permissions)));
    }
}
