var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/pages/Notifications.tsx\n// Notifications Page\n// Displays user notifications.\n// --- New: Add UI for listing and marking notifications as read ---\n\nimport React, { useEffect, useState } from 'react';\nimport { NotificationService, Notification } from '../modules/notifications/NotificationService'; // Import Notification type\nimport { Info, AlertTriangle, CheckCircle, XCircle, MailOpen, Loader2 } from 'lucide-react'; // Import icons\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst notificationService: NotificationService = window.systemContext?.notificationService; // The Notification (\u901A\u77E5\u670D\u52D9) module\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6B0A\u80FD\u935B\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Notifications: React.FC = () => {\n  const [notifications, setNotifications] = useState<Notification[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [markingAsReadId, setMarkingAsReadId] = useState<string | null>(null); // Track which notification is being marked as read\n\n\n  const fetchNotifications = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!notificationService || !userId) {\n            setError(\"NotificationService module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null);\n      try {\n          // Fetch unread notifications for the current user from Supabase (Part of \u96D9\u5410\u540C\u6B65\u9818\u57DF)\n          const userNotifications = await notificationService.getNotifications(userId, false); // Fetch unread notifications\n          setNotifications(userNotifications);\n      } catch (err: any) {\n          console.error('Error fetching notifications:', err);\n          setError("], ["typescript\n// src/pages/Notifications.tsx\n// Notifications Page\n// Displays user notifications.\n// --- New: Add UI for listing and marking notifications as read ---\n\nimport React, { useEffect, useState } from 'react';\nimport { NotificationService, Notification } from '../modules/notifications/NotificationService'; // Import Notification type\nimport { Info, AlertTriangle, CheckCircle, XCircle, MailOpen, Loader2 } from 'lucide-react'; // Import icons\n\n\n// Access core modules from the global window object (for MVP simplicity)\n// In a real app, use React Context or dependency injection\ndeclare const window: any;\nconst notificationService: NotificationService = window.systemContext?.notificationService; // The Notification (\\u901a\\u77e5\\u670d\\u52d9) module\nconst authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\\u6b0a\\u80fd\\u935b\\u9020)\nconst systemContext: any = window.systemContext; // Access the full context for currentUser\n\n\nconst Notifications: React.FC = () => {\n  const [notifications, setNotifications] = useState<Notification[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [markingAsReadId, setMarkingAsReadId] = useState<string | null>(null); // Track which notification is being marked as read\n\n\n  const fetchNotifications = async () => {\n       const userId = systemContext?.currentUser?.id;\n       if (!notificationService || !userId) {\n            setError(\"NotificationService module not initialized or user not logged in.\");\n            setLoading(false);\n            return;\n        }\n      setLoading(true);\n      setError(null);\n      try {\n          // Fetch unread notifications for the current user from Supabase (Part of \\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df)\n          const userNotifications = await notificationService.getNotifications(userId, false); // Fetch unread notifications\n          setNotifications(userNotifications);\n      } catch (err: any) {\n          console.error('Error fetching notifications:', err);\n          setError("]));
Failed;
to;
load;
notifications: $;
{
    err.message;
}
");\n      } finally {\n          setLoading(false);\n      }\n  };\n\n  useEffect(() => {\n    // Fetch data when the component mounts or when the user changes\n    if (systemContext?.currentUser?.id) {\n        fetchNotifications(); // Fetch all unread notifications on initial load\n    }\n\n    // Subscribe to UI notification updates from the service\n    let unsubscribe: (() => void) | undefined;\n    if (notificationService) {\n         unsubscribe = notificationService.subscribeToUiNotifications((newNotifications: Notification[]) => {\n             console.log('Notifications page received UI notification update:', newNotifications);\n             // The service provides the current list of UNREAD notifications\n             setNotifications(newNotifications);\n         });\n    }\n\n\n    return () => {\n        // Unsubscribe on component unmount\n        unsubscribe?.();\n    };\n\n  }, [systemContext?.currentUser?.id, notificationService]); // Re-run effect when user ID or service changes\n\n\n    const getNotificationTypeColor = (type: Notification['type']) => {\n        switch (type) {\n            case 'success': return 'border-green-500 text-green-400';\n            case 'error': return 'border-red-500 text-red-400';\n            case 'warning': return 'border-yellow-500 text-yellow-400';\n            case 'info': return 'border-blue-500 text-blue-400';\n            default: return 'border-neutral-500 text-neutral-400';\n        }\n    };\n\n     const getNotificationTypeIcon = (type: Notification['type']) => {\n        switch (type) {\n            case 'success': return <CheckCircle size={16} className=\"text-green-400\"/>;\n            case 'error': return <XCircle size={16} className=\"text-red-400\"/>;\n            case 'warning': return <AlertTriangle size={16} className=\"text-yellow-400\"/>;\n            case 'info': return <Info size={16} className=\"text-blue-400\"/>;\n            default: return <Info size={16} className=\"text-neutral-400\"/>;\n        }\n    };\n\n\n    const handleMarkAsRead = async (notificationId: string) => {\n        const userId = systemContext?.currentUser?.id;\n        if (!notificationService || !userId) {\n            alert(\"NotificationService module not initialized or user not logged in.\");\n            return;\n        }\n        console.log(";
Attempting;
to;
mark;
notification;
$;
{
    notificationId;
}
");\n         // Simulate recording user action (Part of \u516D\u5F0F\u5967\u7FA9: \u89C0\u5BDF)\n        authorityForgingEngine?.recordAction({\n            type: 'web:notifications:mark_as_read',\n            details: { notificationId },\n            context: { platform: 'web', page: 'notifications' },\n            user_id: userId, // Associate action with user\n        });\n\n        setMarkingAsReadId(notificationId); // Indicate this notification is being marked\n        setError(null); // Clear previous errors\n        try {\n            // Call the service method to mark as read\n            const updatedNotification = await notificationService.markAsRead(notificationId, userId); // Pass notificationId and userId\n\n            if (updatedNotification) {\n                console.log('Notification marked as read:', updatedNotification.id);\n                // The subscribeToUiNotifications listener will update the state automatically\n                // Remove the notification from the state immediately for faster UI feedback\n                setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== updatedNotification.id));\n                 // alert('Notification marked as read!'); // Optional: show confirmation\n            } else {\n                setError('Failed to mark notification as read.');\n                alert('Failed to mark notification as read.');\n            }\n\n        } catch (err: any) {\n            console.error(";
Error;
marking;
notification;
$;
{
    notificationId;
}
as;
read: ", err);\n            setError(";
Failed;
to;
mark;
notification;
$;
{
    err.message;
}
");\n            alert(";
Failed;
to;
mark;
notification;
$;
{
    err.message;
}
");\n        } finally {\n            setMarkingAsReadId(null); // Reset marking state\n        }\n    };\n\n\n   // Ensure user is logged in before rendering content\n  if (!systemContext?.currentUser) {\n       // This case should ideally be handled by ProtectedRoute, but as a fallback:\n       return (\n            <div className=\"container mx-auto p-4 flex justify-center\">\n               <div className=\"bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300\">\n                   <p>Please log in to view your notifications.</p>\n               </div>\n            </div>\n       );\n  }\n\n\n  return (\n    <div className=\"container mx-auto p-4\">\n      <div className=\"bg-neutral-800/50 p-6 rounded-lg shadow-xl\">\n        <h2 className=\"text-3xl font-bold text-blue-400 mb-6\">Notifications (\u901A\u77E5\u670D\u52D9)</h2>\n        <p className=\"text-neutral-300 mb-8\">View important system notifications and updates.</p>\n\n        {/* Notifications List */}\n        <div className=\"p-4 bg-neutral-700/50 rounded-lg\">\n            <h3 className=\"text-xl font-semibold text-blue-300 mb-3\">Your Unread Notifications</h3>\n            {loading ? (\n              <p className=\"text-neutral-400\">Loading notifications...</p>\n            ) : error ? (\n                 <p className=\"text-red-400\">Error: {error}</p>\n            ) : notifications.length === 0 ? (\n              <p className=\"text-neutral-400\">No unread notifications found. You're all caught up!</p>\n            ) : (\n              <ul className=\"space-y-4\">\n                {notifications.map((notification) => (\n                  <li key={notification.id} className={";
bg - neutral - 600 / 50;
p - 4;
rounded - md;
border - l - 4;
$;
{
    getNotificationTypeColor(notification.type);
}
"}>\n                    <div className=\"flex justify-between items-center mb-2\">\n                        <div className=\"flex items-center gap-3\">\n                            {getNotificationTypeIcon(notification.type)}\n                            <h4 className={";
font - semibold;
$;
{
    getNotificationTypeColor(notification.type);
}
"}>{notification.type.toUpperCase()}</h4> {/* Display event type */}\n                        </div>\n                         {/* Mark as Read Button */}\n                         <button\n                            className=\"px-3 py-1 text-sm bg-neutral-600 text-white rounded hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\n                            onClick={() => handleMarkAsRead(notification.id)}\n                            disabled={!!markingAsReadId} // Disable while any notification is being marked\n                         >\n                            <MailOpen size={16} className={";
inline - block;
mr - 1;
$;
{
    markingAsReadId === notification.id ? 'animate-spin' : '';
}
"}/>\n                            {markingAsReadId === notification.id ? 'Marking...' : 'Mark as Read'}\n                         </button>\n                    </div>\n                    <p className=\"text-neutral-300 text-sm mb-2\">{notification.message}</p>\n                    {notification.details && Object.keys(notification.details).length > 0 && ( // Show details if available\n                         <div className=\"mt-2\">\n                             <h5 className=\"text-neutral-300 text-xs font-semibold mb-1\">Details:</h5>\n                             <pre className=\"bg-neutral-800 p-2 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-600\">\n                                 {JSON.stringify(notification.details, null, 2)}\n                             </pre>\n                         </div>\n                    )}\n                    <small className=\"text-neutral-400 text-xs block mt-1\">\n                        ID: {notification.id} | Channel: {notification.channel.toUpperCase()} | Received: {new Date(notification.timestamp).toLocaleString()}\n                         {notification.user_id && " | User;
$;
{
    notification.user_id;
}
"}\n                    </small>\n\n                    {/* TODO: Add buttons for acting on the notification (e.g., \"View Task\", \"Review Insight\") */}\n                    {/* This would involve interpreting notification.details and providing relevant actions */}\n                    {/* <div className=\"mt-4 flex flex-wrap gap-2\">\n                         {notification.details?.taskId && (\n                             <button className=\"px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition\">View Task</button>\n                         )}\n                         {notification.details?.insightId && (\n                             <button className=\"px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition\">Review Insight</button>\n                         )}\n                    </div> */}\n                  </li>\n                ))}              </ul>            )}        </div>\n\n      </div>\n    </div>\n  );\n};\n\nexport default Notifications;\n"(__makeTemplateObject([""], [""]));
