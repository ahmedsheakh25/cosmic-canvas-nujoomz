//✅ القسم 1: تصميم الهوية البصرية branding_identity
export const servicesMap = {
    branding_identity: {
      label: {
        en: "Branding / Visual Identity",
        ar: "تصميم الهوية البصرية"
      },
      description: {
        en: "Complete identity design including logo, guidelines, business profile, and visual concept.",
        ar: "تصميم شامل يشمل الشعار، دليل الهوية، البروفايل، والمود البصري"
      },
      tags: ["branding", "illustration", "marketing-strategy", "minimal", "modern", "classic", "bold", "luxury", "organic"],
      suggestMoodboard: true,
      suggestPalettes: "huemint",
      tone: "friendly",
      subServices: {
        logo_design: {
          label: { en: "Logo Design", ar: "تصميم الشعار" },
          suggestMoodboard: true,
          suggestPalettes: "huemint",
          relatedTo: ["brand_guideline", "moodboard_palette"],
          questions: [
            {
              key: "company_name",
              type: "text",
              required: true,
              label: {
                en: "What's your company or brand name?",
                ar: "وش اسم مشروعك أو شركتك؟"
              }
            },
            {
              key: "business_type",
              type: "text",
              required: true,
              label: {
                en: "What's your business about?",
                ar: "وش نوع شغلك أو مجالك؟"
              }
            },
            {
              key: "old_logo",
              type: "file",
              required: false,
              fileTypes: ["jpg", "jpeg", "png", "pdf", "svg"],
              label: {
                en: "Upload your current logo (if any)",
                ar: "إذا عندك شعار حالي، حمله هنا"
              }
            },
            {
              key: "style_reference",
              type: "file",
              required: false,
              fileTypes: ["jpg", "jpeg", "png", "pdf"],
              label: {
                en: "Upload logo styles or examples you like",
                ar: "ارفع أمثلة لشعارات أو ستايلات تعجبك"
              }
            },
            {
              key: "logo_style",
              type: "multi-choice",
              required: true,
              options: [
                { en: "Modern & Minimalist", ar: "مودرن ومبسّط" },
                { en: "Classic & Traditional", ar: "كلاسيكي وتقليدي" },
                { en: "Bold & Creative", ar: "جريء ومميز" },
                { en: "Elegant & Luxury", ar: "راقي وفاخر" },
                { en: "Fun & Playful", ar: "مرح وحيوي" }
              ],
              label: {
                en: "What logo style do you prefer?",
                ar: "تحب الشعار يكون بأي ستايل؟"
              }
            },
            {
              key: "logo_concept",
              type: "text",
              required: false,
              label: {
                en: "Do you have a logo idea or concept in mind?",
                ar: "في فكرة أو مفهوم تبغى تعكسه في الشعار؟"
              }
            },
            {
              key: "color_preference",
              type: "text",
              required: false,
              label: {
                en: "Any color preferences or palettes?",
                ar: "تحب ألوان معيّنة؟ أو نبغى نقترح عليك؟"
              }
            }
          ]
        },
        business_profile: {
          label: { en: "Business Profile", ar: "بروفايل الشركة" },
          questions: [
            {
              key: "current_profile",
              type: "file",
              required: false,
              fileTypes: ["pdf", "doc", "docx", "txt"],
              label: {
                en: "Upload your current company profile (if available)",
                ar: "إذا عندك بروفايل قديم، حمّله هنا"
              }
            },
            {
              key: "profile_purpose",
              type: "multi-choice",
              required: true,
              options: [
                { en: "Investor Presentation", ar: "عرض للمستثمرين" },
                { en: "Client Portfolio", ar: "تعريفي للعملاء" },
                { en: "Partnership Proposals", ar: "مقترحات شراكة" },
                { en: "Marketing Material", ar: "استخدام تسويقي" },
                { en: "General Overview", ar: "نظرة عامة على الشركة" }
              ],
              label: {
                en: "What's the main purpose of your company profile?",
                ar: "وش هدفك الرئيسي من البروفايل؟"
              }
            },
            {
              key: "key_achievements",
              type: "text",
              required: false,
              label: {
                en: "What are your most important achievements?",
                ar: "وش أهم إنجازاتك أو محطاتك اللي تفخر فيها؟"
              }
            },
            {
              key: "target_audience",
              type: "text",
              required: true,
              label: {
                en: "Who's the audience reading this profile?",
                ar: "مين راح يطّلع على البروفايل؟"
              }
            }
          ]
        },
        brand_guideline: {
          label: { en: "Brand Guideline", ar: "دليل الهوية البصرية" },
          questions: [
            {
              key: "guideline_scope",
              type: "multi-choice",
              required: true,
              options: [
                { en: "Basic Guidelines", ar: "نُسخة أساسية" },
                { en: "Comprehensive Manual", ar: "دليل شامل" },
                { en: "Digital Only", ar: "نسخة رقمية فقط" },
                { en: "Print & Digital", ar: "للطباعة والديجيتال" }
              ],
              label: {
                en: "What kind of guideline do you need?",
                ar: "وش نوع دليل الهوية اللي تحتاجه؟"
              }
            },
            {
              key: "brand_elements",
              type: "multi-choice",
              multiple: true,
              required: true,
              options: [
                { en: "Logo Usage", ar: "طريقة استخدام الشعار" },
                { en: "Color Palette", ar: "لوحة الألوان" },
                { en: "Typography", ar: "الخطوط" },
                { en: "Photography Style", ar: "نمط الصور" },
                { en: "Tone of Voice", ar: "نبرة الصوت" },
                { en: "Social Templates", ar: "قوالب سوشيال" }
              ],
              label: {
                en: "What elements should we include?",
                ar: "وش تبغى نغطي في الدليل؟"
              }
            },
            {
              key: "team_size",
              type: "text",
              required: false,
              label: {
                en: "How many people will use this guideline?",
                ar: "كم شخص تتوقع يستخدم الدليل؟"
              }
            }
          ]
        },
        moodboard_palette: {
          label: { en: "Moodboard & Colors", ar: "المودبورد والألوان" },
          suggestMoodboard: true,
          suggestPalettes: "huemint",
          questions: [
            {
              key: "brand_personality",
              type: "multi-choice",
              multiple: true,
              required: true,
              options: [
                { en: "Professional", ar: "مهني" },
                { en: "Creative", ar: "إبداعي" },
                { en: "Friendly", ar: "ودود" },
                { en: "Luxurious", ar: "فاخر" },
                { en: "Energetic", ar: "مليان حركة" },
                { en: "Trustworthy", ar: "موثوق" },
                { en: "Innovative", ar: "مبتكر" }
              ],
              label: {
                en: "How would you describe your brand personality?",
                ar: "علامتك تميل لأي طابع؟"
              }
            },
            {
              key: "inspiration_images",
              type: "file",
              multiple: true,
              required: false,
              fileTypes: ["jpg", "jpeg", "png"],
              label: {
                en: "Upload any moodboard or visual references",
                ar: "ارفع صور أو مراجع تلهمك"
              }
            },
            {
              key: "color_mood",
              type: "multi-choice",
              required: true,
              options: [
                { en: "Warm & Energetic", ar: "دافي ومتحرك" },
                { en: "Cool & Calm", ar: "هادي وأنيق" },
                { en: "Bold & Vibrant", ar: "قوي وزاهي" },
                { en: "Neutral & Elegant", ar: "محايد وراقي" },
                { en: "Dark & Mysterious", ar: "غامق ومثير" }
              ],
              label: {
                en: "What color mood fits your brand?",
                ar: "وش مزاج الألوان اللي تحس يناسب البراند؟"
              }
            }
          ]
        }
      }
    },
  
  
  //✅ القسم 2: تصميم محتوى السوشيال ميديا social_media_design
  
  social_media_design: {
    label: {
      en: "Social Media Design",
      ar: "تصميم محتوى السوشيال ميديا"
    },
    description: {
      en: "Custom content and templates tailored for various platforms.",
      ar: "تصميم قوالب ومحتوى خاص بمنصات التواصل."
    },
    tags: ["social-media", "marketing-strategy", "copywriting", "modern", "playful", "gen-z", "millennials", "youth"],
    suggestMoodboard: true,
    tone: "friendly",
    subServices: {
      post_templates: {
        label: { en: "Post Templates", ar: "قوالب المنشورات" },
        suggestMoodboard: true,
        suggestPalettes: "huemint",
        relatedTo: ["brand_adaptation"],
        questions: [
          {
            key: "platforms",
            type: "multi-choice",
            multiple: true,
            required: true,
            options: [
              { en: "Instagram", ar: "إنستقرام" },
              { en: "X / Twitter", ar: "تويتر / X" },
              { en: "TikTok", ar: "تيك توك" },
              { en: "LinkedIn", ar: "لينكدإن" },
              { en: "Snapchat", ar: "سناب شات" },
              { en: "YouTube", ar: "يوتيوب" },
              { en: "Facebook", ar: "فيسبوك" }
            ],
            label: {
              en: "Which platforms are you active on?",
              ar: "وين تنشر غالبًا؟"
            }
          },
          {
            key: "content_types",
            type: "multi-choice",
            multiple: true,
            required: true,
            options: [
              { en: "Product Highlights", ar: "عرض منتجات" },
              { en: "Tips / Advice", ar: "نصائح ومحتوى تعليمي" },
              { en: "Quotes", ar: "اقتباسات" },
              { en: "Announcements", ar: "إعلانات أو فعاليات" },
              { en: "Behind The Scenes", ar: "كواليس العمل" }
            ],
            label: {
              en: "What types of content will you post?",
              ar: "وش نوع المحتوى اللي تحب تنزله؟"
            }
          },
          {
            key: "posting_frequency",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Daily", ar: "يوميًا" },
              { en: "2–3 times per week", ar: "مرتين إلى ثلاث أسبوعيًا" },
              { en: "Weekly", ar: "أسبوعيًا" },
              { en: "Occasionally", ar: "بشكل متفرق" }
            ],
            label: {
              en: "How often do you plan to post?",
              ar: "كم مره تنشر في العادة؟"
            }
          }
        ]
      },
  
      brand_adaptation: {
        label: { en: "Brand Adaptation", ar: "تكييف الهوية" },
        questions: [
          {
            key: "current_brand_assets",
            type: "file",
            fileTypes: ["jpg", "jpeg", "png", "pdf", "ai", "svg"],
            required: false,
            label: {
              en: "Upload your current brand elements (logo/colors/fonts)",
              ar: "حمّل شعارك أو ألوانك المعتمدة (إن وجدت)"
            }
          },
          {
            key: "social_personality",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Fun & Playful", ar: "مرح وعفوي" },
              { en: "Minimal & Clean", ar: "بسيط وواضح" },
              { en: "Trendy & Modern", ar: "ترندي وعصري" },
              { en: "Professional & Sleek", ar: "احترافي وأنيق" }
            ],
            label: {
              en: "How should your brand look on social?",
              ar: "كيف تحب تظهر علامتك على السوشيال؟"
            }
          }
        ]
      },
  
      social_strategy: {
        label: { en: "Social Media Strategy", ar: "استراتيجية السوشيال" },
        tone: "professional",
        questions: [
          {
            key: "target_audience",
            type: "text",
            required: true,
            label: {
              en: "Who are you trying to reach on social?",
              ar: "مين جمهورك المستهدف؟"
            }
          },
          {
            key: "competitors",
            type: "text",
            required: false,
            label: {
              en: "Any competitors or pages you like?",
              ar: "في حسابات منافسة تحب طريقتها؟"
            }
          },
          {
            key: "social_goals",
            type: "multi-choice",
            required: true,
            multiple: true,
            options: [
              { en: "Brand Awareness", ar: "رفع الوعي بالعلامة" },
              { en: "Engagement", ar: "تفاعل ومتابعة" },
              { en: "Sales / Conversions", ar: "مبيعات أو طلبات" },
              { en: "Community Building", ar: "بناء مجتمع" }
            ],
            label: {
              en: "What are your goals with social media?",
              ar: "وش تبغى تحقق من وجودك الرقمي؟"
            }
          }
        ]
      }
    }
  },
  
  
  //✅ القسم 3: الموشن جرافيك motion_graphics
  
  motion_graphics: {
    label: {
      en: "Motion Graphics",
      ar: "الموشن جرافيك"
    },
    description: {
      en: "Animated video services including intros, logo animation, and social media clips.",
      ar: "خدمات فيديو متحرك تشمل تعريفي، شعارات متحركة، ومقاطع سوشيال."
    },
    tags: ["motion-graphics", "social-media", "modern", "futuristic", "playful", "creative"],
    tone: "creative",
    subServices: {
      intro_video: {
        label: { en: "Intro Video", ar: "فيديو تعريفي" },
        questions: [
          {
            key: "video_duration",
            type: "multi-choice",
            required: true,
            options: [
              { en: "30 seconds", ar: "٣٠ ثانية" },
              { en: "1 minute", ar: "دقيقة واحدة" },
              { en: "2 minutes", ar: "دقيقتين" },
              { en: "3+ minutes", ar: "٣ دقائق أو أكثر" }
            ],
            label: {
              en: "Roughly, how long should the video be?",
              ar: "كم المدة التقريبية للفيديو؟"
            }
          },
          {
            key: "video_style",
            type: "multi-choice",
            required: true,
            options: [
              { en: "2D Animation", ar: "رسوم 2D" },
              { en: "3D Animation", ar: "رسوم 3D" },
              { en: "Typography Animation", ar: "تحريك نصوص" },
              { en: "Mixed Media", ar: "وسائط مختلطة" }
            ],
            label: {
              en: "Preferred animation style?",
              ar: "وش نوع التحريك اللي تحبه؟"
            }
          },
          {
            key: "key_messages",
            type: "text",
            required: true,
            label: {
              en: "What main message(s) should the video deliver?",
              ar: "إيش الرسائل الأساسية اللي تبغى الفيديو يوصلها؟"
            }
          },
          {
            key: "voiceover_needed",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Yes – Arabic", ar: "نعم - عربي" },
              { en: "Yes – English", ar: "نعم - إنجليزي" },
              { en: "Yes – Both", ar: "نعم - الإثنين" },
              { en: "No Voiceover", ar: "بدون تعليق صوتي" }
            ],
            label: {
              en: "Do you need voiceover narration?",
              ar: "تحتاج تعليق صوتي داخل الفيديو؟"
            }
          }
        ]
      },
  
      social_video: {
        label: { en: "Social Media Videos", ar: "فيديوهات للسوشيال ميديا" },
        suggestMoodboard: true,
        suggestPalettes: "huemint",
        questions: [
          {
            key: "video_format",
            type: "multi-choice",
            multiple: true,
            required: true,
            options: [
              { en: "Square (1:1)", ar: "مربع (١:١)" },
              { en: "Vertical (9:16)", ar: "عمودي (٩:١٦)" },
              { en: "Horizontal (16:9)", ar: "أفقي (١٦:٩)" }
            ],
            label: {
              en: "What formats do you need?",
              ar: "وش صيغة العرض اللي تناسب منصاتك؟"
            }
          },
          {
            key: "video_purpose",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Product Promotion", ar: "ترويج منتج" },
              { en: "Brand Awareness", ar: "رفع الوعي" },
              { en: "Educational Content", ar: "توعية وتعليم" },
              { en: "Event Highlight", ar: "ترويج لفعالية" },
              { en: "Behind The Scenes", ar: "مشاهد من الكواليس" }
            ],
            label: {
              en: "What's the goal of these videos?",
              ar: "وش هدفك من الفيديوهات؟"
            }
          }
        ]
      },
  
      logo_animation: {
        label: { en: "Logo Animation", ar: "تحريك الشعار" },
        questions: [
          {
            key: "logo_file",
            type: "file",
            required: true,
            fileTypes: ["ai", "svg", "pdf", "png", "eps"],
            label: {
              en: "Upload your logo (preferably vector)",
              ar: "حمّل الشعار (يفضل بصيغة فيكتور)"
            }
          },
          {
            key: "animation_style",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Simple Reveal", ar: "ظهور بسيط" },
              { en: "Dynamic Entrance", ar: "دخول ديناميكي" },
              { en: "Particle Effects", ar: "تأثيرات جزئية" },
              { en: "3D Transformation", ar: "تحويل ثلاثي الأبعاد" }
            ],
            label: {
              en: "What animation style do you like?",
              ar: "تحب نحرّك الشعار بأي طريقة؟"
            }
          },
          {
            key: "usage_purpose",
            type: "multi-choice",
            multiple: true,
            required: true,
            options: [
              { en: "Intro/Outro for videos", ar: "بداية أو نهاية فيديوهات" },
              { en: "Social Media Clips", ar: "محتوى سوشيال ميديا" },
              { en: "Website or App", ar: "الموقع أو التطبيق" },
              { en: "Presentations", ar: "عروض تقديمية" }
            ],
            label: {
              en: "Where will you use the animated logo?",
              ar: "وين ناوي تستخدم الشعار المتحرك؟"
            }
          }
        ]
      }
    }
  },
  
  
  //✅ القسم 4: استراتيجية التسويق marketing_strategy
  
  marketing_strategy: {
    label: {
      en: "Marketing Strategy",
      ar: "استراتيجية التسويق"
    },
    description: {
      en: "Strategic planning including audience analysis, campaign goals, and budget allocation.",
      ar: "تخطيط استراتيجي يشمل تحليل الجمهور، أهداف الحملة، وتوزيع الميزانية."
    },
    tags: ["marketing-strategy", "business", "corporate", "global-market", "niche-community"],
    tone: "professional",
    subServices: {
      campaign_planning: {
        label: { en: "Campaign Planning", ar: "تخطيط الحملة" },
        questions: [
          {
            key: "campaign_goal",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Brand Awareness", ar: "رفع الوعي" },
              { en: "Lead Generation", ar: "جذب عملاء محتملين" },
              { en: "Sales Increase", ar: "زيادة مبيعات" },
              { en: "Product Launch", ar: "إطلاق منتج" },
              { en: "Event Promotion", ar: "ترويج فعالية" }
            ],
            label: {
              en: "What's the main goal of your campaign?",
              ar: "وش الهدف الرئيسي من حملتك؟"
            }
          },
          {
            key: "target_market",
            type: "text",
            required: true,
            label: {
              en: "Describe your ideal target market",
              ar: "اوصف السوق المستهدف حقك"
            }
          },
          {
            key: "budget_range",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Less than 10,000 SAR", ar: "أقل من ١٠,٠٠٠ ريال" },
              { en: "10,000 – 50,000 SAR", ar: "١٠ - ٥٠ ألف" },
              { en: "50,000 – 100,000 SAR", ar: "٥٠ - ١٠٠ ألف" },
              { en: "Above 100,000 SAR", ar: "أكثر من ١٠٠ ألف" },
              { en: "Not Sure", ar: "مو متأكد" }
            ],
            label: {
              en: "What's your estimated campaign budget?",
              ar: "وش الميزانية اللي حاطها للحملة؟"
            }
          },
          {
            key: "campaign_duration",
            type: "multi-choice",
            required: true,
            options: [
              { en: "1 Month", ar: "شهر" },
              { en: "3 Months", ar: "٣ شهور" },
              { en: "6 Months", ar: "٦ شهور" },
              { en: "1 Year", ar: "سنة" },
              { en: "Ongoing", ar: "مستمرة" }
            ],
            label: {
              en: "For how long will the campaign run?",
              ar: "مدة الحملة تقريبيًا؟"
            }
          }
        ]
      },
  
      audience_analysis: {
        label: { en: "Audience Analysis", ar: "تحليل الجمهور" },
        questions: [
          {
            key: "current_customers",
            type: "text",
            required: false,
            label: {
              en: "Describe your current customer base",
              ar: "عملاءك الحاليين كيف توصفهم؟"
            }
          },
          {
            key: "demographics",
            type: "text",
            required: true,
            label: {
              en: "Who are your target audience? (age, gender, location)",
              ar: "الفئة المستهدفة: العمر، الجنس، المنطقة؟"
            }
          },
          {
            key: "customer_pain_points",
            type: "text",
            required: true,
            label: {
              en: "What are the problems your audience faces that you solve?",
              ar: "وش المشاكل أو الاحتياجات اللي تحلّها؟"
            }
          },
          {
            key: "buying_behavior",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Impulse Shoppers", ar: "يشترون بعفوية" },
              { en: "Research Before Buying", ar: "يبحث قبل الشراء" },
              { en: "Price Sensitive", ar: "يهتم بالسعر" },
              { en: "Brand Loyal", ar: "يحب علامة معيّنة" },
              { en: "Quality First", ar: "يركز على الجودة" }
            ],
            label: {
              en: "What describes their buying style best?",
              ar: "كيف غالبًا يتخذون قرار الشراء؟"
            }
          }
        ]
      },
  
      budget_allocation: {
        label: { en: "Budget Allocation", ar: "توزيع الميزانية" },
        questions: [
          {
            key: "channels_interest",
            type: "multi-choice",
            multiple: true,
            required: true,
            options: [
              { en: "Instagram / Facebook Ads", ar: "إعلانات إنستقرام / فيسبوك" },
              { en: "Google Ads", ar: "إعلانات جوجل" },
              { en: "Snapchat / TikTok", ar: "سناب أو تيك توك" },
              { en: "Email Campaigns", ar: "حملات إيميل" },
              { en: "Influencer Marketing", ar: "تسويق مع مؤثرين" },
              { en: "Traditional Media", ar: "قنوات تقليدية (راديو/مطبوعات)" }
            ],
            label: {
              en: "Which marketing channels interest you most?",
              ar: "وش القنوات التسويقية اللي تشوفها مناسبة؟"
            }
          },
          {
            key: "priority_channels",
            type: "text",
            required: false,
            label: {
              en: "Any channel you want to prioritize?",
              ar: "في قناة معينة تبي تركز عليها أكثر؟"
            }
          }
        ]
      }
    }
  },
  
  //🏷️ اختيار اسم ونبرة الصوت naming_brand_voice
  
  naming_brand_voice: {
    label: {
      en: "Naming & Brand Voice",
      ar: "اختيار الاسم ونبرة الصوت"
    },
    description: {
      en: "Crafting a memorable name and defining your brand's communication tone.",
      ar: "ابتكار اسم مميز وتحديد طريقة تواصلك مع جمهورك."
    },
    tags: ["naming", "branding", "copywriting", "arabic-speaking", "global-market"],
    tone: "creative",
    subServices: {
      business_naming: {
        label: { en: "Business Naming", ar: "اختيار اسم تجاري" },
        suggestMoodboard: true,
        questions: [
          {
            key: "business_description",
            type: "text",
            required: true,
            label: {
              en: "Briefly describe your business idea",
              ar: "عطني لمحة بسيطة عن مشروعك"
            }
          },
          {
            key: "name_style",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Modern & Techy", ar: "عصري وتقني" },
              { en: "Traditional & Arabic", ar: "تقليدي وله طابع عربي" },
              { en: "Creative & Unique", ar: "مميز ومختلف" },
              { en: "Professional & Corporate", ar: "احترافي ورسمي" },
              { en: "Fun & Catchy", ar: "مرح وسهل الحفظ" }
            ],
            label: {
              en: "What kind of name style do you prefer?",
              ar: "وش نوع الاسم اللي يعجبك؟"
            }
          },
          {
            key: "name_preferences",
            type: "text",
            required: false,
            label: {
              en: "Words or themes you'd like to include?",
              ar: "في كلمات أو معاني ودك تكون ضمن الاسم؟"
            }
          },
          {
            key: "avoid_words",
            type: "text",
            required: false,
            label: {
              en: "Words you want to avoid in the name?",
              ar: "في كلمات أو دلالات تبي تبعد عنها؟"
            }
          },
          {
            key: "language_preference",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Arabic", ar: "عربي" },
              { en: "English", ar: "إنجليزي" },
              { en: "Bilingual", ar: "ثنائي (عربي + إنجليزي)" },
              { en: "Global / Easy to pronounce", ar: "عالمي وسهل النطق" }
            ],
            label: {
              en: "Language style for the name?",
              ar: "تحب الاسم يكون بأي لغة أو طابع؟"
            }
          }
        ]
      },
  
      brand_voice: {
        label: { en: "Brand Voice", ar: "نبرة الصوت" },
        suggestPalettes: false,
        tone: "creative",
        questions: [
          {
            key: "brand_personality",
            type: "multi-choice",
            multiple: true,
            required: true,
            options: [
              { en: "Professional", ar: "مهني" },
              { en: "Friendly", ar: "ودود" },
              { en: "Authoritative", ar: "خبير وواثق" },
              { en: "Playful", ar: "مرح" },
              { en: "Inspiring", ar: "ملهم" },
              { en: "Caring", ar: "مهتم ومتفهّم" }
            ],
            label: {
              en: "How should your brand 'sound'?",
              ar: "كيف تحب أسلوب كلام البراند؟"
            }
          },
          {
            key: "communication_style",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Like a trusted advisor", ar: "زي المستشار الموثوق" },
              { en: "Like a close friend", ar: "زي الصديق القريب" },
              { en: "Like an expert voice", ar: "زي خبير المجال" },
              { en: "Like a fun companion", ar: "زي الرفيق المرح" }
            ],
            label: {
              en: "How do you want people to feel when they hear your brand?",
              ar: "وش الشعور أو العلاقة اللي تبغا جمهورك يحسها؟"
            }
          },
          {
            key: "avoid_tone",
            type: "multi-choice",
            required: true,
            multiple: true,
            options: [
              { en: "Too formal", ar: "رسمي زيادة" },
              { en: "Too casual", ar: "مرخي جدًا" },
              { en: "Boring", ar: "ممل" },
              { en: "Confusing", ar: "مربك" },
              { en: "Pushy / aggressive", ar: "هجومي أو مزعج" }
            ],
            label: {
              en: "Are there any tones you want to avoid?",
              ar: "في نبرات تبغا نتجنبها؟"
            }
          }
        ]
      }
    }
  },
  
  
  //✍️ القسم 6: كتابة المحتوى copywriting
  
  copywriting: {
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
  },
  
  
  //🎨 القسم 7: التصميم التوضيحي والرسوم والشخصيات illustration_design
  
  illustration_design: {
    label: {
      en: "Illustration & Character Design",
      ar: "تصميم التوضيحات والشخصيات"
    },
    description: {
      en: "Custom illustrations, infographics, mascots, and character styles.",
      ar: "رسوم توضيحية، إنفوجرافيكس، شخصيات كرتونية أو واقعية."
    },
    tags: ["illustration", "custom-project", "playful", "organic", "cultural"],
    tone: "creative",
    subServices: {
      infographic_design: {
        label: { en: "Infographic Design", ar: "تصميم إنفوجرافيك" },
        questions: [
          {
            key: "infographic_type",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Statistics & Numbers", ar: "إحصائيات وأرقام" },
              { en: "Explainer / Process", ar: "شرح خطوات أو فكرة" },
              { en: "Comparison / Timeline", ar: "مقارنة أو تسلسل زمني" },
              { en: "Mixed Format", ar: "تنسيق مختلط" }
            ],
            label: {
              en: "What type of infographic are you aiming for?",
              ar: "أي نوع من الإنفوجرافيك تبغى نسوي؟"
            }
          },
          {
            key: "content_provided",
            type: "file",
            required: false,
            fileTypes: ["pdf", "doc", "ppt", "txt"],
            label: {
              en: "Upload content or outline (if you have it)",
              ar: "إذا عندك المحتوى جاهز، حمله هنا"
            }
          },
          {
            key: "brand_alignment",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Follow my branding style", ar: "يتبع هوية البراند" },
              { en: "Creative & Open", ar: "حر وابداعي" }
            ],
            label: {
              en: "Should it follow your brand identity?",
              ar: "تبغى يكون بنفس هوية البراند؟"
            }
          }
        ]
      },
  
      mascot_character: {
        label: { en: "Mascot / Character Design", ar: "تصميم شخصية أو تميمة" },
        suggestMoodboard: true,
        suggestPalettes: "huemint",
        questions: [
          {
            key: "character_usage",
            type: "multi-choice",
            required: true,
            multiple: true,
            options: [
              { en: "Website", ar: "الموقع" },
              { en: "Packaging / Products", ar: "المنتجات أو التغليف" },
              { en: "Social Media", ar: "السوشيال ميديا" },
              { en: "Mascot for Branding", ar: "شخصية تمثل البراند" },
              { en: "Kids / Educational Content", ar: "للمحتوى التعليمي للأطفال" }
            ],
            label: {
              en: "Where will this character be used?",
              ar: "وين ناوي تستخدم الشخصية؟"
            }
          },
          {
            key: "character_type",
            type: "multi-choice",
            required: true,
            options: [
              { en: "Friendly Human", ar: "شخصية إنسان ودودة" },
              { en: "Cute Animal", ar: "حيوان لطيف" },
              { en: "Abstract/Symbolic", ar: "رمزية أو تجريدية" },
              { en: "Robot / Futuristic", ar: "روبوت / مستقبلي" },
              { en: "Cultural / Local", ar: "يعكس الطابع المحلي" }
            ],
            label: {
              en: "What kind of character do you want?",
              ar: "تبغى الشخصية تكون من أي نوع؟"
            }
          },
          {
            key: "personality_traits",
            type: "multi-choice",
            multiple: true,
            required: false,
            options: [
              { en: "Playful", ar: "مرح" },
              { en: "Helpful", ar: "يساعد" },
              { en: "Wise", ar: "حكيم" },
              { en: "Cool", ar: "كول وعصري" },
              { en: "Adventurous", ar: "مغامِر" }
            ],
            label: {
              en: "What traits should the character have?",
              ar: "تبغى الشخصية تعكس أي صفات؟"
            }
          }
        ]
      }
    }
  },
  
  
  //🧪 القسم 8: خدمة "مشروعي الخاص / باقة مبتكرة" custom_project
  
  custom_project: {
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
  },
  
  //💻 القسم 9: تصميم واجهات وتجربة المستخدم ui_ux_design
  
  ui_ux_design: {
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
  }
}
  