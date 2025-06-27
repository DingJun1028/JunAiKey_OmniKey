```typescript
// src/pages/Agents.tsx
// Agents / Runes Page
// Displays registered Runes managed by the Rune Engrafting Center.
// --- New: Add UI for listing and viewing details of registered Runes ---
// --- New: Add UI for installing and uninstalling Runes ---
// --- New: Add UI for editing user-owned Rune Configurations ---
// --- New: Add Realtime Updates for Runes and Abilities ---
// --- Modified: Use SacredRuneEngraver ---
// --- New: Add UI for executing Rune methods ---


import React, { useEffect, useState } from 'react';
// --- Modified: Import SacredRuneEngraver ---
import { SacredRuneEngraver } from '../core/rune-engrafting/SacredRuneEngraver';
// --- End Modified ---
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Import AuthorityForgingEngine
import { Rune, RuneManifest, User, ForgedAbility } from '../interfaces'; // Import ForgedAbility
import { Zap, ChevronDown, ChevronUp, Info, Code, Globe, Database, Palette, Webhook, Settings as SettingsIcon, User as UserIcon, Lock, Unlock, Package, GitCommit, PlusCircle, MinusCircle, Loader2, Edit, Save, XCircle, Trash2, Play } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
// --- Modified: Access sacredRuneEngraver ---
const sacredRuneEngraver: SacredRuneEngraver = window.systemContext?.sacredRuneEngraver; // The Sacred Rune Engraver (聖符文匠) pillar
// --- End Modified ---
const authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (權能鍛造) pillar
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Agents: React.FC = () => {
  const [publicRunes, setPublicRunes] = useState<Rune[]>([]); // State for public runes
  const [userRunes, setUserRunes] = useState<Rune[]>([]); // State for user-owned runes
  const [abilities, setAbilities] = useState<ForgedAbility[]>([]); // State for abilities
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRunes, setExpandedRunes] = useState<Record<string, boolean>>({}); // State to track expanded runes
  const [expandedAbilities, setExpandedAbilities] = useState<Record<string, boolean>>({}); // State to track expanded abilities
  const [installingRuneId, setInstallingRuneId] = useState<string | null>(null); // Track which rune is being installed
  const [uninstallingRuneId, setUninstallingRuneId] = useState<string | null>(null); // Track which rune is being uninstalled
  const [runeCapacity, setRuneCapacity] = useState<{ currentCost: number, capacity: number } | null>(null); // State for user's rune capacity

  // --- State for editing rune configuration ---
  const [editingRuneConfig, setEditingRuneConfig] = useState<Rune | null>(null); // The rune whose config is being edited
  const [editingConfigJson, setEditingConfigJson] = useState(''); // JSON string of the config being edited
  const [isSavingRuneConfig, setIsSavingRuneConfig] = useState(false);
  const [runeConfigEditError, setRuneConfigEditError] = useState<string | null>(null); // Error specific to rune config editing
  // --- End New ---

  // --- State for creating new ability (using structured data) ---
  const [isCreatingAbility, setIsCreatingAbility] = useState(false);
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');
  const [newAbilityScript, setNewAbilityScript] = useState('');
  // --- New: Structured Trigger State ---
  const [newAbilityTriggerType, setNewAbilityTriggerType] = useState('manual'); // Default trigger type
  const [newAbilityTriggerDetails, setNewAbilityTriggerDetails] = useState<any>({}); // Structured trigger details
  // --- End New ---
  const [isSavingAbility, setIsSavingAbility] = useState(false);


  // --- State for editing ability (using structured data) ---
  const [editingAbility, setEditingAbility] = useState<ForgedAbility | null>(null);
  const [editingAbilityName, setEditingAbilityName] = useState('');
  const [editingAbilityDescription, setEditingAbilityDescription] = useState('');
  const [editingAbilityScript, setEditingAbilityScript] = useState('');
  // --- New: Structured Trigger State (Edit) ---
  const [editingAbilityTriggerType, setEditingAbilityTriggerType] = useState('manual'); // Default trigger type
  const [editingAbilityTriggerDetails, setEditingAbilityTriggerDetails] = useState<any>({}); // Structured trigger details
  // --- End New ---
  const [isUpdatingAbility, setIsUpdatingAbility] = useState(false);


  const [executingAbility, setExecutingAbility] = useState<string | null>(null); // Track which ability is being executed
  const [executionResult, setExecutionResult] = useState<any>(null); // Result of the last executed ability
  const [showResultModal, setShowResultModal] = useState<boolean>(false); // Show result modal

  // --- New: State for executing Rune methods ---
  const [showExecuteRuneModal, setShowExecuteRuneModal] = useState<Rune | null>(null); // The rune whose method is being executed
  const [selectedRuneMethod, setSelectedRuneMethod] = useState<string>(''); // The method selected for execution
  const [runeMethodParamsJson, setRuneMethodParamsJson] = useState('{}'); // JSON string of parameters for the method
  const [runeMethodParamsError, setRuneMethodParamsError] = useState<string | null>(null); // Error for params JSON
  const [isExecutingRuneMethod, setIsExecutingRuneMethod] = useState(false);
  const [runeMethodExecutionResult, setRuneMethodExecutionResult] = useState<any>(null); // Result of rune method execution
  const [runeMethodExecutionError, setRuneMethodExecutionError] = useState<string | null>(null); // Error for rune method execution
  // --- End New ---


  const fetchRunesAndAbilities = async () => {
       const userId = systemContext?.currentUser?.id;
       // --- Modified: Use sacredRuneEngraver ---
       if (!sacredRuneEngraver || !authorityForgingEngine || !userId) {
            setError("Core modules not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null); // Clear main error when fetching
      try {
          // Fetch public runes
          const publicRunesList = await sacredRuneEngraver.listRunes(undefined, undefined); // Fetch public runes (no user ID)
          setPublicRunes(publicRunesList.filter(rune => rune.is_public)); // Ensure only public ones are listed here

          // Fetch user-owned runes
          const userRunesList = await sacredRuneEngraver.listRunes(undefined, userId); // Fetch user's runes
          setUserRunes(userRunesList.filter(rune => rune.user_id === userId)); // Ensure only user's ones are listed here

          // Fetch user's rune capacity
          const capacity = await sacredRuneEngraver.getUserRuneCapacity(userId);
          setRuneCapacity(capacity);
          // --- End Modified ---

          // Fetch abilities
          const userAbilities = await authorityForgingEngine.getAbilities(undefined, userId); // Fetch abilities for the current user (and public ones)
          setAbilities(userAbilities);


      } catch (err: any) {
          console.error('Error fetching runes or abilities:', err);
          setError(`Failed to load agents and abilities: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchRunesAndAbilities(); // Fetch all data on initial load
    }

    // --- New: Subscribe to realtime updates for runes and abilities ---
    let unsubscribeRuneInstalled: (() => void) | undefined;
    let unsubscribeRuneUninstalled: (() => void) | undefined;
    let unsubscribeRuneConfigUpdated: (() => void) | undefined;
    let unsubscribeAbilityForged: (() => void) | undefined;
    let unsubscribeAbilityUpdated: (() => void) | undefined;
    let unsubscribeAbilityDeleted: (() => void) | undefined;


    // --- Modified: Use sacredRuneEngraver ---
    if (sacredRuneEngraver?.context?.eventBus) { // Check if SacredRuneEngraver and its EventBus are available
        const eventBus = sacredRuneEngraver.context.eventBus;
    // --- End Modified ---
        const userId = systemContext?.currentUser?.id;

        // Subscribe to rune updates (insert, update, delete)
        unsubscribeRuneInstalled = eventBus.subscribe('rune_installed', (payload: Rune) => { // 'rune_installed' is published by installRune
            if (payload.user_id === userId) {
                console.log('Agents page received rune_installed event:', payload);
                // Add the new user rune and refetch public runes to update 'Installed' status
                setUserRunes(prevRunes => [...prevRunes, payload]);
                fetchRunesAndAbilities(); // Refetch all to update lists and capacity
            }
        });
         unsubscribeRuneConfigUpdated = eventBus.subscribe('rune_configuration_updated', (payload: Rune) => { // 'rune_configuration_updated' is published by updateRuneConfiguration
             if (payload.user_id === userId) {
                 console.log('Agents page received rune_configuration_updated event:', payload);
                 // Update the specific user rune in the state
                 setUserRunes(prevRunes => prevRunes.map(rune => rune.id === payload.id ? payload : rune));
             }
         });
          unsubscribeRuneUninstalled = eventBus.subscribe('rune_uninstalled', (payload: { runeId: string, userId: string }) => { // 'rune_uninstalled' is published by uninstallRune
             if (payload.userId === userId) {
                 console.log('Agents page received rune_uninstalled event:', payload);
                 // Remove the deleted user rune from the state and refetch public runes
                 setUserRunes(prevRunes => prevRunes.filter(rune => rune.id !== payload.runeId));
                 fetchRunesAndAbilities(); // Refetch all to update lists and capacity
             }
         });
         // Note: Public rune inserts/updates/deletes would also need subscriptions if they can change dynamically


        // Subscribe to ability updates (insert, update, delete)
        unsubscribeAbilityForged = eventBus.subscribe('ability_forged', (payload: ForgedAbility) => { // 'ability_forged' is published by manuallyForgeAbility/forgeAbilityFromActions
             if (payload.user_id === userId) {
                 console.log('Agents page received ability_forged event:', payload);
                 // Add the new ability and keep sorted by creation timestamp (newest first)
                 setAbilities(prevAbilities => [...prevAbilities, payload].sort((a, b) => new Date(b.creation_timestamp).getTime() - new Date(a.creation_timestamp).getTime()));
             }
         });
         unsubscribeAbilityUpdated = eventBus.subscribe('ability_updated', (payload: ForgedAbility) => {
             if (payload.user_id === userId) {
                 console.log('Agents page received ability_updated event:', payload);
                 // Update the specific ability in the state
                 setAbilities(prevAbilities => prevAbilities.map(ability => ability.id === payload.id ? payload : ability));
             }
         });
          unsubscribeAbilityDeleted = eventBus.subscribe('ability_deleted', (payload: { abilityId: string, userId: string }) => {
             if (payload.userId === userId) {
                 console.log('Agents page received ability_deleted event:', payload);
                 // Remove the deleted ability from the state
                 setAbilities(prevAbilities => prevAbilities.filter(ability => ability.id !== payload.abilityId));
             }
         });
         // Note: Ability execution events ('ability_executed', 'ability_execution_failed') are not handled here,
         // as they don't change the ability definition itself, but might update last_used_timestamp (handled by 'ability_updated').
    }
    // --- End New ---


    return () => {
        // Unsubscribe on component unmount
        unsubscribeRuneInstalled?.();
        unsubscribeRuneUninstalled?.();
        unsubscribeRuneConfigUpdated?.();
        unsubscribeAbilityForged?.();
        unsubscribeAbilityUpdated?.();
        unsubscribeAbilityDeleted?.();
    };

  }, [systemContext?.currentUser?.id, sacredRuneEngraver, authorityForgingEngine]); // Re-run effect when user ID or engine changes



    const getRuneTypeIcon = (type: Rune['type']) => {
        switch (type) {
            case 'api-adapter': return <Globe size={16} className="text-blue-400"/>;
            case 'script-plugin': return <Code size={16} className="text-green-400"/>;
            case 'ui-component': return <Palette size={16} className="text-purple-400"/>;
            case 'data-source': return <Database size={16} className="text-orange-400"/>;
            case 'automation-tool': return <SettingsIcon size={16} className="text-neutral-400"/>;
            case 'ai-agent': return <Zap size={16} className="text-cyan-400"/>;
            case 'device-adapter': return <Package size={16} className="text-yellow-400"/>;
            case 'webhook-trigger': return <Webhook size={16} className="text-red-400"/>;
            case 'system-adapter': return <Info size={16} className="text-gray-400"/>; // System adapter icon
            default: return <Info size={16} className="text-neutral-400"/>;
        }
    };



    const toggleExpandRune = (runeId: string) => {
        setExpandedRunes(prevState => ({
            ...prevState,
            [runeId]: !prevState[runeId]
        }));
    };

     const toggleExpandAbility = (abilityId: string) => {
        setExpandedAbilities(prevState => ({
            ...prevState,
            [abilityId]: !prevState[abilityId]
        }));
    };



    // --- New: Handle Install Rune ---
    const handleInstallRune = async (publicRuneId: string) => {
        const userId = systemContext?.currentUser?.id;
        // --- Modified: Use sacredRuneEngraver ---
        if (!sacredRuneEngraver || !userId) {
            alert("SacredRuneEngraver module not initialized or user not logged in.");
            return;
        }
        // --- End Modified ---
        console.log(`Attempting to install public rune: ${publicRuneId}`);
         // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
        authorityForgingEngine?.recordAction({
            type: 'web:agents:install_rune',
            details: { publicRuneId },
            context: { platform: 'web', page: 'agents' },
            user_id: userId, // Associate action with user
        });

        setInstallingRuneId(publicRuneId); // Indicate this rune is being installed
        setError(null); // Clear previous errors
        try {
            // Call the engine method to install the rune
            // --- Modified: Use sacredRuneEngraver ---
            const newUserRune = await sacredRuneEngraver.installRune(publicRuneId, userId); // Pass publicRuneId and userId
            // --- End Modified ---

            if (newUserRune) {
                // State update handled by realtime listener ('rune_installed' event)
                alert(`Rune \"${newUserRune.name}\" installed successfully!`);
                console.log('Installed new user rune:', newUserRune);
                // fetchRunesAndAbilities(); // Refetch runes and capacity - handled by listener
                 // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:agents:install_rune',
                    details: { runeId: newUserRune.id, name: newUserRune.name },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
            } else {
                 // This case might happen if the rune was already installed (checked by the engine)
                 alert('Rune installation skipped (already installed or other reason).');
            }

        } catch (err: any) {
            console.error(`Error installing rune ${publicRuneId}:`, err);
            setError(`Failed to install rune: ${err.message}`);
            alert(`Failed to install rune: ${err.message}`);
        } finally {
            setInstallingRuneId(null); // Reset installing state
        }
    };
    // --- End New ---

    // --- New: Handle Uninstall Rune ---
    const handleUninstallRune = async (userRuneId: string) => {
        const userId = systemContext?.currentUser?.id;
        // --- Modified: Use sacredRuneEngraver ---
        if (!sacredRuneEngraver || !userId) {
            alert("SacredRuneEngraver module not initialized or user not logged in.");
            return;
        }
        // --- End Modified ---
        if (!confirm(`Are you sure you want to uninstall this rune? This action cannot be undone.`)) return;

        console.log(`Attempting to uninstall user rune: ${userRuneId}`);
         // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
        authorityForgingEngine?.recordAction({
            type: 'web:agents:uninstall_rune',
            details: { userRuneId },
            context: { platform: 'web', page: 'agents' },
            user_id: userId, // Associate action with user
        });

        setUninstallingRuneId(userRuneId); // Indicate this rune is being uninstalled
        setError(null); // Clear previous errors
        try {
            // Call the engine method to uninstall the rune
            // --- Modified: Use sacredRuneEngraver ---
            const success = await sacredRuneEngraver.uninstallRune(userRuneId, userId); // Pass userRuneId and userId
            // --- End Modified ---

            if (success) {
                console.log('Rune uninstalled:', userRuneId);
                // State update handled by realtime listener ('rune_uninstalled' event)
                // fetchRunesAndAbilities(); // Refetch runes and capacity - handled by listener
                alert('Rune uninstalled successfully!');
            } else {
                setError('Failed to uninstall rune.');
                alert('Failed to uninstall rune.');
            }

        } catch (err: any) {
            console.error(`Error uninstalling rune ${userRuneId}:`, err);
            setError(`Failed to uninstall rune: ${err.message}`);
            alert(`Failed to uninstall rune: ${err.message}`);
        } finally {
            setUninstallingRuneId(null); // Reset uninstalling state
        }
    };
    // --- End New ---


    // --- New: Handle Edit Rune Configuration ---
    const handleEditRuneConfigClick = (rune: Rune) => {
        setEditingRuneConfig(rune);
        // Display current configuration as formatted JSON
        setEditingConfigJson(JSON.stringify(rune.configuration || {}, null, 2));
        setRuneConfigEditError(null); // Clear previous errors
    };

    const handleSaveRuneConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        // --- Modified: Use sacredRuneEngraver ---
        if (!sacredRuneEngraver || !editingRuneConfig || !userId) {
            alert("SacredRuneEngraver module not initialized, user not logged in, or no rune selected.");
            return;
        }
        // --- End Modified ---

        setIsSavingRuneConfig(true);
        setRuneConfigEditError(null);
        try {
            // Parse the JSON input
            const newConfig = JSON.parse(editingConfigJson);

            // Call the engine method to update the rune's configuration (Part of 符文嵌入 / 雙向同步領域)
            // --- Modified: Use sacredRuneEngraver ---
            const updatedRune = await sacredRuneEngraver.updateRuneConfiguration(editingRuneConfig.id, newConfig, userId); // Pass runeId, newConfig, userId
            // --- End Modified ---

            if (updatedRune) {
                console.log('Rune configuration updated:', updatedRune);
                // State update handled by realtime listener ('rune_configuration_updated' event)
                // Update the specific user rune in the state immediately for better UX
                setUserRunes(prevRunes => prevRunes.map(rune => rune.id === updatedRune.id ? updatedRune : rune));
                setEditingRuneConfig(null); // Close the modal
                setEditingConfigJson('');
                 alert('Rune configuration updated successfully!');
                 // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:agents:update_rune_config',
                    details: { runeId: updatedRune.id, name: updatedRune.name },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setRuneConfigEditError('Failed to update rune configuration.');
            }
        } catch (err: any) {
            console.error('Error updating rune configuration:', err);
            setRuneConfigEditError(`Failed to update configuration: ${err.message}`);
        } finally {
            setIsSavingRuneConfig(false);
        }
    };

    const handleCancelEditRuneConfig = () => {
        setEditingRuneConfig(null);
        setEditingConfigJson('');
        setRuneConfigEditError(null);
    };
    // --- End New ---


   // --- New: Handle Create Ability (using structured data) ---
   const handleCreateAbility = async (e: React.FormEvent) => {
       e.preventDefault();
       const userId = systemContext?.currentUser?.id;
       if (!authorityForgingEngine || !userId) {
           alert("AuthorityForgingEngine module not initialized or user not logged in.");
           return;
       }
       if (!newAbilityName.trim() || !newAbilityScript.trim()) {
           alert('Please enter name and script.');
           return;
       }
        // Basic validation for trigger details based on type
        if (newAbilityTriggerType === 'keyword' && !newAbilityTriggerDetails?.value?.trim()) {
            alert('Keyword trigger requires a keyword value.');
            return;
        }
         if (newAbilityTriggerType === 'schedule' && !newAbilityTriggerDetails?.cron?.trim()) {
            alert('Schedule trigger requires a cron expression.');
            return;
        }
         if (newAbilityTriggerType === 'event' && !newAbilityTriggerDetails?.eventType?.trim()) {
            alert('Event trigger requires an event type.');
            return;
        }


       setIsSavingAbility(true);
       setError(null);
       try {
           // Assemble the trigger object from structured state
           const triggerObject = {
               type: newAbilityTriggerType,
               ...newAbilityTriggerDetails, // Include specific details
           };

           // Create the ability (Part of 權能鍛造 / 六式奧義: 生成)
           const newAbility = await authorityForgingEngine.manuallyForgeAbility(
               newAbilityName,
               newAbilityDescription,
               newAbilityScript,
               triggerObject, // Use the assembled trigger object
               userId // Pass user ID
           );

           if (newAbility) {
               // State update handled by realtime listener ('ability_forged' event)
               alert(`Ability \"${newAbility.name}\" forged successfully!`);
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
                authorityForgingEngine?.recordAction({
                    type: 'web:agents:create_ability',
                    details: { abilityId: newAbility.id, name: newAbility.name },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to forge ability.');
           }
       } catch (err: any) {
           console.error('Error forging ability:', err);
           setError(`Failed to forge ability: ${err.message}`);
       } finally {
           setIsSavingAbility(false);
       }
   };
   // --- End New ---

    // --- New: Handle Edit Ability (using structured data) ---
    const handleEditAbilityClick = (ability: ForgedAbility) => {
        setEditingAbility(ability);
        setEditingAbilityName(ability.name);
        setEditingAbilityDescription(ability.description || '');
        setEditingAbilityScript(ability.script);
        // Set structured trigger state from the ability object
        setEditingAbilityTriggerType(ability.trigger?.type || 'manual');
        // Copy trigger details, excluding the type
        const { type, ...details } = ability.trigger || {};
        setEditingAbilityTriggerDetails(details || {});
        setError(null); // Clear previous errors when starting edit
    };

    const handleUpdateAbility = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!authorityForgingEngine || !editingAbility || !userId) return; // Safety checks

        if (!editingAbilityName.trim() || !editingAbilityScript.trim()) {
            alert('Please enter name and script.');
            return;
        }
         // Basic validation for trigger details based on type
        if (editingAbilityTriggerType === 'keyword' && !editingAbilityTriggerDetails?.value?.trim()) {
            alert('Keyword trigger requires a keyword value.');
            return;
        }
         if (editingAbilityTriggerType === 'schedule' && !editingAbilityTriggerDetails?.cron?.trim()) {
            alert('Schedule trigger requires a cron expression.');
            return;
        }
         if (editingAbilityTriggerType === 'event' && !editingAbilityTriggerDetails?.eventType?.trim()) {
            alert('Event trigger requires an event type.');
            return;
        }


        setIsUpdatingAbility(true);
        setError(null);
        try {
            // Assemble the trigger object from structured state
            const triggerObject = {
                type: editingAbilityTriggerType,
                ...editingAbilityTriggerDetails, // Include specific details
            };

            // Update the ability (Part of 權能鍛造 / 雙向同步領域)
            const updatedAbility = await authorityForgingEngine.updateAbility(editingAbility.id, {
                name: editingAbilityName,
                description: editingAbilityDescription,
                script: editingAbilityScript,
                trigger: triggerObject, // Use the assembled trigger object
            }, userId); // Pass userId

            if (updatedAbility) {
                console.log('Ability updated:', updatedAbility);
                // State update handled by realtime listener ('ability_updated' event)
                // Update the specific ability in the state immediately for better UX
                setAbilities(prevAbilities => prevAbilities.map(ability => ability.id === updatedAbility.id ? updatedAbility : ability));
                setEditingAbility(null); // Close edit form
                setEditingAbilityName('');
                setEditingAbilityDescription('');
                setEditingAbilityScript('');
                // Reset trigger state
                setEditingAbilityTriggerType('manual');
                setEditingAbilityTriggerDetails({});
                // fetchAbilities(); // Refetch abilities - handled by listener
                 // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:agents:update_ability',
                    details: { abilityId: updatedAbility.id, name: updatedAbility.name },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setError('Failed to update ability.');
            }
        } catch (err: any) {
            console.error('Error updating ability:', err);
            setError(`Failed to update ability: ${err.message}`);
        } finally {
            setIsUpdatingAbility(false);
        }
    };

    const handleCancelEditAbility = () => {
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


   const handleDeleteAbility = async (abilityId: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!authorityForgingEngine || !userId) {
           alert("AuthorityForgingEngine module not initialized or user not logged in.");
           return;
       }
       if (!confirm(`Are you sure you want to delete ability ${abilityId}?`)) return;

       setError(null);
       try {
           // Delete the ability (Part of 雙向同步領域)
           const success = await authorityForgingEngine.deleteAbility(abilityId, userId); // Pass user ID
           if (success) {
               console.log('Ability deleted:', abilityId);
               // State update handled by realtime listener ('ability_deleted' event)
               // fetchAbilities(); // Refetch abilities - handled by listener
                // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:agents:delete_ability',
                    details: { abilityId },
                    context: { platform: 'web', page: 'agents' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to delete ability.');
           }
       } catch (err: any) {
           console.error('Error deleting ability:', err);
           setError(`Failed to delete ability: ${err.message}`);
       } finally {
           // No specific loading state for delete, rely on main loading or individual item state if implemented
       }
   };

    const handleExecuteAbility = async (ability: ForgedAbility) => {
        const userId = systemContext?.currentUser?.id;
        if (!authorityForgingEngine || !userId) {
            alert("AuthorityForgingEngine module not initialized or user not logged in.");
            return;
        }
        console.log(`Attempting to execute ability: ${ability.name} (${ability.id})`);
         // Simulate recording user action (Part of 權能鍛造 / 六式奧義: 觀察)
        authorityForgingEngine?.recordAction({
            type: 'web:agents:run',
            details: { abilityId: ability.id, name: ability.name },
            context: { platform: 'web', page: 'agents' },
            user_id: userId, // Associate action with user
        });

        setExecutingAbility(ability.id); // Indicate this ability is running
        setExecutionResult(null); // Clear previous result
        setShowResultModal(false); // Hide previous modal
        setError(null); // Clear previous errors
        try {
            // Execute the ability (Part of 權能鍛造 / 六式奧義: 行動)
            // For MVP, params are hardcoded or empty. A real UI might have a modal for params.
            const result = await authorityForgingEngine.executeAbility(ability.id, userId, {}); // Pass user ID and empty params
            console.log(`Ability \"${ability.name}\" executed. Result:`, result);
            setExecutionResult(result); // Store the result
            setShowResultModal(true); // Show result modal
        } catch (err: any) {
            console.error(`Error executing ability \"${ability.name}\":`, err);
            setError(`Failed to execute ability \"${ability.name}\": ${err.message}`);
            setExecutionResult({ status: 'error', message: err.message }); // Store error in result
            setShowResultModal(true); // Show result modal even on error
        } finally {
            setExecutingAbility(null); // Reset executing state
        }
    };

    // --- New: Handle Execute Rune Method ---
    const handleExecuteRuneMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!sacredRuneEngraver || !userId || !showExecuteRuneModal || !selectedRuneMethod) {
            setRuneMethodParamsError("SacredRuneEngraver module not initialized, user not logged in, or rune/method not selected.");
            return;
        }

        // Validate JSON parameters
        let params: any;
        try {
            params = JSON.parse(runeMethodParamsJson);
            setRuneMethodParamsError(null); // Clear error if valid
        } catch (err: any) {
            setRuneMethodParamsError(`Invalid JSON parameters: ${err.message}`);
            return; // Stop if JSON is invalid
        }

        setIsExecutingRuneMethod(true);
        setRuneMethodExecutionResult(null); // Clear previous result
        setRuneMethodExecutionError(null); // Clear previous error
        setError(null); // Clear main error

        console.log(`Attempting to execute rune method: ${showExecuteRuneModal.name}.${selectedRuneMethod} with params:`, params);
         // Simulate recording user action
        authorityForgingEngine?.recordAction({
            type: 'web:agents:run_rune_method',
            details: { runeId: showExecuteRuneModal.id, runeName: showExecuteRuneModal.name, method: selectedRuneMethod, params },
            context: { platform: 'web', page: 'agents' },
            user_id: userId, // Associate action with user
        });


        try {
            // Call the SacredRuneEngraver method to execute the rune action
            const result = await sacredRuneEngraver.executeRuneAction(showExecuteRuneModal.id, selectedRuneMethod, params, userId); // Pass runeId, actionName, params, userId

            console.log(`Rune method executed. Result:`, result);
            setRuneMethodExecutionResult(result); // Store the result

        } catch (err: any) {
            console.error(`Error executing rune method ${showExecuteRuneModal.name}.${selectedRuneMethod}:`, err);
            setRuneMethodExecutionError(`Failed to execute method: ${err.message}`);
        } finally {
            setIsExecutingRuneMethod(false);
        }
    };
    // --- End New ---


    // --- New: Helper to render structured trigger details form ---
    const renderTriggerDetailsForm = (triggerType: string, triggerDetails: any, setTriggerDetails: (details: any) => void, disabled: boolean) => {
        switch (triggerType) {
            case 'manual':
                return <p className="text-neutral-400 text-sm">This ability is triggered manually.</p>;
            case 'keyword':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor="trigger-keyword-value" className="block text-neutral-400 text-xs font-semibold mb-1">Keyword:</label>
                        <input
                            id="trigger-keyword-value"
                            type="text"
                            className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={triggerDetails?.value || ''}
                            onChange={(e) => setTriggerDetails({ ...triggerDetails, value: e.target.value })}
                            placeholder="e.g., run report"
                            disabled={disabled}
                            required
                        />
                    </div>
                );
            case 'schedule':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor="trigger-schedule-cron" className="block text-neutral-400 text-xs font-semibold mb-1">Cron Expression:</label>
                        <input
                            id="trigger-schedule-cron"
                            type="text"
                            className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={triggerDetails?.cron || ''}
                            onChange={(e) => setTriggerDetails({ ...triggerDetails, cron: e.target.value })}
                            placeholder="e.g., 0 * * * *"
                            disabled={disabled}
                            required
                        />
                         <small className="text-neutral-400 text-xs block mt-1">Standard cron format (e.g., `0 * * * *` for every hour).</small>
                    </div>
                );
            case 'event':
                return (
                    <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                        <label htmlFor="trigger-event-type" className="block text-neutral-400 text-xs font-semibold mb-1">Event Type:</label>
                        <input
                            id="trigger-event-type"
                            type="text"
                            className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={triggerDetails?.eventType || ''}
                            onChange={(e) => setTriggerDetails({ ...triggerDetails, eventType: e.target.value })}
                            placeholder="e.g., task_completed"
                            disabled={disabled}
                            required
                        />
                         <small className="text-neutral-400 text-xs block mt-1">Triggered when this system event occurs.</small>
                    </div>
                );
            // Add cases for other trigger types (e.g., 'webhook', 'location', 'time')
            default:
                return (
                     <div className="mt-2 p-2 bg-neutral-600/50 rounded-md">
                         <label htmlFor="trigger-details-json" className="block text-neutral-400 text-xs font-semibold mb-1">Trigger Details (JSON):</label>
                         <textarea
                             id="trigger-details-json"
                             className="w-full p-1 rounded-md bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                             value={JSON.stringify(triggerDetails || {}, null, 2)}
                             onChange={(e) => {
                                 try {
                                     const parsed = JSON.parse(e.target.value); // Corrected: use 'parsed'
                                     setTriggerDetails(parsed); // Corrected: use 'parsed'
                                     // TODO: Clear any parsing error message if successful
                                 } catch (parseError) {
                                     console.error("Invalid JSON for trigger details:", parseError);
                                     // TODO: Display an error message for invalid JSON
                                 }
                             }}
                             rows={3}
                             disabled={disabled}
                             required
                          />
                     </div>
                );
        }
    };
    // --- End New ---


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your scripts and abilities.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Scripts & Abilities (權能鍛造)</h2>
        <p className="text-neutral-300 mb-8">Manage your automated scripts (Abilities) and review recent system activity.</p>

        {/* Form for manually forging new abilities */}
        {!editingAbility && (
            <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Forge New Ability</h3>
                 <form onSubmit={handleCreateAbility}>
                    <div className="mb-4">
                        <label htmlFor="newAbilityName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                        <input
                            id="newAbilityName"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newAbilityName}
                            onChange={(e) => setNewAbilityName(e.target.value)}
                            placeholder="Enter ability name"
                            disabled={isSavingAbility}
                            required
                        />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="newAbilityDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                        <input
                            id="newAbilityDescription"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newAbilityDescription}
                            onChange={(e) => setNewAbilityDescription(e.target.value)}
                            placeholder="Enter description"
                            disabled={isSavingAbility}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newAbilityScript" className="block text-neutral-300 text-sm font-semibold mb-2">Script (JavaScript/TypeScript):</label>
                         <textarea
                            id="newAbilityScript"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                            value={newAbilityScript}
                            onChange={(e) => setNewAbilityScript(e.target.value)}
                            placeholder="// Write your script here\nconsole.log('Hello from ability!');"
                            rows={8}
                            disabled={isSavingAbility}
                            required
                         />
                    </div>
                     {/* New: Structured Trigger Input */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Trigger:</h4>
                         <div className="mb-2">
                            <label htmlFor="newAbilityTriggerType" className="block text-neutral-400 text-xs font-semibold mb-1">Type:</label>
                            <select
                                id="newAbilityTriggerType"
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={newAbilityTriggerType}
                                onChange={(e) => { setNewAbilityTriggerType(e.target.value); setNewAbilityTriggerDetails({}); }} // Reset details when type changes
                                disabled={isSavingAbility}
                                required
                            >
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
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSavingAbility || !newAbilityName.trim() || !newAbilityScript.trim() || (newAbilityTriggerType === 'keyword' && !newAbilityTriggerDetails?.value?.trim()) || (newAbilityTriggerType === 'schedule' && !newAbilityTriggerDetails?.cron?.trim()) || (newAbilityTriggerType === 'event' && !newAbilityTriggerDetails?.eventType?.trim())}
                    >
                        {isSavingAbility ? 'Forging...' : 'Forge Ability'}
                    </button>
                     <button
                        type="button"
                        onClick={handleCancelCreate}
                        className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                        disabled={isSavingAbility}
                    >
                        Cancel
                    </button>
               </form>
                 {error && isSavingAbility === false && ( // Show create error only after it finishes
                     <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                 )}
            </div>
        )}

        {/* Form for editing an ability */}
        {editingAbility && ( // Show edit form if editing
             <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Edit Ability: {editingAbility.name}</h3>
                 <form onSubmit={handleUpdateAbility}>
                    <div className="mb-4">
                        <label htmlFor="editingAbilityName" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                        <input
                            id="editingAbilityName"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingAbilityName}
                            onChange={(e) => setEditingAbilityName(e.target.value)}
                            placeholder="Edit ability name"
                            disabled={isUpdatingAbility}
                            required
                        />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="editingAbilityDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description (Optional):</label>
                        <input
                            id="editingAbilityDescription"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingAbilityDescription}
                            onChange={(e) => setEditingAbilityDescription(e.target.value)}
                            placeholder="Edit description"
                            disabled={isUpdatingAbility}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="editingAbilityScript" className="block text-neutral-300 text-sm font-semibold mb-2">Script (JavaScript/TypeScript):</label>
                         <textarea
                            id="editingAbilityScript"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                            value={editingAbilityScript}
                            onChange={(e) => setEditingAbilityScript(e.target.value)}
                            rows={8}
                            disabled={isUpdatingAbility}
                            required
                         />
                    </div>
                     {/* New: Structured Trigger Input (Edit) */}
                     <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                        <h4 className="text-neutral-300 text-sm font-semibold mb-2">Trigger:</h4>
                         <div className="mb-2">
                            <label htmlFor="editingAbilityTriggerType" className="block text-neutral-400 text-xs font-semibold mb-1">Type:</label>
                            <select
                                id="editingAbilityTriggerType"
                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                value={editingAbilityTriggerType}
                                onChange={(e) => { setEditingAbilityTriggerType(e.target.value); setEditingAbilityTriggerDetails({}); }} // Reset details when type changes
                                disabled={isUpdatingAbility}
                                required
                            >
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
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdatingAbility || !editingAbilityName.trim() || !editingAbilityScript.trim() || (editingAbilityTriggerType === 'keyword' && !editingAbilityTriggerDetails?.value?.trim()) || (editingAbilityTriggerType === 'schedule' && !editingAbilityTriggerDetails?.cron?.trim()) || (editingAbilityTriggerType === 'event' && !editingAbilityTriggerDetails?.eventType?.trim())}
                        >
                            {isUpdatingAbility ? 'Saving...' : 'Save Changes'}
                        </button>
                         <button
                            type="button"
                            onClick={handleCancelEditAbility}
                            className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                            disabled={isUpdatingAbility}
                        >
                            Cancel
                        </button>
                    </div>
                     {error && isUpdatingAbility === false && ( // Show save error only after it finishes
                         <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                     )}
               </form>
            </div>
        ) }


        {/* Rune Configuration Edit Modal */}
        {editingRuneConfig && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300 mb-4">Edit Configuration for {editingRuneConfig.name}</h3>
                         <button
                             type="button"
                             onClick={handleCancelEditRuneConfig}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isSavingRuneConfig}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <form onSubmit={handleSaveRuneConfig}>
                         <div className="mb-4">
                             <label htmlFor="rune-config-json" className="block text-neutral-300 text-sm font-semibold mb-2">Configuration (JSON):</label>
                             <textarea
                                 id="rune-config-json"
                                 className={`w-full p-2 rounded-md bg-neutral-900 text-white border ${runeConfigEditError ? 'border-red-500' : 'border-neutral-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`}
                                 value={editingConfigJson}
                                 onChange={(e) => {
                                     setEditingConfigJson(e.target.value);
                                     try {
                                         JSON.parse(e.target.value);
                                         setRuneConfigEditError(null); // Clear error if JSON is valid
                                     } catch (err: any) {
                                         setRuneConfigEditError(`Invalid JSON: ${err.message}`);
                                     }
                                 }}
                                 rows={10}
                                 disabled={isSavingRuneConfig}
                                 required
                             />
                         </div>
                         {runeConfigEditError && <p className="text-red-400 text-sm mb-4">Error: {runeConfigEditError}</p>}
                         <div className="flex gap-4 justify-end">
                             <button
                                 type="button"
                                 onClick={handleCancelEditRuneConfig}
                                 className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                                 disabled={isSavingRuneConfig}
                             >
                                 Close
                             </button>
                             <button
                                 type="submit"
                                 className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 disabled={isSavingRuneConfig || !!runeConfigEditError} // Disable if saving or JSON is invalid
                             >
                                 {isSavingRuneConfig ? 'Saving...' : 'Save Configuration'}
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
        )}

        {/* Ability Execution Result Modal */}
        {showResultModal && (
             <div className="fixed inset-0 bg-black bg-opacity50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <h3 className="text-xl font-semibold text-blue-300 mb-4">Ability Execution Result</h3>
                     {executionResult ? (
                         <pre className="bg-neutral-900 p-4 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-neutral-700">
                             {JSON.stringify(executionResult, null, 2)}
                         </pre>
                     ) : (
                         <p className="text-neutral-400">No result available.</p>
                     )}
                     <div className="flex justify-end mt-6">
                         <button
                             type="button"
                             onClick={() => { setShowResultModal(false); setExecutionResult(null); }}
                             className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                         >
                             Close
                         </button>
                     </div>
                 </div>
             </div>
        )}

        {/* New: Execute Rune Method Modal */}
        {showExecuteRuneModal && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                 <div className="bg-neutral-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-semibold text-blue-300">Execute Method on {showExecuteRuneModal.name}</h3>
                         <button
                             type="button"
                             onClick={() => { setShowExecuteRuneModal(null); setSelectedRuneMethod(''); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); setRuneMethodExecutionResult(null); setRuneMethodExecutionError(null); }}
                             className="text-neutral-400 hover:text-white transition"
                             disabled={isExecutingRuneMethod}
                         >
                             <XCircle size={24} />
                         </button>
                     </div>
                     <p className="text-neutral-300 text-sm mb-4">Select a method to execute and provide parameters.</p>
                     <form onSubmit={handleExecuteRuneMethod}>
                         <div className="mb-4">
                             <label htmlFor="runeMethodSelect" className="block text-neutral-300 text-sm font-semibold mb-2">Method:</label>
                             <select
                                 id="runeMethodSelect"
                                 className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 value={selectedRuneMethod}
                                 onChange={(e) => { setSelectedRuneMethod(e.target.value); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); }} // Reset params when method changes
                                 disabled={isExecutingRuneMethod}
                                 required
                             >
                                 <option value="">-- Select Method --</option>
                                 {showExecuteRuneModal.manifest?.methods && Object.keys(showExecuteRuneModal.manifest.methods).map(methodName => (
                                     <option key={methodName} value={methodName}>{methodName}</option>
                                 ))}
                             </select>
                         </div>
                         {selectedRuneMethod && (
                             <div className="mb-4">
                                 <label htmlFor="runeMethodParamsJson" className="block text-neutral-300 text-sm font-semibold mb-2">Parameters (JSON):</label>
                                 <textarea
                                     id="runeMethodParamsJson"
                                     className={`w-full p-2 rounded-md bg-neutral-800 text-white border ${runeMethodParamsError ? 'border-red-500' : 'border-neutral-600'} focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs`}
                                     value={runeMethodParamsJson}
                                     onChange={(e) => {
                                         setRuneMethodParamsJson(e.target.value);
                                         try {
                                             JSON.parse(e.target.value);
                                             setRuneMethodParamsError(null); // Clear error if JSON is valid
                                         } catch (err: any) {
                                             setRuneMethodParamsError(`Invalid JSON: ${err.message}`);
                                         }
                                     }}
                                     rows={6}
                                     disabled={isExecutingRuneMethod}
                                     required
                                  />
                                 {runeMethodParamsError && <p className="text-red-400 text-sm mt-1">Error: {runeMethodParamsError}</p>}
                             </div>
                         )}

                         {runeMethodExecutionResult && (
                             <div className="mb-4">
                                 <h4 className="text-neutral-300 text-sm font-semibold mb-2">Result:</h4>
                                 <pre className="bg-neutral-900 p-3 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-700">
                                     {JSON.stringify(runeMethodExecutionResult, null, 2)}
                                 </pre>
                             </div>
                         )}
                          {runeMethodExecutionError && (
                             <div className="mb-4">
                                 <h4 className="text-neutral-300 text-sm font-semibold mb-2 text-red-400">Error:</h4>
                                 <pre className="bg-neutral-900 p-3 rounded-md text-red-200 text-xs font-mono overflow-x-auto max-h-48 scrollbar-thin scrollbar-thumb-neutral-700">
                                     {runeMethodExecutionError}
                                 </pre>
                             </div>
                          )}

                         <div className="flex gap-4 justify-end mt-4">
                             <button
                                 type="button"
                                 onClick={() => { setShowExecuteRuneModal(null); setSelectedRuneMethod(''); setRuneMethodParamsJson('{}'); setRuneMethodParamsError(null); setRuneMethodExecutionResult(null); setRuneMethodExecutionError(null); }}
                                 className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                                 disabled={isExecutingRuneMethod}
                             >
                                 Close
                             </button>
                             <button
                                 type="submit"
                                 className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                 disabled={isExecutingRuneMethod || !selectedRuneMethod || !!runeMethodParamsError} // Disable if executing, no method selected, or params JSON is invalid
                             >
                                 {isExecutingRuneMethod ? 'Executing...' : 'Execute'}
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
        )}
        {/* End New */}


      </div>
    </div>
  );
};

export default Agents;
```