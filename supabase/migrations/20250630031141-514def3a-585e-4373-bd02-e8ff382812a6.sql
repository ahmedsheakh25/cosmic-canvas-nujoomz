
-- First, let's insert some users that we can reference
INSERT INTO public.users (id, session_id, language_preference, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', gen_random_uuid(), 'ar', '2025-06-28 10:00:00+00', '2025-06-28 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', gen_random_uuid(), 'en', '2025-06-29 09:00:00+00', '2025-06-29 09:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', gen_random_uuid(), 'ar', '2025-06-29 14:00:00+00', '2025-06-29 14:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004', gen_random_uuid(), 'en', '2025-06-27 10:30:00+00', '2025-06-27 10:30:00+00'),
('550e8400-e29b-41d4-a716-446655440005', gen_random_uuid(), 'ar', '2025-06-30 07:30:00+00', '2025-06-30 07:30:00+00'),
('550e8400-e29b-41d4-a716-446655440006', gen_random_uuid(), 'en', '2025-06-26 15:00:00+00', '2025-06-26 15:00:00+00');

-- Now insert the project briefs using the specific user IDs
INSERT INTO public.project_briefs (user_id, brief_data, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '{
  "service": "تصميم الهوية البصرية",
  "description": "هوية فاخرة لمحل عطور سعودي باسم رائحة الذكريات",
  "audience": "عملاء يبحثون عن الفخامة والتميز",
  "style": "فخم، بسيط، جذاب",
  "budget": "4000 SAR",
  "deadline": "2025-07-10",
  "language": "ar",
  "session_id": "session-1",
  "projectTitle": "رائحة الذكريات - هوية بصرية"
}'::jsonb, 'New', '2025-06-28 10:30:00+00', '2025-06-28 10:30:00+00'),

('550e8400-e29b-41d4-a716-446655440002', '{
  "service": "Website Design",
  "description": "Modern landing page for a SaaS startup",
  "audience": "Tech-savvy small business owners",
  "style": "Clean, minimal, futuristic",
  "budget": "$2,500",
  "deadline": "2025-07-15",
  "language": "en",
  "session_id": "session-2",
  "projectTitle": "SaaS Startup Landing Page"
}'::jsonb, 'New', '2025-06-29 09:15:00+00', '2025-06-29 09:15:00+00'),

('550e8400-e29b-41d4-a716-446655440003', '{
  "service": "تصميم تطبيقات الجوال",
  "description": "تطبيق لحجز مواعيد الصالونات النسائية",
  "audience": "نساء الخليج العربي",
  "style": "أنثوي، أنيق، سهل الاستخدام",
  "budget": "8000 SAR",
  "deadline": "2025-07-20",
  "language": "ar",
  "session_id": "session-3",
  "projectTitle": "تطبيق حجز صالونات نسائية"
}'::jsonb, 'Under Review', '2025-06-29 14:20:00+00', '2025-06-29 16:45:00+00'),

('550e8400-e29b-41d4-a716-446655440004', '{
  "service": "Content Writing",
  "description": "Blog content for an eco-friendly fashion brand",
  "audience": "Environment-conscious millennials",
  "style": "Informative, friendly, engaging",
  "budget": "$600",
  "deadline": "2025-07-12",
  "language": "en",
  "session_id": "session-4",
  "projectTitle": "Eco Fashion Blog Content"
}'::jsonb, 'Completed', '2025-06-27 11:00:00+00', '2025-06-30 08:30:00+00'),

('550e8400-e29b-41d4-a716-446655440005', '{
  "service": "الحملات الإعلانية",
  "description": "حملة إعلانية لمطعم شاورما جديد في الكويت",
  "audience": "شباب كويتي يبحث عن تجربة جديدة",
  "style": "مرح، سريع، عصري",
  "budget": "1500 KWD",
  "deadline": "2025-07-08",
  "language": "ar",
  "session_id": "session-5",
  "projectTitle": "حملة مطعم شاورما الكويت"
}'::jsonb, 'Need Clarification', '2025-06-30 07:45:00+00', '2025-06-30 07:45:00+00'),

('550e8400-e29b-41d4-a716-446655440006', '{
  "service": "Social Media Management",
  "description": "Complete social media strategy for a fitness center",
  "audience": "Fitness enthusiasts aged 25-40",
  "style": "Motivational, energetic, professional",
  "budget": "$1,200",
  "deadline": "2025-07-25",
  "language": "en",
  "session_id": "session-6",
  "projectTitle": "Fitness Center Social Media Strategy"
}'::jsonb, 'Client Contacted', '2025-06-26 15:30:00+00', '2025-06-29 11:15:00+00');
