"use strict";
`` `typescript
// src/pages/Notifications.tsx
// Notifications Page
// Displays user notifications.
// --- New: Add UI for listing and marking notifications as read ---

import React, { useEffect, useState } from 'react';
import { NotificationService, Notification } from '../modules/notifications/NotificationService'; // Import Notification type
import { Info, AlertTriangle, CheckCircle, XCircle, MailOpen, Loader2 } from 'lucide-react'; // Import icons


// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const notificationService: NotificationService = window.systemContext?.notificationService; // The Notification (\u901a\u77e5\u670d\u52d9) module
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (\u6b0a\u80fd\u935b\u9020)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsReadId, setMarkingAsReadId] = useState<string | null>(null); // Track which notification is being marked as read


  const fetchNotifications = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!notificationService || !userId) {
            setError("NotificationService module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null);
      try {
          // Fetch unread notifications for the current user from Supabase (Part of \u96d9\u5410\u540c\u6b65\u9818\u57df)
          const userNotifications = await notificationService.getNotifications(userId, false); // Fetch unread notifications
          setNotifications(userNotifications);
      } catch (err: any) {
          console.error('Error fetching notifications:', err);
          setError(`;
Failed;
to;
load;
notifications: $;
{
    err.message;
}
`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchNotifications(); // Fetch all unread notifications on initial load
    }

    // Subscribe to UI notification updates from the service
    let unsubscribe: (() => void) | undefined;
    if (notificationService) {
         unsubscribe = notificationService.subscribeToUiNotifications((newNotifications: Notification[]) => {
             console.log('Notifications page received UI notification update:', newNotifications);
             // The service provides the current list of UNREAD notifications
             setNotifications(newNotifications);
         });
    }


    return () => {
        // Unsubscribe on component unmount
        unsubscribe?.();
    };

  }, [systemContext?.currentUser?.id, notificationService]); // Re-run effect when user ID or service changes


    const getNotificationTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'success': return 'border-green-500 text-green-400';
            case 'error': return 'border-red-500 text-red-400';
            case 'warning': return 'border-yellow-500 text-yellow-400';
            case 'info': return 'border-blue-500 text-blue-400';
            default: return 'border-neutral-500 text-neutral-400';
        }
    };

     const getNotificationTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-green-400"/>;
            case 'error': return <XCircle size={16} className="text-red-400"/>;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-400"/>;
            case 'info': return <Info size={16} className="text-blue-400"/>;
            default: return <Info size={16} className="text-neutral-400"/>;
        }
    };


    const handleMarkAsRead = async (notificationId: string) => {
        const userId = systemContext?.currentUser?.id;
        if (!notificationService || !userId) {
            alert("NotificationService module not initialized or user not logged in.");
            return;
        }
        console.log(`;
Attempting;
to;
mark;
notification;
$;
{
    notificationId;
}
`);
         // Simulate recording user action (Part of \u516d\u5f0f\u5967\u7fa9: \u89c0\u5bdf)
        authorityForgingEngine?.recordAction({
            type: 'web:notifications:mark_as_read',
            details: { notificationId },
            context: { platform: 'web', page: 'notifications' },
            user_id: userId, // Associate action with user
        });

        setMarkingAsReadId(notificationId); // Indicate this notification is being marked
        setError(null); // Clear previous errors
        try {
            // Call the service method to mark as read
            const updatedNotification = await notificationService.markAsRead(notificationId, userId); // Pass notificationId and userId

            if (updatedNotification) {
                console.log('Notification marked as read:', updatedNotification.id);
                // The subscribeToUiNotifications listener will update the state automatically
                // Remove the notification from the state immediately for faster UI feedback
                setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== updatedNotification.id));
                 // alert('Notification marked as read!'); // Optional: show confirmation
            } else {
                setError('Failed to mark notification as read.');
                alert('Failed to mark notification as read.');
            }

        } catch (err: any) {
            console.error(`;
Error;
marking;
notification;
$;
{
    notificationId;
}
as;
read: `, err);
            setError(`;
Failed;
to;
mark;
notification;
$;
{
    err.message;
}
`);
            alert(`;
Failed;
to;
mark;
notification;
$;
{
    err.message;
}
`);
        } finally {
            setMarkingAsReadId(null); // Reset marking state
        }
    };


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your notifications.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Notifications (\u901a\u77e5\u670d\u52d9)</h2>
        <p className="text-neutral-300 mb-8">View important system notifications and updates.</p>

        {/* Notifications List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Unread Notifications</h3>
            {loading ? (
              <p className="text-neutral-400">Loading notifications...</p>
            ) : error ? (
                 <p className="text-red-400">Error: {error}</p>
            ) : notifications.length === 0 ? (
              <p className="text-neutral-400">No unread notifications found. You're all caught up!</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`;
bg - neutral - 600 / 50;
p - 4;
rounded - md;
border - l - 4;
$;
{
    getNotificationTypeColor(notification.type);
}
`}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            {getNotificationTypeIcon(notification.type)}
                            <h4 className={`;
font - semibold;
$;
{
    getNotificationTypeColor(notification.type);
}
`}>{notification.type.toUpperCase()}</h4> {/* Display event type */}
                        </div>
                         {/* Mark as Read Button */}
                         <button
                            className="px-3 py-1 text-sm bg-neutral-600 text-white rounded hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={!!markingAsReadId} // Disable while any notification is being marked
                         >
                            <MailOpen size={16} className={`;
inline - block;
mr - 1;
$;
{
    markingAsReadId === notification.id ? 'animate-spin' : '';
}
`}/>
                            {markingAsReadId === notification.id ? 'Marking...' : 'Mark as Read'}
                         </button>
                    </div>
                    <p className="text-neutral-300 text-sm mb-2">{notification.message}</p>
                    {notification.details && Object.keys(notification.details).length > 0 && ( // Show details if available
                         <div className="mt-2">
                             <h5 className="text-neutral-300 text-xs font-semibold mb-1">Details:</h5>
                             <pre className="bg-neutral-800 p-2 rounded-md text-neutral-200 text-xs font-mono overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-neutral-600">
                                 {JSON.stringify(notification.details, null, 2)}
                             </pre>
                         </div>
                    )}
                    <small className="text-neutral-400 text-xs block mt-1">
                        ID: {notification.id} | Channel: {notification.channel.toUpperCase()} | Received: {new Date(notification.timestamp).toLocaleString()}
                         {notification.user_id && ` | User;
$;
{
    notification.user_id;
}
`}
                    </small>

                    {/* TODO: Add buttons for acting on the notification (e.g., "View Task", "Review Insight") */}
                    {/* This would involve interpreting notification.details and providing relevant actions */}
                    {/* <div className="mt-4 flex flex-wrap gap-2">
                         {notification.details?.taskId && (
                             <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Task</button>
                         )}
                         {notification.details?.insightId && (
                             <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition">Review Insight</button>
                         )}
                    </div> */}
                  </li>
                ))}\
              </ul>\
            )}\
        </div>

      </div>
    </div>
  );
};

export default Notifications;
` ``;
