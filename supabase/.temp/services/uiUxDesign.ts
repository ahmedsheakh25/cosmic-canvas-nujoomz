import { Service } from './types';

export const uiUxDesign: Service = {
  label: {
    en: "UI/UX Design",
    ar: "تصميم واجهات وتجربة المستخدم"
  },
  description: {
    en: "Designing user interfaces and flows that are beautiful, functional, and accessible.",
    ar: "تصميم واجهات وتجارب استخدام عصرية، عملية، وسهلة الاستخدام."
  },
  tags: ["ui-ux", "app-design", "tech", "modern", "minimal", "ecommerce"],
  tone: "professional",
  subServices: {
    website_design: {
      label: { en: "Website UI", ar: "تصميم واجهة موقع" },
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      questions: [
        {
          key: "site_purpose",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Informational Website", ar: "موقع تعريفي" },
            { en: "E-Commerce", ar: "متجر إلكتروني" },
            { en: "Landing Page", ar: "صفحة هبوط" },
            { en: "Portfolio", ar: "ملف أعمال" },
            { en: "Booking / Service Portal", ar: "حجز أو خدمات" }
          ],
          label: {
            en: "What kind of website are you building?",
            ar: "وش نوع الموقع اللي ناوي تصممه؟"
          }
        },
        {
          key: "inspiration_links",
          type: "text",
          required: false,
          label: {
            en: "Any reference sites you like?",
            ar: "في مواقع تعجبك من ناحية التصميم؟"
          }
        },
        {
          key: "platform_or_stack",
          type: "multi-choice",
          required: false,
          options: [
            { en: "Webflow", ar: "ويب فلو" },
            { en: "WordPress", ar: "ووردبريس" },
            { en: "Shopify", ar: "شوبيفاي" },
            { en: "Custom Code", ar: "كود مخصص" },
            { en: "Not Decided Yet", ar: "ما قررت" }
          ],
          label: {
            en: "What platform or stack are you using?",
            ar: "وش التقنية أو المنصة اللي ناوي تبني الموقع عليها؟"
          }
        },
        {
          key: "content_ready",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Yes – all content is ready", ar: "نعم – كل المحتوى جاهز" },
            { en: "Some content is available", ar: "بعض المحتوى جاهز" },
            { en: "No – I need help writing it", ar: "لا – أحتاج المساعدة" }
          ],
          label: {
            en: "Is your content ready for the website?",
            ar: "هل المحتوى اللي بينعرض بالموقع جاهز؟"
          }
        }
      ]
    },
    mobile_app_design: {
      label: { en: "Mobile App UI", ar: "تصميم تطبيق موبايل" },
      suggestMoodboard: true,
      relatedTo: ["ux_flow_design"],
      questions: [
        {
          key: "app_type",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Service Booking App", ar: "تطبيق حجز خدمات" },
            { en: "E-Commerce", ar: "تسوق وشراء" },
            { en: "Content/Media App", ar: "محتوى أو فيديوهات" },
            { en: "Social Platform", ar: "منصة تواصل" },
            { en: "Utility Tool", ar: "أداة مساعدة أو إنتاجية" }
          ],
          label: {
            en: "What kind of app are you designing?",
            ar: "وش نوع التطبيق اللي ناوي تصممه؟"
          }
        },
        {
          key: "target_devices",
          type: "multi-choice",
          required: true,
          options: [
            { en: "iOS", ar: "آيفون" },
            { en: "Android", ar: "أندرويد" },
            { en: "Both", ar: "الاثنين معًا" }
          ],
          label: {
            en: "Which platforms do you want it to support?",
            ar: "وش النظام اللي ناوي تطلق عليه؟"
          }
        },
        {
          key: "has_wireframes",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Yes – full wireframes exist", ar: "نعم – فيه مخططات كاملة" },
            { en: "Some sketches or screens", ar: "فيه رسومات جزئية" },
            { en: "No – starting from scratch", ar: "لا – من الصفر" }
          ],
          label: {
            en: "Do you already have screens or wireframes?",
            ar: "عندك تصوّر أو رسم أولي للشاشات؟"
          }
        }
      ]
    },
    ux_flow_design: {
      label: { en: "UX Flow & Prototyping", ar: "تصميم تجربة الاستخدام" },
      questions: [
        {
          key: "user_tasks",
          type: "text",
          required: true,
          label: {
            en: "What are the key tasks a user needs to complete?",
            ar: "وش أهم المهام اللي يحتاج المستخدم يسويها داخل المنصة؟"
          }
        },
        {
          key: "flow_painpoints",
          type: "text",
          required: false,
          label: {
            en: "Any pain points you've noticed in your existing flow?",
            ar: "في مشاكل بالتجربة الحالية تبي نحلّها؟"
          }
        },
        {
          key: "prototype_usage",
          type: "multi-choice",
          required: true,
          options: [
            { en: "For internal validation", ar: "تجربة داخلية" },
            { en: "For user testing", ar: "اختبار مع المستخدمين" },
            { en: "To show investors", ar: "عرض للمستثمرين" },
            { en: "To brief developers", ar: "شرح للمطوّرين" }
          ],
          label: {
            en: "What will the prototype be used for?",
            ar: "وش الغرض من النماذج التفاعلية؟"
          }
        }
      ]
    }
  }
}; 