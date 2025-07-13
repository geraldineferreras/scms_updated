import React, { useEffect, useState, useCallback } from "react";

// Notification type mapping
const typeMap = {
  announcement: { icon: "📢", color: "#1976d2", title: "Announcement" },
  grade: { icon: "✅", color: "#43a047", title: "New Grade Posted" },
  assignment: { icon: "📝", color: "#ffc107", title: "Assignment" },
  general: { icon: "❗", color: "#888", title: "Notification" },
};

// Time formatting helper
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr.replace(/-/g, "/"));
  const diff = (now - date) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString();
}

function NotificationCard({ notification, onMarkRead, onClick }) {
  const { type, message, is_read, created_at } = notification;
  const meta = typeMap[type] || typeMap.general;
  return (
    <div
      style={{
        background: is_read ? "#fff" : "#e3f0ff",
        border: `1.5px solid ${meta.color}22`,
        borderRadius: 12,
        boxShadow: is_read ? "none" : `0 2px 8px ${meta.color}22`,
        padding: 18,
        marginBottom: 16,
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.2s"
      }}
      onClick={onClick}
    >
      <div style={{ fontSize: 28, color: meta.color, flexShrink: 0 }}>{meta.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: is_read ? 600 : 700, fontSize: 16, color: meta.color, marginBottom: 2 }}>
          {meta.title}
        </div>
        <div style={{ fontWeight: is_read ? 400 : 600, fontSize: 15, color: is_read ? "#444" : "#222" }}>{message}</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{timeAgo(created_at)}</div>
      </div>
      {!is_read && (
        <button
          onClick={e => { e.stopPropagation(); onMarkRead(notification.notification_id); }}
          style={{ background: meta.color, color: "#fff", border: "none", borderRadius: 8, padding: "4px 10px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginLeft: 8 }}
        >
          Mark as read
        </button>
      )}
    </div>
  );
}

// Mock fetchNotifications (replace with real API call)
const mockNotifications = [
  {
    notification_id: 12,
    type: "grade",
    message: "You got 95 in Exam #1.",
    is_read: false,
    created_at: "2025-07-06 10:10:00"
  },
  {
    notification_id: 13,
    type: "announcement",
    message: "Class is suspended tomorrow.",
    is_read: false,
    created_at: "2025-07-06 09:00:00"
  },
  {
    notification_id: 14,
    type: "assignment",
    message: "New assignment: Project Proposal.",
    is_read: true,
    created_at: "2025-07-05 15:00:00"
  },
  {
    notification_id: 15,
    type: "general",
    message: "Welcome to the portal!",
    is_read: true,
    created_at: "2025-07-01 08:00:00"
  }
];

const fetchNotifications = async () => {
  // Replace with real API call
  // const res = await fetch('/api/student/notifications', { headers: { Authorization: 'Bearer ...' } });
  // return await res.json();
  return new Promise(resolve => setTimeout(() => resolve(mockNotifications), 400));
};

const markAsRead = async (notification_id) => {
  // Replace with real API call
  // await fetch('/api/student/notifications/markRead', { method: 'POST', body: JSON.stringify({ notification_id }) });
  return true;
};

const markAllAsRead = async () => {
  // Replace with real API call
  // await fetch('/api/student/notifications/markAllRead', { method: 'POST' });
  return true;
};

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchNotifications();
    // Unread first
    data.sort((a, b) => (a.is_read === b.is_read ? 0 : a.is_read ? 1 : -1));
    setNotifications(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // auto-refresh every 60s
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(notifications => notifications.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications(notifications => notifications.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="bell">🔔</span> Notifications
            {unreadCount > 0 && <span style={{ background: '#f44336', color: '#fff', borderRadius: 12, fontSize: 13, fontWeight: 700, padding: '2px 10px', marginLeft: 8 }}>{unreadCount}</span>}
          </div>
          <div style={{ color: '#666', fontSize: 14, marginTop: 2 }}>Stay updated on new announcements, grades, and class updates.</div>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{ background: unreadCount === 0 ? '#bbb' : '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 14, cursor: unreadCount === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
        >
          Mark all as read
        </button>
      </div>
      {/* Notification Feed */}
      <div style={{ marginTop: 8 }}>
        {loading ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No notifications yet.</div>
        ) : (
          notifications.map(n => (
            <NotificationCard
              key={n.notification_id}
              notification={n}
              onMarkRead={handleMarkRead}
              onClick={() => { /* Optionally navigate to detail */ }}
            />
          ))
        )}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .notification-card { flex-direction: column !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentNotifications; 