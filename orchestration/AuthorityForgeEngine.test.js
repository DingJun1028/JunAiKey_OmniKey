"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthorityForgeEngine_1 = require("../orchestration/AuthorityForgeEngine");
describe('AuthorityForgeEngine', function () {
    it('should forge a new authority', function () {
        var engine = new AuthorityForgeEngine_1.AuthorityForgeEngine();
        var auth = engine.forgeAuthority('admin', ['read', 'write']);
        expect(auth.type).toBe('admin');
        expect(auth.permissions).toContain('read');
        expect(engine.getAllAuthorities().length).toBe(1);
    });
    it('should get authority by id', function () {
        var engine = new AuthorityForgeEngine_1.AuthorityForgeEngine();
        var auth = engine.forgeAuthority('user', ['read']);
        var found = engine.getAuthorityById(auth.id);
        expect(found).toBeDefined();
        expect(found === null || found === void 0 ? void 0 : found.type).toBe('user');
    });
    it('should remove authority', function () {
        var engine = new AuthorityForgeEngine_1.AuthorityForgeEngine();
        var auth = engine.forgeAuthority('user', ['read']);
        var removed = engine.removeAuthority(auth.id);
        expect(removed).toBe(true);
        expect(engine.getAllAuthorities().length).toBe(0);
    });
    it('should forge a module from multiple authorities', function () {
        var engine = new AuthorityForgeEngine_1.AuthorityForgeEngine();
        var a1 = engine.forgeAuthority('a', ['x', 'y']);
        var a2 = engine.forgeAuthority('b', ['y', 'z']);
        console.log('a1:', a1);
        console.log('a2:', a2);
        var all = engine.getAllAuthorities();
        console.log('all:', all);
        var module = engine.forgeModule([a1.id, a2.id], 'module');
        console.log('module.permissions:', module.permissions);
        expect(module.type).toBe('module');
        expect(module.permissions.sort()).toEqual(['x', 'y', 'z']);
    });
});
