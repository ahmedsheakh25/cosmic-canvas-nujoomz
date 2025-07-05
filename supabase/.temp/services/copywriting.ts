import { Service } from './types';

export const copywriting: Service = {
  label: {
    en: "Copywriting",
    ar: "كتابة المحتوى"
  },
  description: {
    en: "Professional content creation for websites, ads, and campaigns.",
    ar: "كتابة محتوى احترافي للمواقع، الإعلانات، والحملات."
  },
  tags: ["copywriting", "marketing-strategy", "arabic-speaking", "global-market", "female-audience"],
  tone: "friendly",
  subServices: {
    website_copy: {
      label: { en: "Website Copy", ar: "محتوى الموقع الإلكتروني" },
      questions: [
        {
          key: "website_pages",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Homepage", ar: "الصفحة الرئيسية" },
            { en: "About Us", ar: "من نحن" },
            { en: "Services / Products", ar: "الخدمات / المنتجات" },
            { en: "Contact", ar: "اتصل بنا" },
            { en: "Blog", ar: "المدونة" },
            { en: "FAQ", ar: "الأسئلة الشائعة" }
          ],
          label: {
            en: "Which pages need content?",
            ar: "وش الصفحات اللي تحتاج محتوى؟"
          }
        },
        {
          key: "website_goal",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Generate Leads", ar: "جذب عملاء محتملين" },
            { en: "Sell Online", ar: "بيع مباشر أونلاين" },
            { en: "Brand Awareness", ar: "رفع الوعي بالعلامة" },
            { en: "Provide Info", ar: "تقديم معلومات" },
            { en: "Build Community", ar: "بناء مجتمع أو علاقات" }
          ],
          label: {
            en: "Main goal of your website?",
            ar: "وش هدف موقعك الرئيسي؟"
          }
        },
        {
          key: "target_action",
          type: "text",
          required: true,
          label: {
            en: "What action do you want visitors to take?",
            ar: "وش تبغى الزائر يسوي بعد ما يقرأ؟"
          }
        },
        {
          key: "current_website",
          type: "text",
          required: false,
          label: {
            en: "If you have a current site, share the URL",
            ar: "إذا عندك موقع حالي، عطنا الرابط"
          }
        }
      ]
    },
    ad_copy: {
      label: { en: "Ad Copy", ar: "نصوص إعلانية" },
      questions: [
        {
          key: "ad_platform",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Google Ads", ar: "إعلانات Google" },
            { en: "Facebook / Instagram", ar: "فيسبوك / إنستقرام" },
            { en: "Snapchat", ar: "سناب شات" },
            { en: "LinkedIn", ar: "لينكدإن" },
            { en: "Twitter / X", ar: "تويتر / X" },
            { en: "TikTok", ar: "تيك توك" }
          ],
          label: {
            en: "Which platforms will the ads be on?",
            ar: "وين تنوي تعرض الإعلانات؟"
          }
        },
        {
          key: "product_service",
          type: "text",
          required: true,
          label: {
            en: "What product or service are you promoting?",
            ar: "وش المنتج أو الخدمة اللي تسوّق لها؟"
          }
        },
        {
          key: "ad_goal",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Drive Sales", ar: "تحقيق مبيعات" },
            { en: "Website Traffic", ar: "زيارات للموقع" },
            { en: "App Downloads", ar: "تنزيل تطبيق" },
            { en: "Brand Awareness", ar: "تعريف بالعلامة" },
            { en: "Get Leads", ar: "جذب عملاء محتملين" }
          ],
          label: {
            en: "Main goal of the ad?",
            ar: "وش الهدف الرئيسي من الإعلان؟"
          }
        },
        {
          key: "special_offer",
          type: "text",
          required: false,
          label: {
            en: "Any offers or promo you want to highlight?",
            ar: "في عروض أو تخفيضات نذكرها؟"
          }
        }
      ]
    },
    email_marketing: {
      label: { en: "Email Campaigns", ar: "حملات البريد الإلكتروني" },
      questions: [
        {
          key: "email_type",
          type: "multi-choice",
          multiple: true,
          required: true,
          options: [
            { en: "Newsletter", ar: "نشرة بريدية" },
            { en: "Product Launch", ar: "إطلاق منتج" },
            { en: "Event Announcement", ar: "إعلان فعالية" },
            { en: "Follow-up Series", ar: "سلسلة متابعة" },
            { en: "Educational Emails", ar: "محتوى تعليمي" }
          ],
          label: {
            en: "What kind of email content do you need?",
            ar: "وش نوع الإيميلات اللي تبغاها؟"
          }
        },
        {
          key: "email_frequency",
          type: "multi-choice",
          required: true,
          options: [
            { en: "Daily", ar: "يوميًا" },
            { en: "Weekly", ar: "أسبوعيًا" },
            { en: "Monthly", ar: "شهريًا" },
            { en: "Occasionally", ar: "حسب الحاجة" }
          ],
          label: {
            en: "How often will you send emails?",
            ar: "كل كم ترسل إيميلات؟"
          }
        },
        {
          key: "email_goal",
          type: "text",
          required: true,
          label: {
            en: "What outcome do you want from the emails?",
            ar: "وش تبغى تحقق من الإيميلات؟"
          }
        }
      ]
    }
  }
}; 