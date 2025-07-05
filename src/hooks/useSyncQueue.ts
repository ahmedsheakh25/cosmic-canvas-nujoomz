
import { useRef, useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSyncQueue = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const syncQueueRef = useRef<Array<{ action: string; data: any; timestamp: number }>>([]);
  const lastSyncRef = useRef<number>(Date.now());

  // Queue system for offline/background sync
  const queueAction = useCallback((action: string, data: any) => {
    syncQueueRef.current.push({
      action,
      data,
      timestamp: Date.now()
    });
    
    // Auto-sync if queue gets too large
    if (syncQueueRef.current.length > 10) {
      processSyncQueue();
    }
  }, []);

  const processSyncQueue = useCallback(async () => {
    if (syncQueueRef.current.length === 0 || syncStatus === 'syncing') return;
    
    setSyncStatus('syncing');
    
    try {
      const actionsToProcess = [...syncQueueRef.current];
      syncQueueRef.current = [];
      
      for (const queuedAction of actionsToProcess) {
        switch (queuedAction.action) {
          case 'save_message':
            await supabase
              .from('chat_conversations')
              .upsert(queuedAction.data);
            break;
            
          case 'update_session':
            await supabase
              .from('user_sessions')
              .upsert(queuedAction.data, { onConflict: 'session_id' });
            break;
            
          case 'save_interaction':
            await supabase
              .from('user_interactions')
              .insert(queuedAction.data);
            break;
        }
      }
      
      lastSyncRef.current = Date.now();
      setSyncStatus('success');
      
      // Reset status after 2 seconds
      setTimeout(() => setSyncStatus('idle'), 2000);
      
    } catch (error) {
      console.error('Sync queue processing error:', error);
      
      // Re-queue failed actions
      syncQueueRef.current = [...syncQueueRef.current, ...syncQueueRef.current];
      setSyncStatus('error');
      
      // Auto-retry after 30 seconds
      setTimeout(() => processSyncQueue(), 30000);
    }
  }, [syncStatus]);

  const getQueueStats = useCallback(() => {
    return {
      queueLength: syncQueueRef.current.length,
      lastSync: lastSyncRef.current,
      timeSinceLastSync: Date.now() - lastSyncRef.current
    };
  }, []);

  // Auto-sync every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastSyncRef.current > 120000) { // 2 minutes
        processSyncQueue();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [processSyncQueue]);

  return {
    syncStatus,
    queueAction,
    processSyncQueue,
    getQueueStats
  };
};
