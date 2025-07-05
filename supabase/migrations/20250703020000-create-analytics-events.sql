create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id),
  action text not null,
  feature text not null,
  metadata jsonb not null default '{}'::jsonb,
  session_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint analytics_events_action_check check (
    action in (
      'message_sent',
      'message_received',
      'emotion_detected',
      'service_detected',
      'error_occurred',
      'voice_recorded',
      'question_answered'
    )
  ),
  
  constraint analytics_events_feature_check check (
    feature in (
      'conversation',
      'emotion_analysis',
      'service_matching',
      'error_tracking',
      'voice_chat',
      'service_questions'
    )
  )
);

-- Create index for faster user-specific queries
create index if not exists analytics_events_user_id_idx on public.analytics_events(user_id);

-- Create index for faster action filtering
create index if not exists analytics_events_action_idx on public.analytics_events(action);

-- Create index for faster feature filtering
create index if not exists analytics_events_feature_idx on public.analytics_events(feature);

-- Enable RLS
alter table public.analytics_events enable row level security;

-- Create policies
create policy "Users can view their own analytics events"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "Service role can insert analytics events"
  on public.analytics_events for insert
  with check (auth.role() = 'service_role');

-- Grant access to authenticated users
grant select on public.analytics_events to authenticated;

-- Grant access to service role
grant all on public.analytics_events to service_role; 