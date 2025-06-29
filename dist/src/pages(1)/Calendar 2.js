"use strict";
`` `typescript
// src/pages/Calendar.tsx
// Calendar Page
// Displays and manages user's calendar events.
// --- New: Create a page for the Calendar UI ---\
// --- New: Implement fetching and displaying calendar events ---\
// --- New: Add UI for creating, editing, and deleting events ---\
// --- New: Add Realtime Updates for calendar_events ---\
\
\
import React, { useEffect, useState } from 'react';\
import { CalendarService } from '../core/calendar/CalendarService'; // To fetch and manage events\
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Use for action recording\
import { CalendarEvent } from '../interfaces'; // Import CalendarEvent type\
import { CalendarDays, ChevronDown, ChevronUp, Trash2, Edit, PlusCircle, Save, Loader2, Info, Star, StarHalf, StarOff, Tag, MapPin, Link as LinkIcon } from 'lucide-react'; // Import icons including MapPin, LinkIcon\
\
\
// Access core modules from the global window object (for MVP simplicity)\
// In a real app, use React Context or dependency injection\
declare const window: any;\
const calendarService: CalendarService = window.systemContext?.calendarService; // The Calendar Service\
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)\
const systemContext: any = window.systemContext; // Access the full context for currentUser\
\
\
const Calendar: React.FC = () => {\
  const [events, setEvents] = useState<CalendarEvent[]>([]); // State to hold calendar events\
  const [loading, setLoading] = useState(true);\
  const [error, setError] = useState<string | null>(null);\
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({}); // State to track expanded events\
\
  // --- State for creating new event ---\
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);\
  const [newEventTitle, setNewEventTitle] = useState('');\
  const [newEventDescription, setNewEventDescription] = useState('');\
  const [newEventStartTime, setNewEventStartTime] = useState(''); // ISO 8601 string\
  const [newEventEndTime, setNewEventEndTime] = useState(''); // ISO 8601 string\
  const [newEventAllDay, setNewEventAllDay] = useState(false);\
  const [newEventLocation, setNewEventLocation] = useState('');\
  const [newEventUrl, setNewEventUrl] = useState('');\
  const [newEventTags, setNewEventTags] = useState<string[]>([]);\
  const [isSavingEvent, setIsSavingEvent] = useState(false);\
  // --- End New ---\
\
  // --- State for editing event ---\
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null); // The event being edited\
  const [editingEventTitle, setEditingEventTitle] = useState('');\
  const [editingEventDescription, setEditingEventDescription] = useState('');\
  const [editingEventStartTime, setEditingEventStartTime] = useState(''); // ISO 8601 string\
  const [editingEventEndTime, setEditingEventEndTime] = useState(''); // ISO 8601 string\
  const [editingEventAllDay, setEditingEventAllDay] = useState(false);\
  const [editingEventLocation, setEditingEventLocation] = useState('');\
  const [editingEventUrl, setEditingEventUrl] = useState('');\
  const [editingEventTags, setEditingEventTags] = useState<string[]>([]);\
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);\
  // --- End New ---\
\
\
  const fetchEvents = async () => {\
       const userId = systemContext?.currentUser?.id;\
       if (!calendarService || !userId) {\
            setError(\"CalendarService module not initialized or user not logged in.\");\
            setLoading(false);\
            return;\
        }\
      setLoading(true);\
      setError(null); // Clear main error when fetching\
      try {\
          // Fetch calendar events for the current user\
          // For MVP, fetch all events. In a real calendar, you'd fetch for a specific date range.\
          const userEvents = await calendarService.getEvents(userId); // Pass user ID\
          setEvents(userEvents);\
      } catch (err: any) {\
          console.error('Error fetching calendar events:', err);\
          setError(`;
Failed;
to;
load;
calendar;
events: $;
{
    err.message;
}
`);\
      } finally {\
          setLoading(false);\
      }\
  };\
\
  useEffect(() => {\
    // Fetch data when the component mounts or when the user changes\
    if (systemContext?.currentUser?.id) {\
        fetchEvents(); // Fetch all events on initial load\
    }\
\
    // --- New: Subscribe to realtime updates for calendar_events ---\
    let unsubscribeInsert: (() => void) | undefined;\
    let unsubscribeUpdate: (() => void) | undefined;\
    let unsubscribeDelete: (() => void) | undefined;\
\
\
    if (calendarService?.context?.eventBus) { // Check if CalendarService and its EventBus are available\
        const eventBus = calendarService.context.eventBus;\
        const userId = systemContext?.currentUser?.id;\
\
        // Subscribe to insert events\
        unsubscribeInsert = eventBus.subscribe('calendar_event_insert', (payload: CalendarEvent) => {\
            if (payload.user_id === userId) {\
                console.log('Calendar page received calendar_event_insert event:', payload);\
                // Add the new event and keep sorted by start_timestamp (newest first)\
                setEvents(prevEvents => [payload, ...prevEvents].sort((a, b) => new Date(b.start_timestamp).getTime() - new Date(a.start_timestamp).getTime()));\
            }\
        });\
\
        // Subscribe to update events\
        unsubscribeUpdate = eventBus.subscribe('calendar_event_update', (payload: CalendarEvent) => {\
             if (payload.user_id === userId) {\
                 console.log('Calendar page received calendar_event_update event:', payload);\
                 // Update the specific event in the state\
                 setEvents(prevEvents => prevEvents.map(event => event.id === payload.id ? payload : event));\
             }\
         });\
\
        // Subscribe to delete events\
        unsubscribeDelete = eventBus.subscribe('calendar_event_delete', (payload: { eventId: string, userId: string }) => {\
             if (payload.userId === userId) {\
                 console.log('Calendar page received calendar_event_delete event:', payload);\
                 // Remove the deleted event from the state\
                 setEvents(prevEvents => prevEvents.filter(event => event.id !== payload.eventId));\
             }\
         });\
    }\
    // --- End New ---\
\
\
    return () => {\
        // Unsubscribe on component unmount\
        unsubscribeInsert?.();\
        unsubscribeUpdate?.();\
        unsubscribeDelete?.();\
    };\
\
  }, [systemContext?.currentUser?.id, calendarService]); // Re-run effect when user ID or service changes\
\
\
    const toggleExpandEvent = (eventId: string) => {\
        setExpandedEvents(prevState => ({\
            ...prevState,\
            [eventId]: !prevState[eventId]\
        }));\
    };\
\
    // --- New: Handle Create Event ---\
    const handleCreateEvent = async (e: React.FormEvent) => {\
        e.preventDefault();\
        const userId = systemContext?.currentUser?.id;\
        if (!calendarService || !userId || !newEventTitle.trim() || !newEventStartTime) {\
            alert(\"CalendarService module not initialized, user not logged in, or title/start time is empty.\");\
            return;\
        }\
\
        setIsSavingEvent(true);\
        setError(null);\
        try {\
            const eventDetails: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'> = {\
                user_id: userId, // Ensure user_id is included\
                title: newEventTitle.trim(),\
                description: newEventDescription.trim() || undefined,\
                start_timestamp: newEventStartTime,\
                end_timestamp: newEventEndTime || undefined,\
                all_day: newEventAllDay,\
                location: newEventLocation.trim() || undefined,\
                url: newEventUrl.trim() || undefined,\
                source: 'manual', // Manually created event\
                tags: newEventTags.map(tag => tag.trim()).filter(tag => tag),\
            };\
\
            // Create the event\
            const createdEvent = await calendarService.createEvent(eventDetails, userId); // Pass eventDetails and userId\
\
            if (createdEvent) {\
                alert(`;
Calendar;
event;
"${createdEvent.title}\\\" created successfully!`);\
                console.log('Created new event:', createdEvent);\
                // Reset form\
                setNewEventTitle('');\
                setNewEventDescription('');\
                setNewEventStartTime('');\
                setNewEventEndTime('');\
                setNewEventAllDay(false);\
                setNewEventLocation('');\
                setNewEventUrl('');\
                setNewEventTags([]);\
                setIsCreatingEvent(false); // Hide form\
                // State update handled by realtime listener\
                 // Simulate recording user action\
                authorityForgingEngine?.recordAction({\
                    type: 'web:calendar:create',\
                    details: { eventId: createdEvent.id, title: createdEvent.title },\
                    context: { platform: 'web', page: 'calendar' },\
                    user_id: userId, // Associate action with user\
                });\
            } else {\
                setError('Failed to create calendar event.');\
            }\
        } catch (err: any) {\
            console.error('Error creating calendar event:', err);\
            setError(`Failed to create calendar event: ${err.message}`);\
        } finally {\
            setIsSavingEvent(false);\
        }\
    };\
\
    const handleCancelCreate = () => {\
        setIsCreatingEvent(false);\
        setNewEventTitle('');\
        setNewEventDescription('');\
        setNewEventStartTime('');\
        setNewEventEndTime('');\
        setNewEventAllDay(false);\
        setNewEventLocation('');\
        setNewEventUrl('');\
        setNewEventTags([]);\
        setError(null); // Clear error when cancelling\
    };\
    // --- End New ---\
\
    // --- New: Handle Edit Event ---\
    const handleEditEventClick = (event: CalendarEvent) => {\
        setEditingEvent(event);\
        setEditingEventTitle(event.title);\
        setEditingEventDescription(event.description || '');\
        setEditingEventStartTime(event.start_timestamp);\
        setEditingEventEndTime(event.end_timestamp || '');\
        setEditingEventAllDay(event.all_day);\
        setEditingEventLocation(event.location || '');\
        setEditingEventUrl(event.url || '');\
        setEditingEventTags(event.tags || []);\
        setError(null); // Clear previous errors when starting edit\
    };\
\
    const handleUpdateEvent = async (e: React.FormEvent) => {\
        e.preventDefault();\
        const userId = systemContext?.currentUser?.id;\
        if (!calendarService || !editingEvent || !userId) return; // Safety checks\
\
        if (!editingEventTitle.trim() || !editingEventStartTime) {\
            alert('Please enter title and start time.');\
            return;\
        }\
\
        setIsUpdatingEvent(true);\
        setError(null);\
        try {\
            const updates: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = {\
                title: editingEventTitle.trim(),\
                description: editingEventDescription.trim() || undefined,\
                start_timestamp: editingEventStartTime,\
                end_timestamp: editingEventEndTime || undefined,\
                all_day: editingEventAllDay,\
                location: editingEventLocation.trim() || undefined,\
                url: editingEventUrl.trim() || undefined,\
                tags: editingEventTags.map(tag => tag.trim()).filter(tag => tag),\
                // Source is not typically updated manually\
            };\
\
            // Update the event\
            const updatedEvent = await calendarService.updateEvent(editingEvent.id, updates, userId); // Pass eventId, updates, userId\
\
            if (updatedEvent) {\
                alert(`Calendar event \\\"${updatedEvent.title}\\\" updated successfully!`);\
                console.log('Event updated:', updatedEvent);\
                setEditingEvent(null); // Close edit form\
                setEditingEventTitle('');\
                setEditingEventDescription('');\
                setEditingEventStartTime('');\
                setEditingEventEndTime('');\
                setEditingEventAllDay(false);\
                setEditingEventLocation('');\
                setEditingEventUrl('');\
                setEditingEventTags([]);\
                // State update handled by realtime listener\
                 // Simulate recording user action\
                authorityForgingEngine?.recordAction({\
                    type: 'web:calendar:update',\
                    details: { eventId: updatedEvent.id, title: updatedEvent.title },\
                    context: { platform: 'web', page: 'calendar' },\
                    user_id: userId, // Associate action with user\
                });\
            } else {\
                setError('Failed to update calendar event.');\
            }\
        } catch (err: any) {\
            console.error('Error updating calendar event:', err);\
            setError(`Failed to update calendar event: ${err.message}`);\
        } finally {\
            setIsUpdatingEvent(false);\
        }\
    };\
\
    const handleCancelEdit = () => {\
        setEditingEvent(null);\
        setEditingEventTitle('');\
        setEditingEventDescription('');\
        setEditingEventStartTime('');\
        setEditingEventEndTime('');\
        setEditingEventAllDay(false);\
        setEditingEventLocation('');\
        setEditingEventUrl('');\
        setEditingEventTags([]);\
        setError(null);\
    };\
    // --- End New ---\
\
\
   const handleDeleteEvent = async (eventId: string) => {\
       const userId = systemContext?.currentUser?.id;\
       if (!calendarService || !userId) {\
           alert(\"CalendarService module not initialized or user not logged in.\");\
           return;\
       }\
       if (!confirm(`Are you sure you want to delete this calendar event?`)) return;\
\
       setError(null);\
       try {\
           // Delete the event\
           const success = await calendarService.deleteEvent(eventId, userId); // Pass eventId and userId\
           if (success) {\
               console.log('Event deleted:', eventId);\
               // State update handled by realtime listener\
                alert('Calendar event deleted successfully!');\
                 // Simulate recording user action\
                authorityForgingEngine?.recordAction({\
                    type: 'web:calendar:delete',\
                    details: { eventId },\
                    context: { platform: 'web', page: 'calendar' },\
                    user_id: userId, // Associate action with user\
                });\
           } else {\
               setError('Failed to delete calendar event.');\
           }\
       } catch (err: any) {\
           console.error('Error deleting calendar event:', err);\
           setError(`Failed to delete calendar event: ${err.message}`);\
       } finally {\
           setLoading(false); // Ensure loading is false after delete attempt\
       }\
   };\
\
    // --- New: Handle Tag Input Change ---\
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {\
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);\
        if (isEditing) {\
            setEditingEventTags(tags);\
        } else {\
            setNewEventTags(tags);\
        }\
    };\
\
    const getTagInputString = (tags: string[] | undefined) => {\
        return (tags || []).join(', ');\
    };\
    // --- End New ---\
\
\
   // Ensure user is logged in before rendering content\
  if (!systemContext?.currentUser) {\
       // This case should ideally be handled by ProtectedRoute, but as a fallback:\
       return (\
            <div className=\"container mx-auto p-4 flex justify-center\">\
               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">\
                   <p>Please log in to view your calendar.</p>\
               </div>\
            </div>\
       );\
  }\
\
\
  return (\
    <div className=\"container mx-auto p-4\">\
      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">\
        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Calendar (\u65e5\u66c6)</h2>\
        <p className=\"text-neutral-300 mb-8\">Manage your personal calendar events.</p>\
\
        {/* Form for creating new events */}\
        {!isCreatingEvent && !editingEvent && ( // Only show create button if not creating or editing\
            <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Add New Calendar Event</h3>\
                 <button\
                     className=\"px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50\"\
                     onClick={() => { setIsCreatingEvent(true); setError(null); }}\
                     disabled={isSavingEvent || isUpdatingEvent}\
                 >\
                     <PlusCircle size={20} className=\"inline-block mr-2\"/> Add Event\
                 </button>\
            </div>\
        )}\
\
        {isCreatingEvent && !editingEvent && ( // Show create form if creating and not editing\
             <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\
                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">New Calendar Event</h3>\
                 <form onSubmit={handleCreateEvent}>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newEventTitle\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Title:</label>\
                         <input\
                            id=\"newEventTitle\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={newEventTitle}\
                            onChange={(e) => setNewEventTitle(e.target.value)}\
                            placeholder=\"Event Title\"\
                            disabled={isSavingEvent}\
                            required\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newEventDescription\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Description (Optional):</label>\
                         <textarea\
                            id=\"newEventDescription\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={newEventDescription}\
                            onChange={(e) => setNewEventDescription(e.target.value)}\
                            placeholder=\"Event Description\"\
                            rows={3}\
                            disabled={isSavingEvent}\
                         />\
                    </div>\
                     <div className=\"mb-4 grid grid-cols-2 gap-4\">\
                         <div>\
                             <label htmlFor=\"newEventStartTime\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Start Time:</label>\
                             <input\
                                 id=\"newEventStartTime\"\
                                 type=\"datetime-local\" // Use datetime-local for date and time input\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={newEventStartTime}\
                                 onChange={(e) => setNewEventStartTime(e.target.value)}\
                                 disabled={isSavingEvent}\
                                 required\
                             />\
                         </div>\
                          <div>\
                             <label htmlFor=\"newEventEndTime\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">End Time (Optional):</label>\
                             <input\
                                 id=\"newEventEndTime\"\
                                 type=\"datetime-local\" // Use datetime-local for date and time input\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={newEventEndTime}\
                                 onChange={(e) => setNewEventEndTime(e.target.value)}\
                                 disabled={isSavingEvent}\
                             />\
                         </div>\
                     </div>\
                     <div className=\"mb-4 flex items-center gap-2\">\
                         <input\
                             type=\"checkbox\"\
                             id=\"newEventAllDay\"\
                             className=\"form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500\"\
                             checked={newEventAllDay}\
                             onChange={(e) => setNewEventAllDay(e.target.checked)}\
                             disabled={isSavingEvent}\
                         />\
                         <label htmlFor=\"newEventAllDay\" className=\"text-neutral-300 text-sm\">All Day Event</label>\
                     </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newEventLocation\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Location (Optional):</label>\
                         <input\
                            id=\"newEventLocation\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={newEventLocation}\
                            onChange={(e) => setNewEventLocation(e.target.value)}\
                            placeholder=\"Event Location\"\
                            disabled={isSavingEvent}\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newEventUrl\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">URL (Optional):</label>\
                         <input\
                            id=\"newEventUrl\"\
                            type=\"url\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={newEventUrl}\
                            onChange={(e) => setNewEventUrl(e.target.value)}\
                            placeholder=\"Event URL\"\
                            disabled={isSavingEvent}\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"newEventTags\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Tags (comma-separated, Optional):</label>\
                         <input\
                            id=\"newEventTags\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                            value={getTagInputString(newEventTags)}\
                            onChange={(e) => handleTagInputChange(e, false)}\
                            placeholder=\"e.g., meeting, personal, work\"\n                            disabled={isSavingEvent}\n                         />\n                    </div>\n\n                    <div className=\"flex gap-4\">\n                        <button\n                            type=\"submit\"\n                            className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n                            disabled={isSavingEvent || !newEventTitle.trim() || !newEventStartTime}\n                        >\n                            {isSavingEvent ? 'Saving...' : 'Save Event'}\n                        </button>\n                         <button\n                            type=\"button\"\n                            onClick={handleCancelCreate}\n                            className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\n                            disabled={isSavingEvent}\n                        >\n                            Cancel\n                        </button>\n                    </div>\n               </form>\n                 {error && isSavingEvent === false && ( // Show create error only after it finishes\n                     <p className=\"text-red-400 text-sm mt-4\">Error: {error}</p>\n                 )}\n            </div>\n        )}\n\n        {/* Form for editing an event */}\n        {editingEvent && ( // Show edit form if editing\n             <div className=\"mb-8 p-4 bg-neutral-700/50 rounded-lg\">\n                 <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Edit Calendar Event: {editingEvent.title}</h3>\n                 <form onSubmit={handleUpdateEvent}>\n                     <div className=\"mb-4\">\n                        <label htmlFor=\"editingEventTitle\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Title:</label>\n                         <input\n                            id=\"editingEventTitle\"\n                            type=\"text\"\n                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                            value={editingEventTitle}\n                            onChange={(e) => setEditingEventTitle(e.target.value)}\n                            placeholder=\"Event Title\"\n                            disabled={isUpdatingEvent}\n                            required\n                         />\n                    </div>\n                     <div className=\"mb-4\">\n                        <label htmlFor=\"editingEventDescription\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Description (Optional):</label>\n                         <textarea\n                            id=\"editingEventDescription\"\n                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\n                            value={editingEventDescription}\n                            onChange={(e) => setEditingEventDescription(e.target.value)}\n                            placeholder=\"Event Description\"\n                            rows={3}\n                            disabled={isUpdatingEvent}\n                         />\n                    </div>\n                     <div className=\"mb-4 grid grid-cols-2 gap-4\">\
                         <div>\
                             <label htmlFor=\"editingEventStartTime\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Start Time:</label>\
                             <input\
                                 id=\"editingEventStartTime\"\
                                 type=\"datetime-local\" // Use datetime-local for date and time input\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={editingEventStartTime}\
                                 onChange={(e) => setEditingEventStartTime(e.target.value)}\
                                 disabled={isUpdatingEvent}\
                                 required\
                             />\
                         </div>\
                          <div>\
                             <label htmlFor=\"editingEventEndTime\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">End Time (Optional):</label>\
                             <input\
                                 id=\"editingEventEndTime\"\
                                 type=\"datetime-local\" // Use datetime-local for date and time input\
                                 className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                                 value={editingEventEndTime}\
                                 onChange={(e) => setEditingEventEndTime(e.target.value)}\
                                 disabled={isUpdatingEvent}\
                             />\
                         </div>\
                     </div>\
                     <div className=\"mb-4 flex items-center gap-2\">\
                         <input\
                             type=\"checkbox\"\
                             id=\"editingEventAllDay\"\
                             className=\"form-checkbox h-4 w-4 text-blue-600 rounded border-neutral-600 bg-neutral-800 focus:ring-blue-500\"\
                             checked={editingEventAllDay}\
                             onChange={(e) => setEditingEventAllDay(e.target.checked)}\
                             disabled={isUpdatingEvent}\
                         />\
                         <label htmlFor=\"editingEventAllDay\" className=\"text-neutral-300 text-sm\">All Day Event</label>\
                     </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"editingEventLocation\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Location (Optional):</label>\
                         <input\
                            id=\"editingEventLocation\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={editingEventLocation}\
                            onChange={(e) => setEditingEventLocation(e.target.value)}\
                            placeholder=\"Event Location\"\
                            disabled={isUpdatingEvent}\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"editingEventUrl\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">URL (Optional):</label>\
                         <input\
                            id=\"editingEventUrl\"\
                            type=\"url\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500\"\
                            value={editingEventUrl}\
                            onChange={(e) => setEditingEventUrl(e.target.value)}\
                            placeholder=\"Event URL\"\
                            disabled={isUpdatingEvent}\
                         />\
                    </div>\
                     <div className=\"mb-4\">\
                        <label htmlFor=\"editingEventTags\" className=\"block text-neutral-300 text-sm font-semibold mb-2\">Tags (comma-separated, Optional):</label>\
                         <input\
                            id=\"editingEventTags\"\
                            type=\"text\"\
                            className=\"w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm\"\
                            value={getTagInputString(editingEventTags)}\
                            onChange={(e) => handleTagInputChange(e, true)}\
                            placeholder=\"e.g., meeting, personal, work\"\n                            disabled={isUpdatingEvent}\n                         />\n                    </div>\n\n                    <div className=\"flex gap-4\">\
                        <button\
                            type=\"submit\"\
                            className=\"px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                            disabled={isUpdatingEvent || !editingEventTitle.trim() || !editingEventStartTime}\
                        >\
                            {isUpdatingEvent ? 'Saving...' : 'Save Changes'}\
                        </button>\
                         <button\
                            type=\"button\"\
                            onClick={handleCancelEdit}\
                            className=\"px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition\"\
                            disabled={isUpdatingEvent}\
                        >\
                            Cancel\
                        </button>\
                    </div>\
               </form>\
                 {error && isUpdatingEvent === false && ( // Show update error only after it finishes\
                     <p className=\"text-red-400 text-sm mt-4\">Error: {error}</p>\
                 )}\
            </div>\
        )}\
\
\
        {/* Events List */}\
        <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\
            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Your Calendar Events ({events.length})</h3>\
            {loading && !isSavingEvent && !isUpdatingEvent ? ( // Show loading only if not currently saving/updating\
              <p className=\"text-neutral-400\">Loading calendar events...</p>\
            ) : error && !isCreatingEvent && !editingEvent ? ( // Show main error if not in create/edit mode\
                 <p className=\"text-red-400\">Error: {error}</p>\
            ) : events.length === 0 ? (\
              <p className=\"text-neutral-400\">No calendar events found yet. Add one using the form above.</p>\
            ) : (\
              <ul className=\"space-y-4\">\
                {events.map((event) => (\
                  <li key={event.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500`}>\
                    <div className=\"flex justify-between items-center mb-2\">\
                        <div className=\"flex items-center gap-3\">\
                            <CalendarDays size={20} className=\"text-blue-400\"/>\
                            <h4 className=\"font-semibold text-blue-200\">{event.title}</h4>\
                        </div>\
                         {/* Expand/Collapse Button */}\
                         <div className=\"flex gap-2 items-center\">\
                             <button onClick={() => toggleExpandEvent(event.id)} className=\"text-neutral-400 hover:text-white transition\">\
                                {expandedEvents[event.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>\
                         </div>\
                    </div>\
                    <p className=\"text-neutral-300 text-sm\">\
                        {new Date(event.start_timestamp).toLocaleString()}\
                        {event.end_timestamp && ` - ${new Date(event.end_timestamp).toLocaleString()}`}\
                        {event.all_day && ' (All Day)'}\
                    </p>\
                    {event.location && <p className=\"text-neutral-300 text-sm flex items-center gap-1\"><MapPin size={14}/> {event.location}</p>}\
                    {event.url && <p className=\"text-neutral-300 text-sm flex items-center gap-1\"><LinkIcon size={14}/> <a href={event.url} target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-blue-400 hover:underline\">{event.url}</a></p>}\
\
                    {/* Description (Collapsible) */}\
                    {expandedEvents[event.id] && event.description && (\
                         <div className=\"mt-2 border-t border-neutral-600 pt-2\">\
                             <div className=\"text-neutral-300 text-sm prose prose-invert max-w-none\"> {/* Use prose for markdown styling */}\
                                 <ReactMarkdown>{event.description}</ReactMarkdown>\
                             </div>\
                         </div>\
                    )}\
                    <small className=\"text-neutral-400 text-xs block mt-2\">\
                        ID: {event.id} | Source: {event.source || 'manual'}\
                         {event.tags && event.tags.length > 0 && ` | Tags: ${event.tags.join(', ')}`}\
                         {event.created_at && ` | Created: ${new Date(event.created_at).toLocaleString()}`}\
                         {event.updated_at && ` | Updated: ${new Date(event.updated_at).toLocaleString()}`}\
                    </small>\
\
                    {/* Event Actions */}\
                    <div className=\"mt-3 flex gap-2\">\
                         {/* Edit Button */}\
                         <button\
                            className=\"px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                            onClick={() => handleEditEventClick(event)}\
                            disabled={isSavingEvent || isUpdatingEvent}\
                         >\
                            <Edit size={16} className=\"inline-block mr-1\"/> Edit\
                         </button>\
                         {/* Delete Button */}\
                         <button\
                            className=\"px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\
                            onClick={() => handleDeleteEvent(event.id)}\
                            disabled={isSavingEvent || isUpdatingEvent}\
                         >\
                            <Trash2 size={16} className=\"inline-block mr-1\"/> Delete\
                         </button>\
                         {/* TODO: Add Copy button (Part of \u6b0a\u80fd\u935b\u9020: \u89c0\u5bdf - record action) */}\
                    </div>\
                  </li>\
                ))}\
              </ul>\
            )}\
        </div>\
\
      </div>\
    </div>\
  );\n};\n\nexport default Calendar;\n```;
