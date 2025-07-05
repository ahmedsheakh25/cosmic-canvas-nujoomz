import { Service } from './types';

export const customProject: Service = {
  label: {
    en: "Custom Project / Creative Bundle",
    ar: "مشروعي الخاص / باقة مبتكرة"
  },
  description: {
    en: "Not sure what you need? This track helps you discover the right mix of services.",
    ar: "مو عارف وش تبدأ فيه؟ هنا نساعدك نكتشف وش يناسبك من خدمات."
  },
  tags: ["custom-project", "startup", "personal-brand", "first-time-user", "needs-consultation"],
  tone: "friendly",
  suggestMoodboard: true,
  subServices: {
    project_discovery: {
      label: { en: "Discover My Project", ar: "ساعدني أكتشف مشروعي" },
      questions: [
        {
          key: "project_stage",
          type: "multi-choice",
          required: true,
          options: [
            { en: "I have an idea only", ar: "عندي فكرة فقط" },
            { en: "I've launched already", ar: "مشروعي بدأ فعليًا" },
            { en: "I'm rebranding", ar: "جالس أعيد بناء الهوية" },
            { en: "I'm building something new", ar: "أبدأ من الصفر بشي جديد" }
          ],
          label: {
            en: "Where are you currently in your journey?",
            ar: "وين واصل حالياً في مشروعك؟"
          }
        },
        {
          key: "business_type",
          type: "text",
          required: true,
          label: {
            en: "What kind of business or idea is it?",
            ar: "وش نوع مشروعك أو فكرتك؟"
          }
        },
        {
          key: "main_goal",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Brand Launch", ar: "إطلاق هوية جديدة" },
            { en: "Sell Products/Services", ar: "بيع منتجات أو خدمات" },
            { en: "Build Online Presence", ar: "بناء حضور رقمي" },
            { en: "Get Customers", ar: "جذب عملاء أو جمهور" },
            { en: "Experiment / Explore", ar: "أستكشف وأجرب" }
          ],
          label: {
            en: "What do you want to accomplish in the next 60 days?",
            ar: "وش تبغى تنجز خلال الشهرين الجايين؟"
          }
        },
        {
          key: "design_experience",
          type: "multi-choice",
          required: true,
          options: [
            { en: "New to design/branding", ar: "أول مرة أشتغل مع مصممين" },
            { en: "Worked with freelancers before", ar: "جربت مستقلين سابقًا" },
            { en: "Have internal creative team", ar: "عندي فريق داخلي إبداعي" }
          ],
          label: {
            en: "What's your experience with creative work?",
            ar: "هل سبق لك العمل على هوية أو تصميم؟"
          }
        },
        {
          key: "preferred_approach",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Step-by-step with suggestions", ar: "خطوة بخطوة ومع اقتراحات" },
            { en: "Give me a bundle to approve", ar: "عطوني باقة جاهزة أختار منها" },
            { en: "I'll decide as I go", ar: "أقرر كل مرحلة لحالها" }
          ],
          label: {
            en: "How would you like us to approach your project?",
            ar: "تبغانا نتعامل مع مشروعك بأي طريقة؟"
          }
        }
      ]
    }
  }
}; 