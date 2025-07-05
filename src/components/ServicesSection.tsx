
import React, { useState } from 'react';

const ServicesSection = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      title: "Brand Identity & Strategy",
      titleAr: "هوية العلامة التجارية والاستراتيجية",
      description: "Cosmic brand universes that orbit around your core values",
      descriptionAr: "أكوان العلامات التجارية الكونية التي تدور حول قيمك الأساسية",
      icon: "🎨",
      gradient: "from-[#7EF5A5] to-[#4AE374]"
    },
    {
      title: "UI/UX & Product Design",
      titleAr: "تصميم واجهات المستخدم والمنتجات",
      description: "Intuitive interfaces that feel like navigating through space",
      descriptionAr: "واجهات بديهية تشعرك وكأنك تتنقل عبر الفضاء",
      icon: "🚀",
      gradient: "from-[#4AE374] to-[#7EF5A5]"
    },
    {
      title: "Motion Graphics & Video",
      titleAr: "الرسوم المتحركة والفيديو",
      description: "Animated stories that transcend dimensional boundaries",
      descriptionAr: "قصص متحركة تتجاوز الحدود الأبعادية",
      icon: "🌌",
      gradient: "from-[#7EF5A5] via-[#4AE374] to-[#7EF5A5]"
    },
    {
      title: "No-Code Websites",
      titleAr: "مواقع الويب بدون كود",
      description: "Stellar websites built with Webflow, Framer & WordPress",
      descriptionAr: "مواقع نجمية مبنية بـ Webflow و Framer و WordPress",
      icon: "💫",
      gradient: "from-[#4AE374] to-[#7EF5A5]"
    },
    {
      title: "E-Commerce Development",
      titleAr: "تطوير التجارة الإلكترونية",
      description: "Galactic marketplaces that convert visitors into customers",
      descriptionAr: "أسواق مجرية تحول الزوار إلى عملاء",
      icon: "🛸",
      gradient: "from-[#7EF5A5] to-[#4AE374]"
    },
    {
      title: "Social Media & Digital Marketing",
      titleAr: "وسائل التواصل والتسويق الرقمي",
      description: "Cosmic campaigns that reach across the digital universe",
      descriptionAr: "حملات كونية تصل عبر الكون الرقمي",
      icon: "🌟",
      gradient: "from-[#4AE374] via-[#7EF5A5] to-[#4AE374]"
    }
  ];

  return (
    <section id="services" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent">
            Explore Our Dimensions
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Navigate through our cosmic service offerings, each designed to elevate your brand to new dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full transition-all duration-500 hover:border-[#7EF5A5]/50 hover:shadow-2xl hover:shadow-[#7EF5A5]/10 hover:-translate-y-2">
                
                {/* Floating icon */}
                <div className="text-4xl mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  {service.icon}
                </div>

                {/* Service title */}
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#7EF5A5] transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Service description */}
                <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                  {service.description}
                </p>

                {/* Hover gradient overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />

                {/* Orbital ring on hover */}
                {hoveredService === index && (
                  <div className="absolute -inset-2 border border-[#7EF5A5]/30 rounded-2xl animate-pulse" />
                )}

                {/* CTA button appears on hover */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button className="text-[#7EF5A5] font-semibold hover:text-[#4AE374] transition-colors flex items-center space-x-2">
                    <span>Launch Mission</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-6">Ready to explore a custom solution?</p>
          <button className="bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300">
            Start Your Mission with Nujoomz 🚀
          </button>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-[#7EF5A5]/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-10 right-10 w-24 h-24 border border-[#4AE374]/10 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
    </section>
  );
};

export default ServicesSection;
