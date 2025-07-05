
import React from 'react';

const ProcessSection = () => {
  const processSteps = [
    {
      phase: "01",
      title: "Discovery",
      titleAr: "الاستكشاف",
      description: "We map your brand's universe and identify the cosmic opportunities",
      descriptionAr: "نرسم خريطة عالم علامتك التجارية ونحدد الفرص الكونية",
      icon: "🔭",
      duration: "1-2 weeks"
    },
    {
      phase: "02", 
      title: "Design",
      titleAr: "التصميم",
      description: "Crafting stellar visuals and experiences that resonate across dimensions",
      descriptionAr: "صنع الصور والتجارب النجمية التي تتردد عبر الأبعاد",
      icon: "🎨",
      duration: "2-4 weeks"
    },
    {
      phase: "03",
      title: "Development",
      titleAr: "التطوير",
      description: "Building your digital spacecraft with cutting-edge technology",
      descriptionAr: "بناء مركبتك الفضائية الرقمية بأحدث التقنيات",
      icon: "🚀",
      duration: "3-6 weeks"
    },
    {
      phase: "04",
      title: "Launch",
      titleAr: "الإطلاق",
      description: "Deploying your brand into the digital cosmos with precision",
      descriptionAr: "نشر علامتك التجارية في الكون الرقمي بدقة",
      icon: "🌟",
      duration: "1 week"
    },
    {
      phase: "05",
      title: "Orbit",
      titleAr: "المدار",
      description: "Ongoing support and optimization to keep your brand in perfect orbit",
      descriptionAr: "الدعم المستمر والتحسين للحفاظ على علامتك في مدار مثالي",
      icon: "💫",
      duration: "Ongoing"
    }
  ];

  return (
    <section id="process" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent">
            Our Space Protocol
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            A systematic approach to launching your brand into the digital cosmos
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          
          {/* Connecting line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#7EF5A5] via-[#4AE374] to-[#7EF5A5] hidden lg:block" />

          {/* Process Steps */}
          <div className="space-y-12 lg:space-y-24">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                
                {/* Content Card */}
                <div className="flex-1 max-w-lg">
                  <div className="bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-[#7EF5A5]/50 hover:shadow-lg hover:shadow-[#7EF5A5]/10 transition-all duration-500">
                    
                    {/* Phase number */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-bold text-[#7EF5A5]">{step.phase}</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#7EF5A5] to-transparent" />
                      <span className="text-sm text-white/60 font-medium">{step.duration}</span>
                    </div>

                    {/* Title and description */}
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Icon */}
                    <div className="text-right">
                      <span className="text-3xl">{step.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="relative z-10 hidden lg:block">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-[#7EF5A5]/25">
                    {step.phase}
                  </div>
                  
                  {/* Orbital ring */}
                  <div className="absolute inset-0 w-20 h-20 border border-[#7EF5A5]/30 rounded-full animate-spin" style={{ animationDuration: `${10 + index * 2}s` }} />
                </div>

                {/* Spacer for odd items */}
                <div className="flex-1 max-w-lg hidden lg:block">
                  {index % 2 !== 0 && (
                    <div className="text-center opacity-30">
                      <div className="text-6xl">{step.icon}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to Begin Your Mission?</h3>
            <p className="text-white/80 mb-6">
              Let Nujoomz guide you through our space protocol and create a custom mission plan for your brand
            </p>
            <button className="bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300">
              Launch Discovery Phase 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/4 left-4 w-2 h-2 bg-[#7EF5A5] rounded-full animate-pulse" />
      <div className="absolute top-1/2 right-8 w-3 h-3 bg-[#4AE374]/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-12 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default ProcessSection;
