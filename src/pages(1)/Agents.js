"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
""(templateObject_1 || (templateObject_1 = __makeTemplateObject(["typescript\n// src/pages/Agents.tsx\n// Agents / Runes Page\n// Displays registered Runes managed by the Rune Engrafting Center.\n// --- New: Add UI for listing and viewing details of registered Runes ---\n// --- New: Add UI for installing and uninstalling Runes ---\n// --- New: Add UI for editing user-owned Rune Configurations ---\n// --- New: Add Realtime Updates for Runes and Abilities ---\n// --- Modified: Use SacredRuneEngraver ---\n// --- New: Add UI for executing Rune methods ---\n\n\nimport React, { useEffect, useState } from 'react';\n// --- Modified: Import SacredRuneEngraver ---\nimport { SacredRuneEngraver } from '../core/rune-engrafting/SacredRuneEngraver';\n// --- End Modified ---\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine\nimport { Rune, RuneManifest, User, ForgedAbility } from '../interfaces'; // Import ForgedAbility\nimport { Zap, ChevronDown, ChevronUp, Info, Code, Globe, Database, Palette, Webhook, Settings as SettingsIcon, User as UserIcon, Lock, Unlock, Package, GitCommit, PlusCircle, MinusCircle, Loader2, Edit, Save, XCircle, Trash2, Play } from 'lucide-react'; // Import icons\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\n// --- Modified: Access sacredRuneEngraver ---\nconst sacredRuneEngraver: SacredRuneEngraver = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\n// --- End Modified ---\nconst authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (\u6B0A\u80FD\u935B\u9020) pillar\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Agents: React.FC = () => {\n  const [publicRunes, setPublicRunes] = useState<Rune[]>([]); // State for public runes\n  const [userRunes, setUserRunes] = useState<Rune[]>([]); // State for user-owned runes\n  const [abilities, setAbilities] = useState<ForgedAbility[]>([]); // State for abilities\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedRunes, setExpandedRunes] = useState<Record<string, boolean>>({}); // State to track expanded runes\n  const [expandedAbilities, setExpandedAbilities] = useState<Record<string, boolean>>({}); // State to track expanded abilities\n  const [installingRuneId, setInstallingRuneId] = useState<string | null>(null); // Track which rune is being installed\n  const [uninstallingRuneId, setUninstallingRuneId] = useState<string | null>(null); // Track which rune is being uninstalled\n  const [runeCapacity, setRuneCapacity] = useState<{ currentCost: number, capacity: number } | null>(null); // State for user's rune capacity\n\n  // --- State for editing rune configuration ---\n  const [editingRuneConfig, setEditingRuneConfig] = useState<Rune | null>(null); // The rune whose config is being edited\n  const [editingConfigJson, setEditingConfigJson] = useState(''); // JSON string of the config being edited\n  const [isSavingRuneConfig, setIsSavingRuneConfig] = useState(false);\n  const [runeConfigEditError, setRuneConfigEditError] = useState<string | null>(null); // Error specific to rune config editing\n  // --- End New ---\n\n  // --- State for creating new ability (using structured data) ---\n  const [isCreatingAbility, setIsCreatingAbility] = useState(false);\n  const [newAbilityName, setNewAbilityName] = useState('');\n  const [newAbilityDescription, setNewAbilityDescription] = useState('');\n  const [newAbilityScript, setNewAbilityScript] = useState('');\n  // --- New: Structured Trigger State ---\n  const [newAbilityTriggerType, setNewAbilityTriggerType] = useState('manual'); // Default trigger type\n  const [newAbilityTriggerDetails, setNewAbilityTriggerDetails] = useState<any>({}); // Structured trigger details\n  // --- End New ---\n  const [isSavingAbility, setIsSavingAbility] = useState(false);\n\n\n  // --- State for editing ability (using structured data) ---\n  const [editingAbility, setEditingAbility] = useState<ForgedAbility | null>(null);\n  const [editingAbilityName, setEditingAbilityName] = useState('');\n  const [editingAbilityDescription, setEditingAbilityDescription] = useState('');\n  const [editingAbilityScript, setEditingAbilityScript] = useState('');\n  // --- New: Structured Trigger State (Edit) ---\n  const [editingAbilityTriggerType, setEditingAbilityTriggerType] = useState('manual'); // Default trigger type\n  const [editingAbilityTriggerDetails, setEditingAbilityTriggerDetails] = useState<any>({}); // Structured trigger details\n  // --- End New ---\n  const [isUpdatingAbility, setIsUpdatingAbility] = useState(false);\n\n\n  const [executingAbility, setExecutingAbility] = useState<string | null>(null); // Track which ability is being executed\n  const [executionResult, setExecutionResult] = useState<any>(null); // Result of the last executed ability\n  const [showResultModal, setShowResultModal] = useState<boolean>(false); // Show result modal\n\n  // --- New: State for executing Rune methods ---\n  const [showExecuteRuneModal, setShowExecuteRuneModal] = useState<Rune | null>(null); // The rune whose method is being executed\n  const [selectedRuneMethod, setSelectedRuneMethod] = useState<string>(''); // The method selected for execution\n  const [runeMethodParamsJson, setRuneMethodParamsJson] = useState('{}'); // JSON string of parameters for the method\n  const [runeMethodParamsError, setRuneMethodParamsError] = useState<string | null>(null); // Error for params JSON\n  const [isExecutingRuneMethod, setIsExecutingRuneMethod] = useState(false);\n  const [runeMethodExecutionResult, setRuneMethodExecutionResult] = useState<any>(null); // Result of rune method execution\n  const [runeMethodExecutionError, setRuneMethodExecutionError] = useState<string | null>(null); // Error for rune method execution\n  // --- End New ---\n\n\n  const fetchRunesAndAbilities = async () => {\n       const userId = systemContext?.currentUser?.id;\n       // --- Modified: Use sacredRuneEngraver ---\n       if (!sacredRuneEngraver || !authorityForgingEngine || !userId) {\n            setError(\"Core modules not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch public runes\n          const publicRunesList = await sacredRuneEngraver.listRunes(undefined, undefined); // Fetch public runes (no user ID)\n          setPublicRunes(publicRunesList.filter(rune => rune.is_public)); // Ensure only public ones are listed here\n\n          // Fetch user-owned runes\n          const userRunesList = await sacredRuneEngraver.listRunes(undefined, userId); // Fetch user's runes\n          setUserRunes(userRunesList.filter(rune => rune.user_id === userId)); // Ensure only user's ones are listed here\n\n          // Fetch user's rune capacity\n          const capacity = await sacredRuneEngraver.getUserRuneCapacity(userId);\n          setRuneCapacity(capacity);\n          // --- End Modified ---\n\n          // Fetch abilities\n          const userAbilities = await authorityForgingEngine.getAbilities(undefined, userId); // Fetch abilities for the current user (and public ones)\n          setAbilities(userAbilities);\n\n\n      } catch (err: any) {\n          console.error('Error fetching runes or abilities:', err);\n          setError("], ["typescript\n// src/pages/Agents.tsx\n// Agents / Runes Page\n// Displays registered Runes managed by the Rune Engrafting Center.\n// --- New: Add UI for listing and viewing details of registered Runes ---\n// --- New: Add UI for installing and uninstalling Runes ---\n// --- New: Add UI for editing user-owned Rune Configurations ---\n// --- New: Add Realtime Updates for Runes and Abilities ---\n// --- Modified: Use SacredRuneEngraver ---\n// --- New: Add UI for executing Rune methods ---\n\n\nimport React, { useEffect, useState } from 'react';\n// --- Modified: Import SacredRuneEngraver ---\nimport { SacredRuneEngraver } from '../core/rune-engrafting/SacredRuneEngraver';\n// --- End Modified ---\nimport { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine\nimport { Rune, RuneManifest, User, ForgedAbility } from '../interfaces'; // Import ForgedAbility\nimport { Zap, ChevronDown, ChevronUp, Info, Code, Globe, Database, Palette, Webhook, Settings as SettingsIcon, User as UserIcon, Lock, Unlock, Package, GitCommit, PlusCircle, MinusCircle, Loader2, Edit, Save, XCircle, Trash2, Play } from 'lucide-react'; // Import icons\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\n// --- Modified: Access sacredRuneEngraver ---\nconst sacredRuneEngraver: SacredRuneEngraver = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (\u8056\u7B26\u6587\u5320) pillar\n// --- End Modified ---\nconst authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (\u6B0A\u80FD\u935B\u9020) pillar\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Agents: React.FC = () => {\n  const [publicRunes, setPublicRunes] = useState<Rune[]>([]); // State for public runes\n  const [userRunes, setUserRunes] = useState<Rune[]>([]); // State for user-owned runes\n  const [abilities, setAbilities] = useState<ForgedAbility[]>([]); // State for abilities\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [expandedRunes, setExpandedRunes] = useState<Record<string, boolean>>({}); // State to track expanded runes\n  const [expandedAbilities, setExpandedAbilities] = useState<Record<string, boolean>>({}); // State to track expanded abilities\n  const [installingRuneId, setInstallingRuneId] = useState<string | null>(null); // Track which rune is being installed\n  const [uninstallingRuneId, setUninstallingRuneId] = useState<string | null>(null); // Track which rune is being uninstalled\n  const [runeCapacity, setRuneCapacity] = useState<{ currentCost: number, capacity: number } | null>(null); // State for user's rune capacity\n\n  // --- State for editing rune configuration ---\n  const [editingRuneConfig, setEditingRuneConfig] = useState<Rune | null>(null); // The rune whose config is being edited\n  const [editingConfigJson, setEditingConfigJson] = useState(''); // JSON string of the config being edited\n  const [isSavingRuneConfig, setIsSavingRuneConfig] = useState(false);\n  const [runeConfigEditError, setRuneConfigEditError] = useState<string | null>(null); // Error specific to rune config editing\n  // --- End New ---\n\n  // --- State for creating new ability (using structured data) ---\n  const [isCreatingAbility, setIsCreatingAbility] = useState(false);\n  const [newAbilityName, setNewAbilityName] = useState('');\n  const [newAbilityDescription, setNewAbilityDescription] = useState('');\n  const [newAbilityScript, setNewAbilityScript] = useState('');\n  // --- New: Structured Trigger State ---\n  const [newAbilityTriggerType, setNewAbilityTriggerType] = useState('manual'); // Default trigger type\n  const [newAbilityTriggerDetails, setNewAbilityTriggerDetails] = useState<any>({}); // Structured trigger details\n  // --- End New ---\n  const [isSavingAbility, setIsSavingAbility] = useState(false);\n\n\n  // --- State for editing ability (using structured data) ---\n  const [editingAbility, setEditingAbility] = useState<ForgedAbility | null>(null);\n  const [editingAbilityName, setEditingAbilityName] = useState('');\n  const [editingAbilityDescription, setEditingAbilityDescription] = useState('');\n  const [editingAbilityScript, setEditingAbilityScript] = useState('');\n  // --- New: Structured Trigger State (Edit) ---\n  const [editingAbilityTriggerType, setEditingAbilityTriggerType] = useState('manual'); // Default trigger type\n  const [editingAbilityTriggerDetails, setEditingAbilityTriggerDetails] = useState<any>({}); // Structured trigger details\n  // --- End New ---\n  const [isUpdatingAbility, setIsUpdatingAbility] = useState(false);\n\n\n  const [executingAbility, setExecutingAbility] = useState<string | null>(null); // Track which ability is being executed\n  const [executionResult, setExecutionResult] = useState<any>(null); // Result of the last executed ability\n  const [showResultModal, setShowResultModal] = useState<boolean>(false); // Show result modal\n\n  // --- New: State for executing Rune methods ---\n  const [showExecuteRuneModal, setShowExecuteRuneModal] = useState<Rune | null>(null); // The rune whose method is being executed\n  const [selectedRuneMethod, setSelectedRuneMethod] = useState<string>(''); // The method selected for execution\n  const [runeMethodParamsJson, setRuneMethodParamsJson] = useState('{}'); // JSON string of parameters for the method\n  const [runeMethodParamsError, setRuneMethodParamsError] = useState<string | null>(null); // Error for params JSON\n  const [isExecutingRuneMethod, setIsExecutingRuneMethod] = useState(false);\n  const [runeMethodExecutionResult, setRuneMethodExecutionResult] = useState<any>(null); // Result of rune method execution\n  const [runeMethodExecutionError, setRuneMethodExecutionError] = useState<string | null>(null); // Error for rune method execution\n  // --- End New ---\n\n\n  const fetchRunesAndAbilities = async () => {\n       const userId = systemContext?.currentUser?.id;\n       // --- Modified: Use sacredRuneEngraver ---\n       if (!sacredRuneEngraver || !authorityForgingEngine || !userId) {\n            setError(\"Core modules not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null); // Clear main error when fetching\n      try {\n          // Fetch public runes\n          const publicRunesList = await sacredRuneEngraver.listRunes(undefined, undefined); // Fetch public runes (no user ID)\n          setPublicRunes(publicRunesList.filter(rune => rune.is_public)); // Ensure only public ones are listed here\n\n          // Fetch user-owned runes\n          const userRunesList = await sacredRuneEngraver.listRunes(undefined, userId); // Fetch user's runes\n          setUserRunes(userRunesList.filter(rune => rune.user_id === userId)); // Ensure only user's ones are listed here\n\n          // Fetch user's rune capacity\n          const capacity = await sacredRuneEngraver.getUserRuneCapacity(userId);\n          setRuneCapacity(capacity);\n          // --- End Modified ---\n\n          // Fetch abilities\n          const userAbilities = await authorityForgingEngine.getAbilities(undefined, userId); // Fetch abilities for the current user (and public ones)\n          setAbilities(userAbilities);\n\n\n      } catch (err: any) {\n          console.error('Error fetching runes or abilities:', err);\n          setError("])));
Failed;
to;
load;
agents;
and;
abilities: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }\n  };\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchRunesAndAbilities(); // Fetch all data on initial load\n    }\n\n    // --- New: Subscribe to realtime updates for runes and abilities ---\n    let unsubscribeRuneInstalled: (() => void) | undefined;\n    let unsubscribeRuneUninstalled: (() => void) | undefined;\n    let unsubscribeRuneConfigUpdated: (() => void) | undefined;\n    let unsubscribeAbilityForged: (() => void) | undefined;\n    let unsubscribeAbilityUpdated: (() => void) | undefined;\n    let unsubscribeAbilityDeleted: (() => void) | undefined;\n\n\n    // --- Modified: Use sacredRuneEngraver ---\n    if (sacredRuneEngraver?.context?.eventBus) { // Check if SacredRuneEngraver and its EventBus are available\n        const eventBus = sacredRuneEngraver.context.eventBus;\n    // --- End Modified ---\n        const userId = systemContext?.currentUser?.id;\n\n        // Subscribe to rune updates (insert, update, delete)\n        unsubscribeRuneInstalled = eventBus.subscribe('rune_installed', (payload: Rune) => { // 'rune_installed' is published by installRune\n            if (payload.user_id === userId) {\n                console.log('Agents page received rune_installed event:', payload);\n                // Add the new user rune and refetch public runes to update 'Installed' status\n                setUserRunes(prevRunes => [...prevRunes, payload]);\n                fetchRunesAndAbilities(); // Refetch all to update lists and capacity\n            }\n        });\n         unsubscribeRuneConfigUpdated = eventBus.subscribe('rune_configuration_updated', (payload: Rune) => { // 'rune_configuration_updated' is published by updateRuneConfiguration\n             if (payload.user_id === userId) {\n                 console.log('Agents page received rune_configuration_updated event:', payload);\n                 // Update the specific user rune in the state\n                 setUserRunes(prevRunes => prevRunes.map(rune => rune.id === payload.id ? payload : rune));\n             }\n         });\n          unsubscribeRuneUninstalled = eventBus.subscribe('rune_uninstalled', (payload: { runeId: string, userId: string }) => { // 'rune_uninstalled' is published by uninstallRune\n             if (payload.userId === userId) {\n                 console.log('Agents page received rune_uninstalled event:', payload);\n                 // Remove the deleted user rune from the state and refetch public runes\n                 setUserRunes(prevRunes => prevRunes.filter(rune => rune.id !== payload.runeId));\n                 fetchRunesAndAbilities(); // Refetch all to update lists and capacity\n             }\n         });\n         // Note: Public rune inserts/updates/deletes would also need subscriptions if they can change dynamically\n\n\n        // Subscribe to ability updates (insert, update, delete)\n        unsubscribeAbilityForged = eventBus.subscribe('ability_forged', (payload: ForgedAbility) => { // 'ability_forged' is published by manuallyForgeAbility/forgeAbilityFromActions\n             if (payload.user_id === userId) {\n                 console.log('Agents page received ability_forged event:', payload);\n                 // Add the new ability and keep sorted by creation timestamp (newest first)\n                 setAbilities(prevAbilities => [...prevAbilities, payload].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));\n             }\n         });\n         unsubscribeAbilityUpdated = eventBus.subscribe('ability_updated', (payload: ForgedAbility) => {\n             if (payload.user_id === userId) {\n                 console.log('Agents page received ability_updated event:', payload);\n                 // Update the specific ability in the state\n                 setAbilities(prevAbilities => prevAbilities.map(ability => ability.id === payload.id ? payload : ability));\n             }\n         });\n          unsubscribeAbilityDeleted = eventBus.subscribe('ability_deleted', (payload: { abilityId: string, userId: string }) => {\n             if (payload.userId === userId) {\n                 console.log('Agents page received ability_deleted event:', payload);\n                 // Remove the deleted ability from the state\n                 setAbilities(prevAbilities => prevAbilities.filter(ability => ability.id !== payload.abilityId));\n             }\n         });\n         // Note: Ability execution events ('ability_executed', 'ability_execution_failed') are not handled here,\n         // as they don't change the ability definition itself, but might update last_used_timestamp (handled by 'ability_updated').\n    }\n    // --- End New ---\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribeRuneInstalled?.();\n        unsubscribeRuneUninstalled?.();\n        unsubscribeRuneConfigUpdated?.();\n        unsubscribeAbilityForged?.();\n        unsubscribeAbilityUpdated?.();\n        unsubscribeAbilityDeleted?.();\n    };\n\n  }, [systemContext?.currentUser?.id, sacredRuneEngraver, authorityForgingEngine]); // Re-run effect when user ID or engine changes\n\n\n\n    const getRuneTypeIcon = (type: Rune['type']) => {\n        switch (type) {\n            case 'api-adapter': return <Globe size={16} className=\"text-blue-400\"/>;\n            case 'script-plugin': return <Code size={16} className=\"text-green-400\"/>;\n            case 'ui-component': return <Palette size={16} className=\"text-purple-400\"/>;\n            case 'data-source': return <Database size={16} className=\"text-orange-400\"/>;\n            case 'automation-tool': return <SettingsIcon size={16} className=\"text-neutral-400\"/>;\n            case 'ai-agent': return <Zap size={16} className=\"text-cyan-400\"/>;\n            case 'device-adapter': return <Package size={16} className=\"text-yellow-400\"/>;\n            case 'webhook-trigger': return <Webhook size={16} className=\"text-red-400\"/>;\n            case 'system-adapter': return <Info size={16} className=\"text-gray-400\"/>; // System adapter icon\n            default: return <Info size={16} className=\"text-neutral-400\"/>;\n        }\n    };\n\n\n\n    const toggleExpandRune = (runeId: string) => {\n        setExpandedRunes(prevState => ({\n            ...prevState,\n            [runeId]: !prevState[runeId]\n        }));\n    };\n\n     const toggleExpandAbility = (abilityId: string) => {\n        setExpandedAbilities(prevState => ({\n            ...prevState,\n            [abilityId]: !prevState[abilityId]\n        }));\n    };\n\n\n\n    // --- New: Handle Install Rune ---\n    const handleInstallRune = async (publicRuneId: string) => {\n        const userId = systemContext?.currentUser?.id;\n        // --- Modified: Use sacredRuneEngraver ---\n        if (!sacredRuneEngraver || !userId) {\n            alert(\"SacredRuneEngraver module not initialized or user not logged in.\");\n            return;\n        }\n        // --- End Modified ---\n        console.log(";
Attempting;
to;
install;
rune: $;
{
    publicRuneId;
}
");\n         // Simulate recording user action (Part of \u6B0A\u80FD\u935B\u9020 / \u516D\u5F0F\u5967\u7FA9: \u89C0\u5BDF)\n        authorityForgingEngine?.recordAction({\n            type: 'web:agents:install_rune',\n            details: { publicRuneId },\n            context: { platform: 'web', page: 'agents' },\n            user_id: userId, // Associate action with user\n        });\n\n        setInstallingRuneId(publicRuneId); // Indicate this rune is being installed\n        setError(null); // Clear previous errors\n        try {\n            // Call the engine method to install the rune\n            // --- Modified: Use sacredRuneEngraver ---\n            const newUserRune = await sacredRuneEngraver.installRune(publicRuneId, userId); // Pass publicRuneId and userId\n            // --- End Modified ---\n\n            if (newUserRune) {\n                // State update handled by realtime listener ('rune_installed' event)\n                alert(";
Rune;
"${newUserRune.name}\" installed successfully!`);;
console.log('Installed new user rune:', newUserRune);
// fetchRunesAndAbilities(); // Refetch runes and capacity - handled by listener
// Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
    type: 'web:agents:install_rune',
    details: { runeId: newUserRune.id, name: newUserRune.name },
    context: { platform: 'web', page: 'agents' },
    user_id: userId, // Associate action with user
});
{
    // This case might happen if the rune was already installed (checked by the engine)
    alert('Rune installation skipped (already installed or other reason).');
}
try { }
catch (err) {
    console.error("Error installing rune ".concat(publicRuneId, ":"), err);
    setError("Failed to install rune: ".concat(err.message));
    alert("Failed to install rune: ".concat(err.message));
}
finally {
    setInstallingRuneId(null); // Reset installing state
}
;
// --- End New ---
// --- New: Handle Uninstall Rune ---
var handleUninstallRune = function (userRuneId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, success_1, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                // --- Modified: Use sacredRuneEngraver ---
                if (!sacredRuneEngraver || !userId) {
                    alert("SacredRuneEngraver module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                // --- End Modified ---
                if (!confirm("Are you sure you want to uninstall this rune? This action cannot be undone."))
                    return [2 /*return*/];
                console.log("Attempting to uninstall user rune: ".concat(userRuneId));
                // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:agents:uninstall_rune',
                    details: { userRuneId: userRuneId },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
                setUninstallingRuneId(userRuneId); // Indicate this rune is being uninstalled
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, sacredRuneEngraver.uninstallRune(userRuneId, userId)];
            case 2:
                success_1 = _b.sent();
                // --- End Modified ---
                if (success_1) {
                    console.log('Rune uninstalled:', userRuneId);
                    // State update handled by realtime listener ('rune_uninstalled' event)
                    // fetchRunesAndAbilities(); // Refetch runes and capacity - handled by listener
                    alert('Rune uninstalled successfully!');
                }
                else {
                    setError('Failed to uninstall rune.');
                    alert('Failed to uninstall rune.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                console.error("Error uninstalling rune ".concat(userRuneId, ":"), err_1);
                setError("Failed to uninstall rune: ".concat(err_1.message));
                alert("Failed to uninstall rune: ".concat(err_1.message));
                return [3 /*break*/, 5];
            case 4:
                setUninstallingRuneId(null); // Reset uninstalling state
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- End New ---
// --- New: Handle Edit Rune Configuration ---
var handleEditRuneConfigClick = function (rune) {
    setEditingRuneConfig(rune);
    // Display current configuration as formatted JSON
    setEditingConfigJson(JSON.stringify(rune.configuration || {}, null, 2));
    setRuneConfigEditError(null); // Clear previous errors
};
var handleSaveRuneConfig = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newConfig, updatedRune_1, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                // --- Modified: Use sacredRuneEngraver ---
                if (!sacredRuneEngraver || !editingRuneConfig || !userId) {
                    alert("SacredRuneEngraver module not initialized, user not logged in, or no rune selected.");
                    return [2 /*return*/];
                }
                // --- End Modified ---
                setIsSavingRuneConfig(true);
                setRuneConfigEditError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                newConfig = JSON.parse(editingConfigJson);
                return [4 /*yield*/, sacredRuneEngraver.updateRuneConfiguration(editingRuneConfig.id, newConfig, userId)];
            case 2:
                updatedRune_1 = _b.sent();
                // --- End Modified ---
                if (updatedRune_1) {
                    console.log('Rune configuration updated:', updatedRune_1);
                    // State update handled by realtime listener ('rune_configuration_updated' event)
                    // Update the specific user rune in the state immediately for better UX
                    setUserRunes(function (prevRunes) { return prevRunes.map(function (rune) { return rune.id === updatedRune_1.id ? updatedRune_1 : rune; }); });
                    setEditingRuneConfig(null); // Close the modal
                    setEditingConfigJson('');
                    alert('Rune configuration updated successfully!');
                    // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:agents:update_rune_config',
                        details: { runeId: updatedRune_1.id, name: updatedRune_1.name },
                        context: { platform: 'web', page: 'agents' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setRuneConfigEditError('Failed to update rune configuration.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_2 = _b.sent();
                console.error('Error updating rune configuration:', err_2);
                setRuneConfigEditError("Failed to update configuration: ".concat(err_2.message));
                return [3 /*break*/, 5];
            case 4:
                setIsSavingRuneConfig(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancelEditRuneConfig = function () {
    setEditingRuneConfig(null);
    setEditingConfigJson('');
    setRuneConfigEditError(null);
};
// --- End New ---
// --- New: Handle Create Ability (using structured data) ---
var handleCreateAbility = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, triggerObject, newAbility, err_3;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!authorityForgingEngine || !userId) {
                    alert("AuthorityForgingEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                if (!newAbilityName.trim() || !newAbilityScript.trim()) {
                    alert('Please enter name and script.');
                    return [2 /*return*/];
                }
                // Basic validation for trigger details based on type
                if (newAbilityTriggerType === 'keyword' && !((_b = newAbilityTriggerDetails === null || newAbilityTriggerDetails === void 0 ? void 0 : newAbilityTriggerDetails.value) === null || _b === void 0 ? void 0 : _b.trim())) {
                    alert('Keyword trigger requires a keyword value.');
                    return [2 /*return*/];
                }
                if (newAbilityTriggerType === 'schedule' && !((_c = newAbilityTriggerDetails === null || newAbilityTriggerDetails === void 0 ? void 0 : newAbilityTriggerDetails.cron) === null || _c === void 0 ? void 0 : _c.trim())) {
                    alert('Schedule trigger requires a cron expression.');
                    return [2 /*return*/];
                }
                if (newAbilityTriggerType === 'event' && !((_d = newAbilityTriggerDetails === null || newAbilityTriggerDetails === void 0 ? void 0 : newAbilityTriggerDetails.eventType) === null || _d === void 0 ? void 0 : _d.trim())) {
                    alert('Event trigger requires an event type.');
                    return [2 /*return*/];
                }
                setIsSavingAbility(true);
                setError(null);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, 4, 5]);
                triggerObject = __assign({ type: newAbilityTriggerType }, newAbilityTriggerDetails);
                return [4 /*yield*/, authorityForgingEngine.manuallyForgeAbility(newAbilityName, newAbilityDescription, newAbilityScript, triggerObject, // Use the assembled trigger object
                    userId // Pass user ID
                    )];
            case 2:
                newAbility = _e.sent();
                if (newAbility) {
                    // State update handled by realtime listener ('ability_forged' event)
                    alert("Ability \"".concat(newAbility.name, "\" forged successfully!"));
                    console.log('Forged new ability:', newAbility);
                    setNewAbilityName('');
                    setNewAbilityDescription('');
                    setNewAbilityScript('');
                    // Reset trigger state
                    setNewAbilityTriggerType('manual');
                    setNewAbilityTriggerDetails({});
                    setIsCreatingAbility(false); // Hide form
                    // fetchAbilities(); // Refetch abilities - handled by listener
                    // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:agents:create_ability',
                        details: { abilityId: newAbility.id, name: newAbility.name },
                        context: { platform: 'web', page: 'agents' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setError('Failed to forge ability.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_3 = _e.sent();
                console.error('Error forging ability:', err_3);
                setError("Failed to forge ability: ".concat(err_3.message));
                return [3 /*break*/, 5];
            case 4:
                setIsSavingAbility(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- End New ---
// --- New: Handle Edit Ability (using structured data) ---
var handleEditAbilityClick = function (ability) {
    var _a;
    setEditingAbility(ability);
    setEditingAbilityName(ability.name);
    setEditingAbilityDescription(ability.description || '');
    setEditingAbilityScript(ability.script);
    // Set structured trigger state from the ability object
    setEditingAbilityTriggerType(((_a = ability.trigger) === null || _a === void 0 ? void 0 : _a.type) || 'manual');
    // Copy trigger details, excluding the type
    var _b = ability.trigger || {}, type = _b.type, details = __rest(_b, ["type"]);
    setEditingAbilityTriggerDetails(details || {});
    setError(null); // Clear previous errors when starting edit
};
var handleUpdateAbility = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, triggerObject, updatedAbility_1, err_4;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!authorityForgingEngine || !editingAbility || !userId)
                    return [2 /*return*/]; // Safety checks
                if (!editingAbilityName.trim() || !editingAbilityScript.trim()) {
                    alert('Please enter name and script.');
                    return [2 /*return*/];
                }
                // Basic validation for trigger details based on type
                if (editingAbilityTriggerType === 'keyword' && !((_b = editingAbilityTriggerDetails === null || editingAbilityTriggerDetails === void 0 ? void 0 : editingAbilityTriggerDetails.value) === null || _b === void 0 ? void 0 : _b.trim())) {
                    alert('Keyword trigger requires a keyword value.');
                    return [2 /*return*/];
                }
                if (editingAbilityTriggerType === 'schedule' && !((_c = editingAbilityTriggerDetails === null || editingAbilityTriggerDetails === void 0 ? void 0 : editingAbilityTriggerDetails.cron) === null || _c === void 0 ? void 0 : _c.trim())) {
                    alert('Schedule trigger requires a cron expression.');
                    return [2 /*return*/];
                }
                if (editingAbilityTriggerType === 'event' && !((_d = editingAbilityTriggerDetails === null || editingAbilityTriggerDetails === void 0 ? void 0 : editingAbilityTriggerDetails.eventType) === null || _d === void 0 ? void 0 : _d.trim())) {
                    alert('Event trigger requires an event type.');
                    return [2 /*return*/];
                }
                setIsUpdatingAbility(true);
                setError(null);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, 4, 5]);
                triggerObject = __assign({ type: editingAbilityTriggerType }, editingAbilityTriggerDetails);
                return [4 /*yield*/, authorityForgingEngine.updateAbility(editingAbility.id, {
                        name: editingAbilityName,
                        description: editingAbilityDescription,
                        script: editingAbilityScript,
                        trigger: triggerObject, // Use the assembled trigger object
                    }, userId)];
            case 2:
                updatedAbility_1 = _e.sent();
                if (updatedAbility_1) {
                    console.log('Ability updated:', updatedAbility_1);
                    // State update handled by realtime listener ('ability_updated' event)
                    // Update the specific ability in the state immediately for better UX
                    setAbilities(function (prevAbilities) { return prevAbilities.map(function (ability) { return ability.id === updatedAbility_1.id ? updatedAbility_1 : ability; }); });
                    setEditingAbility(null); // Close edit form
                    setEditingAbilityName('');
                    setEditingAbilityDescription('');
                    setEditingAbilityScript('');
                    // Reset trigger state
                    setEditingAbilityTriggerType('manual');
                    setEditingAbilityTriggerDetails({});
                    // fetchAbilities(); // Refetch abilities - handled by listener
                    // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:agents:update_ability',
                        details: { abilityId: updatedAbility_1.id, name: updatedAbility_1.name },
                        context: { platform: 'web', page: 'agents' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setError('Failed to update ability.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_4 = _e.sent();
                console.error('Error updating ability:', err_4);
                setError("Failed to update ability: ".concat(err_4.message));
                return [3 /*break*/, 5];
            case 4:
                setIsUpdatingAbility(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancelEditAbility = function () {
    setEditingAbility(null);
    setEditingAbilityName('');
    setEditingAbilityDescription('');
    setEditingAbilityScript('');
    // Reset trigger state
    setEditingAbilityTriggerType('manual');
    setEditingAbilityTriggerDetails({});
    setError(null);
};
// --- End New ---
var handleDeleteAbility = function (abilityId) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, success_2, err_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!authorityForgingEngine || !userId) {
                    alert("AuthorityForgingEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                if (!confirm("Are you sure you want to delete ability ".concat(abilityId, "?")))
                    return [2 /*return*/];
                setError(null);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, authorityForgingEngine.deleteAbility(abilityId, userId)];
            case 2:
                success_2 = _b.sent();
                if (success_2) {
                    console.log('Ability deleted:', abilityId);
                    // State update handled by realtime listener ('ability_deleted' event)
                    // fetchAbilities(); // Refetch abilities - handled by listener
                    // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                    authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                        type: 'web:agents:delete_ability',
                        details: { abilityId: abilityId },
                        context: { platform: 'web', page: 'agents' },
                        user_id: userId, // Associate action with user
                    });
                }
                else {
                    setError('Failed to delete ability.');
                }
                return [3 /*break*/, 5];
            case 3:
                err_5 = _b.sent();
                console.error('Error deleting ability:', err_5);
                setError("Failed to delete ability: ".concat(err_5.message));
                return [3 /*break*/, 5];
            case 4: return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleExecuteAbility = function (ability) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, result, err_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!authorityForgingEngine || !userId) {
                    alert("AuthorityForgingEngine module not initialized or user not logged in.");
                    return [2 /*return*/];
                }
                console.log("Attempting to execute ability: ".concat(ability.name, " (").concat(ability.id, ")"));
                // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:agents:run',
                    details: { abilityId: ability.id, name: ability.name },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
                setExecutingAbility(ability.id); // Indicate this ability is running
                setExecutionResult(null); // Clear previous result
                setShowResultModal(false); // Hide previous modal
                setError(null); // Clear previous errors
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, authorityForgingEngine.executeAbility(ability.id, userId, {})];
            case 2:
                result = _b.sent();
                console.log("Ability \"".concat(ability.name, "\" executed. Result:"), result);
                setExecutionResult(result); // Store the result
                setShowResultModal(true); // Show result modal
                return [3 /*break*/, 5];
            case 3:
                err_6 = _b.sent();
                console.error("Error executing ability \"".concat(ability.name, "\":"), err_6);
                setError("Failed to execute ability \"".concat(ability.name, "\": ").concat(err_6.message));
                setExecutionResult({ status: 'error', message: err_6.message }); // Store error in result
                setShowResultModal(true); // Show result modal even on error
                return [3 /*break*/, 5];
            case 4:
                setExecutingAbility(null); // Reset executing state
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- New: Handle Execute Rune Method ---
var handleExecuteRuneMethod = function (e) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, params, result, err_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                e.preventDefault();
                userId = (_a = systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser) === null || _a === void 0 ? void 0 : _a.id;
                if (!sacredRuneEngraver || !userId || !showExecuteRuneModal || !selectedRuneMethod) {
                    setRuneMethodParamsError("SacredRuneEngraver module not initialized, user not logged in, or rune/method not selected.");
                    return [2 /*return*/];
                }
                try {
                    params = JSON.parse(runeMethodParamsJson);
                    setRuneMethodParamsError(null); // Clear error if valid
                }
                catch (err) {
                    setRuneMethodParamsError("Invalid JSON parameters: ".concat(err.message));
                    return [2 /*return*/]; // Stop if JSON is invalid
                }
                setIsExecutingRuneMethod(true);
                setRuneMethodExecutionResult(null); // Clear previous result
                setRuneMethodExecutionError(null); // Clear previous error
                setError(null); // Clear main error
                console.log("Attempting to execute rune method: ".concat(showExecuteRuneModal.name, ".").concat(selectedRuneMethod, " with params:"), params);
                // Simulate recording user action
                authorityForgingEngine === null || authorityForgingEngine === void 0 ? void 0 : authorityForgingEngine.recordAction({
                    type: 'web:agents:run_rune_method',
                    details: { runeId: showExecuteRuneModal.id, runeName: showExecuteRuneModal.name, method: selectedRuneMethod, params: params },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, sacredRuneEngraver.executeRuneAction(showExecuteRuneModal.id, selectedRuneMethod, params, userId)];
            case 2:
                result = _b.sent();
                console.log("Rune method executed. Result:", result);
                setRuneMethodExecutionResult(result); // Store the result
                return [3 /*break*/, 5];
            case 3:
                err_7 = _b.sent();
                console.error("Error executing rune method ".concat(showExecuteRuneModal.name, ".").concat(selectedRuneMethod, ":"), err_7);
                setRuneMethodExecutionError("Failed to execute method: ".concat(err_7.message));
                return [3 /*break*/, 5];
            case 4:
                setIsExecutingRuneMethod(false);
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
// --- End New ---
// --- New: Helper to render structured trigger details form ---
var renderTriggerDetailsForm = function (triggerType, triggerDetails, setTriggerDetails, disabled) {
    switch (triggerType) {
        case 'manual':
            return <p className="text-neutral-400 text-sm">This ability is triggered manually.</p>;
        case 'keyword':
            return (<div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor="trigger-keyword-value" className="block text-neutral-400 text-xs font-semibold mb-1">Keyword:</label>
                        <input id="trigger-keyword-value" type="text" className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={(triggerDetails === null || triggerDetails === void 0 ? void 0 : triggerDetails.value) || ''} onChange={function (e) { return setTriggerDetails(__assign(__assign({}, triggerDetails), { value: e.target.value })); }} placeholder="e.g., run report" disabled={disabled} required/>
                    </div>);
        case 'schedule':
            return (<div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor="trigger-schedule-cron" className="block text-neutral-400 text-xs font-semibold mb-1">Cron Expression:</label>
                        <input id="trigger-schedule-cron" type="text" className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={(triggerDetails === null || triggerDetails === void 0 ? void 0 : triggerDetails.cron) || ''} onChange={function (e) { return setTriggerDetails(__assign(__assign({}, triggerDetails), { cron: e.target.value })); }} placeholder="e.g., 0 * * * *" disabled={disabled} required/>
                         <small className="text-neutral-400 text-xs block mt-1">Standard cron format (e.g., `0 * * * *` for every hour).</small>
                    </div>);
        case 'event':
            return (<div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor="trigger-event-type" className="block text-neutral-400 text-xs font-semibold mb-1">Event Type:</label>
                        <input id="trigger-event-type" type="text" className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={(triggerDetails === null || triggerDetails === void 0 ? void 0 : triggerDetails.eventType) || ''} onChange={function (e) { return setTriggerDetails(__assign(__assign({}, triggerDetails), { eventType: e.target.value })); }} placeholder="e.g., task_completed" disabled={disabled} required/>
                         <small className="text-neutral-400 text-xs block mt-1">Triggered when this system event occurs.</small>
                    </div>);
        // Add cases for other trigger types (e.g., 'webhook', 'location', 'time')
        default:
            return (<div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                         <label htmlFor="trigger-details-json" className="block text-neutral-400 text-xs font-semibold mb-1">Trigger Details (JSON):</label>
                         <textarea id="trigger-details-json" className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs" value={JSON.stringify(triggerDetails || {}, null, 2)} onChange={function (e) {
                    try {
                        var parsed = JSON.parse(e.target.value); // Corrected: use 'parsed'
                        setTriggerDetails(parsed); // Corrected: use 'parsed'
                        // TODO: Clear any parsing error message if successful
                    }
                    catch (parseError) {
                        console.error("Invalid JSON for trigger details:", parseError);
                        // TODO: Display an error message for invalid JSON
                    }
                }} rows={3} disabled={disabled} required/>
                     </div>);
    }
};
// --- End New ---
// Ensure user is logged in before rendering content
if (!(systemContext === null || systemContext === void 0 ? void 0 : systemContext.currentUser)) {
    // This case should ideally be handled by ProtectedRoute, but as a fallback:
    return (<div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your scripts and abilities.</p>
               </div>
            </div>);
}
return (<div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Scripts & Abilities (權能鍛造)</h2>
        <p className="text-neutral-300 mb-8">Manage your automated scripts (Abilities) and review recent system activity.</p>

        {/* Form for manually forging new abilities */}
        {!editingAbility && (<div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Forge New Ability</h3>
                 <form onSubmit={handleCreateAbility}>
                    <div className="mb-4">
                        <label htmlFor="newAbilityName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                        <input id="newAbilityName" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newAbilityName} onChange={function (e) { return setNewAbilityName(e.target.value); }} placeholder="Enter ability name" disabled={isSavingAbility} required/>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="newAbilityDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                        <input id="newAbilityDescription" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newAbilityDescription} onChange={function (e) { return setNewAbilityDescription(e.target.value); }} placeholder="Enter description" disabled={isSavingAbility}/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newAbilityScript" className="block text-neutral-300 text-sm font-semibold mb-2">Script (JavaScript/TypeScript):</label>
                         <textarea id="newAbilityScript" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs" value={newAbilityScript} onChange={function (e) { return setNewAbilityScript(e.target.value); }} placeholder="// Write your script here\nconsole.log('Hello from ability!');" rows={8} disabled={isSavingAbility} required/>
                    </div>
                     {/* New: Structured Trigger Input */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Trigger:</h4>
                         <div className="mb-2">
                            <label htmlFor="newAbilityTriggerType" className="block text-neutral-400 text-xs font-semibold mb-1">Type:</label>
                            <select id="newAbilityTriggerType" className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={newAbilityTriggerType} onChange={function (e) { setNewAbilityTriggerType(e.target.value); setNewAbilityTriggerDetails({}); }} // Reset details when type changes
     disabled={isSavingAbility} required>
                                <option value="manual">manual</option>
                                <option value="keyword">keyword</option>
                                <option value="schedule">schedule</option>
                                <option value="event">event</option>
                                {/* Add other trigger types as needed */}
                            </select>
                        </div>
                         {/* Render structured form based on selected trigger type */}
                         {renderTriggerDetailsForm(newAbilityTriggerType, newAbilityTriggerDetails, setNewAbilityTriggerDetails, isSavingAbility)}
                     </div>
                     {/* End New */}
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSavingAbility || !newAbilityName.trim() || !newAbilityScript.trim() || (newAbilityTriggerType === 'keyword' && !((_a = newAbilityTriggerDetails === null || newAbilityTriggerDetails === void 0 ? void 0 : newAbilityTriggerDetails.value) === null || _a === void 0 ? void 0 : _a.trim())) || (newAbilityTriggerType === 'schedule' && !((_b = newAbilityTriggerDetails === null || newAbilityTriggerDetails === void 0 ? void 0 : newAbilityTriggerDetails.cron) === null || _b === void 0 ? void 0 : _b.trim())) || (newAbilityTriggerType === 'event' && !((_c = newAbilityTriggerDetails === null || newAbilityTriggerDetails === void 0 ? void 0 : newAbilityTriggerDetails.eventType) === null || _c === void 0 ? void 0 : _c.trim()))}>
                        {isSavingAbility ? 'Forging...' : 'Forge Ability'}
                    </button>
                     <button type="button" onClick={handleCancelCreate} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isSavingAbility}>
                        Cancel
                    </button>
               </form>
                 {error && isSavingAbility === false && ( // Show create error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {error}</p>)}
            </div>)}

        {/* Form for editing an ability */}
        {editingAbility && ( // Show edit form if editing
    <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Edit Ability: {editingAbility.name}</h3>
                 <form onSubmit={handleUpdateAbility}>
                    <div className="mb-4">
                        <label htmlFor="editingAbilityName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                        <input id="editingAbilityName" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingAbilityName} onChange={function (e) { return setEditingAbilityName(e.target.value); }} placeholder="Edit ability name" disabled={isUpdatingAbility} required/>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="editingAbilityDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                        <input id="editingAbilityDescription" type="text" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editingAbilityDescription} onChange={function (e) { return setEditingAbilityDescription(e.target.value); }} placeholder="Edit description" disabled={isUpdatingAbility}/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="editingAbilityScript" className="block text-neutral-300 text-sm font-semibold mb-2">Script (JavaScript/TypeScript):</label>
                         <textarea id="editingAbilityScript" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs" value={editingAbilityScript} onChange={function (e) { return setEditingAbilityScript(e.target.value); }} rows={8} disabled={isUpdatingAbility} required/>
                    </div>
                     {/* New: Structured Trigger Input (Edit) */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Trigger:</h4>
                         <div className="mb-2">
                            <label htmlFor="editingAbilityTriggerType" className="block text-neutral-400 text-xs font-semibold mb-1">Type:</label>
                            <select id="editingAbilityTriggerType" className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={editingAbilityTriggerType} onChange={function (e) { setEditingAbilityTriggerType(e.target.value); setEditingAbilityTriggerDetails({}); }} // Reset details when type changes
     disabled={isUpdatingAbility} required>
                                <option value="manual">manual</option>
                                <option value="keyword">keyword</option>
                                <option value="schedule">schedule</option>
                                <option value="event">event</option>
                                {/* Add other trigger types as needed */}
                            </select>
                        </div>
                         {/* Render structured form based on selected trigger type */}
                         {renderTriggerDetailsForm(editingAbilityTriggerType, editingAbilityTriggerDetails, setEditingAbilityTriggerDetails, isUpdatingAbility)}
                     </div>
                     {/* End New */}
                    <div className="flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isUpdatingAbility || !editingAbilityName.trim() || !editingAbilityScript.trim() || (editingAbilityTriggerType === 'keyword' && !((_d = editingAbilityTriggerDetails === null || editingAbilityTriggerDetails === void 0 ? void 0 : editingAbilityTriggerDetails.value) === null || _d === void 0 ? void 0 : _d.trim())) || (editingAbilityTriggerType === 'schedule' && !((_e = editingAbilityTriggerDetails === null || editingAbilityTriggerDetails === void 0 ? void 0 : editingAbilityTriggerDetails.cron) === null || _e === void 0 ? void 0 : _e.trim())) || (editingAbilityTriggerType === 'event' && !((_f = editingAbilityTriggerDetails === null || editingAbilityTriggerDetails === void 0 ? void 0 : editingAbilityTriggerDetails.eventType) === null || _f === void 0 ? void 0 : _f.trim()))}>
                            {isUpdatingAbility ? 'Saving...' : 'Save Changes'}
                        </button>
                         <button type="button" onClick={handleCancelEditAbility} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isUpdatingAbility}>
                            Cancel
                        </button>
                    </div>
                     {error && isUpdatingAbility === false && ( // Show save error only after it finishes
        <p className="text-red-400 text-sm mt-4">Error: {error}</p>)}
               </form>
            </div>)}


        {/* Rune Configuration Edit Modal */}
        {editingRuneConfig && (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300 mb-4">Edit Configuration for {editingRuneConfig.name}</h3>
                         <button type="button" onClick={handleCancelEditRuneConfig} className="text-neutral-400 hover:text-white transition" disabled={isSavingRuneConfig}>
                             <XCircle size={24}/>
                         </button>
                     </div>
                     <form onSubmit={handleSaveRuneConfig}>
                         <div className="mb-4">
                             <label htmlFor="rune-config-json" className="block text-neutral-300 text-sm font-semibold mb-2">Configuration (JSON):</label>
                             <textarea id="rune-config-json" className={"w-full p-2 rounded-md bg-neutral-900 text-white border ".concat(runeConfigEditError ? 'border-red-500' : 'border-neutral-700', " focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs")} value={editingConfigJson} onChange={function (e) {
            setEditingConfigJson(e.target.value);
            try {
                JSON.parse(e.target.value);
                setRuneConfigEditError(null); // Clear error if JSON is valid
            }
            catch (err) {
                setRuneConfigEditError("Invalid JSON: ".concat(err.message));
            }
        }} rows={10} disabled={isSavingRuneConfig} required/>
                         </div>
                         {runeConfigEditError && <p className="text-red-400 text-sm mb-4">Error: {runeConfigEditError}</p>}
                         <div className="flex gap-4 justify-end">
                             <button type="button" onClick={handleCancelEditRuneConfig} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isSavingRuneConfig}>
                                 Close
                             </button>
                             <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSavingRuneConfig || !!runeConfigEditError} // Disable if saving or JSON is invalid
    >
                                 {isSavingRuneConfig ? 'Saving...' : 'Save Configuration'}
                             </button>
                         </div>
                     </form>
                 </div>
             </div>)}

        {/* Ability Execution Result Modal */}
        {showResultModal && (<div className="fixed inset-0 bg-black bg-opacity50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <h3 className="text-xl font-semibold text-blue-300 mb-4">Ability Execution Result</h3>
                     {executionResult ? (<pre className="bg-neutral-900 p-4 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-neutral-700">
                             {JSON.stringify(executionResult, null, 2)}
                         </pre>) : (<p className="text-neutral-400">No result available.</p>)}
                     <div className="flex justify-end mt-6">
                         <button type="button" onClick={function () { setShowResultModal(false); setExecutionResult(null); }} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                             Close
                         </button>
                     </div>
                 </div>
             </div>)}

        {/* New: Execute Rune Method Modal */}
        {showExecuteRuneModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Execute Method on {showExecuteRuneModal.name}</h3>
                         <button type="button" onClick={function () { setShowExecuteRuneModal(null); setSelectedRuneMethod(''); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); setRuneMethodExecutionResult(null); setRuneMethodExecutionError(null); }} className="text-neutral-400 hover:text-white transition" disabled={isExecutingRuneMethod}>
                             <XCircle size={24}/>
                         </button>
                     </div>
                     <p className="text-neutral-300 text-sm mb-4">Select a method to execute and provide parameters.</p>
                     <form onSubmit={handleExecuteRuneMethod}>
                         <div className="mb-4">
                             <label htmlFor="runeMethodSelect" className="block text-neutral-300 text-sm font-semibold mb-2">Method:</label>
                             <select id="runeMethodSelect" className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedRuneMethod} onChange={function (e) { setSelectedRuneMethod(e.target.value); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); }} // Reset params when method changes
     disabled={isExecutingRuneMethod} required>
                                 <option value="">-- Select Method --</option>
                                 {((_g = showExecuteRuneModal.manifest) === null || _g === void 0 ? void 0 : _g.methods) && Object.keys(showExecuteRuneModal.manifest.methods).map(function (methodName) { return (<option key={methodName} value={methodName}>{methodName}</option>); })}
                             </select>
                         </div>
                         {selectedRuneMethod && (<div className="mb-4">
                                 <label htmlFor="runeMethodParamsJson" className="block text-neutral-300 text-sm font-semibold mb-2">Parameters (JSON):</label>
                                 <textarea id="runeMethodParamsJson" className={"w-full p-2 rounded-md bg-neutral-800 text-white border ".concat(runeMethodParamsError ? 'border-red-500' : 'border-neutral-600', " focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs")} value={runeMethodParamsJson} onChange={function (e) {
                setRuneMethodParamsJson(e.target.value);
                try {
                    JSON.parse(e.target.value);
                    setRuneMethodParamsError(null); // Clear error if JSON is valid
                }
                catch (err) {
                    setRuneMethodParamsError("Invalid JSON: ".concat(err.message));
                }
            }} rows={6} disabled={isExecutingRuneMethod} required/>
                                 {runeMethodParamsError && <p className="text-red-400 text-sm mt-1">Error: {runeMethodParamsError}</p>}
                             </div>)}

                         {runeMethodExecutionResult && (<div className="mb-4">
                                 <h4 className="text-neutral-300 text-sm font-semibold mb-2">Result:</h4>
                                 <pre className="bg-neutral-900 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-700">
                                     {JSON.stringify(runeMethodExecutionResult, null, 2)}
                                 </pre>
                             </div>)}
                          {runeMethodExecutionError && (<div className="mb-4">
                                 <h4 className="text-neutral-300 text-sm font-semibold mb-2 text-red-400">Error:</h4>
                                 <pre className="bg-neutral-900 p-3 rounded-md text-red-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-700">
                                     {runeMethodExecutionError}
                                 </pre>
                             </div>)}

                         <div className="flex gap-4 justify-end mt-4">
                             <button type="button" onClick={function () { setShowExecuteRuneModal(null); setSelectedRuneMethod(''); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); setRuneMethodExecutionResult(null); setRuneMethodExecutionError(null); }} className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition" disabled={isExecutingRuneMethod}>
                                 Close
                             </button>
                             <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isExecutingRuneMethod || !selectedRuneMethod || !!runeMethodParamsError} // Disable if executing, no method selected, or params JSON is invalid
    >
                                 {isExecutingRuneMethod ? 'Executing...' : 'Execute'}
                             </button>
                         </div>
                     </form>
                 </div>
             </div>)}
        {/* End New */}


      </div>
    </div>);
;
exports.default = Agents;
""(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var templateObject_1, templateObject_2;
