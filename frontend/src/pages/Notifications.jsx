import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import { Card, CardBody, Badge, Spinner, Button, Input, Select } from '../components/ui';
import { Clock, CheckCircle2, Circle, Calendar, FileText, Brain, Activity, Bell, Search, Trash2, CheckSquare } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filters & Sorting
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [ordering, setOrdering] = useState('-created_at');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== searchInput) {
        setSearchQuery(searchInput);
        setPage(1); // Reset to page 1 on new search
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput, searchQuery]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          search: searchQuery,
          status,
          type,
          ordering
        };
        const data = await notificationService.getNotifications(params);
        if (data.results !== undefined) {
          setNotifications(data.results);
          setNextPageUrl(data.next);
          setPrevPageUrl(data.previous);
          setTotalCount(data.count);
        } else {
          setNotifications(data);
          setTotalCount(data.length);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [searchQuery, status, type, ordering, page]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Fetch current page again
      setPage(p => p); 
      // Force reload by fetching
      const params = { page, search: searchQuery, status, type, ordering };
      const data = await notificationService.getNotifications(params);
      if (data.results !== undefined) {
        setNotifications(data.results);
      } else {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await notificationService.deleteRead();
      setPage(1); 
      const params = { page: 1, search: searchQuery, status, type, ordering };
      const data = await notificationService.getNotifications(params);
      if (data.results !== undefined) {
        setNotifications(data.results);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
        setTotalCount(data.count);
      } else {
        setNotifications(data);
        setTotalCount(data.length);
      }
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  const getNotificationConfig = (tStr) => {
    if (!tStr) return { icon: Bell, label: 'System', color: 'text-slate-500', bg: 'bg-slate-100' };
    const t = tStr.toUpperCase();
    if (t.includes('APPOINTMENT')) return { icon: Calendar, label: 'Appointment', color: 'text-cyan-500', bg: 'bg-cyan-500/10' };
    if (t.includes('RECORD') || t.includes('SHARE')) return { icon: FileText, label: 'Medical Record', color: 'text-violet-500', bg: 'bg-violet-500/10' };
    if (t.includes('AI_SUMMARY')) return { icon: Brain, label: 'AI Summary', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (t.includes('HEALTH_INSIGHT') || t.includes('RISK') || t.includes('ABNORMAL')) return { icon: Activity, label: 'Health Insight', color: 'text-rose-500', bg: 'bg-rose-500/10' };
    return { icon: Bell, label: 'System', color: 'text-slate-500', bg: 'bg-slate-100' };
  };

  const getPriorityStyles = (priority) => {
    const p = (priority || 'LOW').toUpperCase();
    switch (p) {
      case 'CRITICAL': return { border: 'border-l-4 border-l-red-500', badge: 'bg-red-100 text-red-700', label: '🔴 CRITICAL' };
      case 'HIGH': return { border: 'border-l-4 border-l-orange-500', badge: 'bg-orange-100 text-orange-700', label: '🟠 HIGH' };
      case 'MEDIUM': return { border: 'border-l-4 border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-700', label: '🟡 MEDIUM' };
      case 'LOW': default: return { border: 'border-l-4 border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: '🟢 LOW' };
    }
  };

  // Only consider unread count of current view
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-8 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-2">
            Notifications 
            {unreadCount > 0 && (
              <Badge variant="primary" className="ml-2 text-sm">{unreadCount} Unread</Badge>
            )}
          </h1>
          <p className="text-text-secondary mt-1">
            {totalCount > 0 ? `Showing ${notifications.length} of ${totalCount}` : 'Manage your alerts and insights'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> Mark All Read
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteRead} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200">
            <Trash2 className="w-4 h-4" /> Delete Read
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <Card className="bg-surface/50 border-border/50">
        <CardBody className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5 relative">
            <label className="block text-xs font-semibold text-text-muted mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search notifications..."
                className="pl-9 w-full"
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-text-muted mb-1">Status</label>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-full">
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-text-muted mb-1">Type</label>
            <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-full">
              <option value="all">All</option>
              <option value="appointment">Appointment</option>
              <option value="record">Medical Record</option>
              <option value="summary">AI Summary</option>
              <option value="insight">Health Insight</option>
              <option value="system">System</option>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-text-muted mb-1">Sort</label>
            <Select value={ordering} onChange={(e) => { setOrdering(e.target.value); setPage(1); }} className="w-full">
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="-priority_weight">Priority</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" label="Loading..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-text-secondary bg-surface rounded-xl border border-border shadow-sm">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">You're all caught up!</h3>
            <p>No notifications match your current filters.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = getNotificationConfig(notification.type);
            const pStyles = getPriorityStyles(notification.priority);
            const IconComponent = config.icon;

            return (
              <Card 
                key={notification.id} 
                className={`transition-colors ${pStyles.border} ${!notification.is_read ? 'bg-surface shadow-sm' : 'opacity-80 bg-surface-hover/50'}`}
              >
                <CardBody className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="mt-1 shrink-0 flex flex-col items-start sm:items-center gap-2 hidden sm:flex">
                    {!notification.is_read ? (
                      <Circle className="w-5 h-5 text-primary fill-primary" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="sm:hidden mt-0.5 shrink-0">
                          {!notification.is_read ? (
                            <Circle className="w-4 h-4 text-primary fill-primary" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-text-muted" />
                          )}
                        </div>
                        <div className={`p-1.5 rounded-md ${config.bg}`}>
                          <IconComponent className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                          {config.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pStyles.badge}`}>
                          {pStyles.label}
                        </span>
                      </div>
                      <div className="flex gap-2 self-start sm:self-auto mt-2 sm:mt-0 ml-7 sm:ml-0">
                        {!notification.is_read ? (
                          <Badge variant="primary" size="sm">Unread</Badge>
                        ) : (
                          <Badge variant="secondary" size="sm">Read</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-7 sm:ml-0 mt-3 sm:mt-2">
                      <h3 className={`text-lg sm:text-xl font-bold ${!notification.is_read ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm sm:text-base text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {notification.body}
                      </p>
                    </div>

                    <div className="mt-4 ml-7 sm:ml-0 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs sm:text-sm text-text-muted flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" /> 
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                      {!notification.is_read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-8 text-xs sm:text-sm"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {notifications.length > 0 && (prevPageUrl || nextPageUrl) && (
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Button 
            variant="outline" 
            disabled={!prevPageUrl}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-text-secondary">
            Page {page}
          </span>
          <Button 
            variant="outline" 
            disabled={!nextPageUrl}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

    </div>
  );
}
