
import React, { useState } from 'react';

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Ahmed Al-Mansouri",
      nameAr: "أحمد المنصوري",
      position: "CEO, TechCorp Kuwait",
      positionAr: "الرئيس التنفيذي، تيك كورب الكويت",
      content: "Of Space Studio transformed our brand completely. Their cosmic approach to design created an identity that truly stands out in our market. The AI-powered insights were game-changing.",
      contentAr: "استوديو Of Space غيّر علامتنا التجارية بالكامل. نهجهم الكوني في التصميم خلق هوية تبرز حقاً في السوق. الرؤى المدعومة بالذكاء الاصطناعي كانت ثورية.",
      avatar: "👨‍💼",
      company: "TechCorp",
      rating: 5
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      nameAr: "فاطمة الزهراء",
      position: "Founder, Nebula Fashion",
      positionAr: "المؤسسة، نيبولا فاشن",
      content: "Working with Of Space Studio was like having a creative partner who understood our vision from day one. Their process is seamless and the results exceeded our expectations.",
      contentAr: "العمل مع استوديو Of Space كان مثل وجود شريك إبداعي فهم رؤيتنا من اليوم الأول. عمليتهم سلسة والنتائج تجاوزت توقعاتنا.",
      avatar: "👩‍💼",
      company: "Nebula Fashion",
      rating: 5
    },
    {
      id: 3,
      name: "Omar Al-Rashid",
      nameAr: "عمر الراشد",
      position: "Marketing Director, GalaxyCafe",
      positionAr: "مدير التسويق، مقهى جالاكسي",
      content: "The team's ability to blend strategy with creativity is unmatched. Our new brand identity has increased customer engagement by 300%. Truly out of this world!",
      contentAr: "قدرة الفريق على مزج الاستراتيجية مع الإبداع لا مثيل لها. هويتنا التجارية الجديدة زادت تفاعل العملاء بنسبة 300٪. رائع حقاً!",
      avatar: "👨‍🎨",
      company: "GalaxyCafe",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent">
            Voices from the Universe
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Hear from the brands we've launched into digital success
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            
            {/* Quote marks */}
            <div className="absolute top-4 left-4 text-6xl text-[#7EF5A5]/30 font-serif">"</div>
            <div className="absolute bottom-4 right-4 text-6xl text-[#7EF5A5]/30 font-serif rotate-180">"</div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center text-4xl shadow-lg">
                {testimonials[activeTestimonial].avatar}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 font-medium">
                {testimonials[activeTestimonial].content}
              </blockquote>

              {/* Author Info */}
              <div className="space-y-2">
                <div className="text-lg font-bold text-[#7EF5A5]">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-white/70">
                  {testimonials[activeTestimonial].position}
                </div>
                <div className="text-sm text-white/50">
                  {testimonials[activeTestimonial].company}
                </div>
                
                {/* Rating Stars */}
                <div className="flex justify-center mt-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-[#7EF5A5] text-xl">⭐</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Orbital decoration */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border border-[#7EF5A5]/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 border border-[#4AE374]/10 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:text-[#7EF5A5] transition-all duration-300"
            >
              ←
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? 'bg-[#7EF5A5] scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:text-[#7EF5A5] transition-all duration-300"
            >
              →
            </button>
          </div>
        </div>

        {/* Secondary Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-[#7EF5A5]/30 hover:shadow-lg hover:shadow-[#7EF5A5]/10 ${
                index === activeTestimonial ? 'border-[#7EF5A5]/50 shadow-lg shadow-[#7EF5A5]/20' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-white/60 text-xs">{testimonial.company}</div>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-white/60 mb-6">Ready to join our constellation of satisfied clients?</p>
          <button className="bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300">
            Start Your Success Story 🚀
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
