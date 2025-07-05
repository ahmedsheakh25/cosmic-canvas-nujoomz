
import React, { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      service: '',
      message: '',
      budget: ''
    });
    
    setIsSubmitting(false);
    alert('Mission brief received! We\'ll contact you within 24 hours. 🚀');
  };

  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent">
            Connect with Our Command Center
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Ready to launch your brand into the digital cosmos? Let's start your mission briefing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🚀</span>
              <h3 className="text-2xl font-bold text-white">Mission Brief</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all"
                    placeholder="Ahmed Al-Mansouri"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all"
                    placeholder="ahmed@company.com"
                  />
                </div>
              </div>

              {/* Company and Service */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Service Needed *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all"
                  >
                    <option value="" className="bg-black">Select a service</option>
                    <option value="brand-identity" className="bg-black">Brand Identity & Strategy</option>
                    <option value="ui-ux" className="bg-black">UI/UX & Product Design</option>
                    <option value="motion-graphics" className="bg-black">Motion Graphics & Video</option>
                    <option value="web-development" className="bg-black">No-Code Websites</option>
                    <option value="ecommerce" className="bg-black">E-Commerce Development</option>
                    <option value="digital-marketing" className="bg-black">Social Media & Digital Marketing</option>
                    <option value="multiple" className="bg-black">Multiple Services</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Project Budget (Optional)
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all"
                >
                  <option value="" className="bg-black">Select budget range</option>
                  <option value="under-5k" className="bg-black">Under $5,000</option>
                  <option value="5k-15k" className="bg-black">$5,000 - $15,000</option>
                  <option value="15k-30k" className="bg-black">$15,000 - $30,000</option>
                  <option value="30k-50k" className="bg-black">$30,000 - $50,000</option>
                  <option value="50k-plus" className="bg-black">$50,000+</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Project Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all resize-none"
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Launch Mission Brief</span>
                    <span>🚀</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & CTA */}
          <div className="space-y-8">
            
            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📡</span>
                Direct Communication
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#7EF5A5]/20 rounded-full flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Email</div>
                    <div className="text-white font-medium">hello@ofspacestudio.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#7EF5A5]/20 rounded-full flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">WhatsApp</div>
                    <div className="text-white font-medium">+965 XXXX XXXX</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#7EF5A5]/20 rounded-full flex items-center justify-center">
                    🌍
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Location</div>
                    <div className="text-white font-medium">Kuwait City, Kuwait</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Prompt */}
            <div className="bg-gradient-to-br from-[#7EF5A5]/10 via-[#4AE374]/10 to-transparent backdrop-blur-lg border border-[#7EF5A5]/30 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-3">🤖</span>
                Meet Nujoomz
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Need instant help? Chat with our AI assistant Nujoomz for quick project guidance, service recommendations, and immediate support.
              </p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2">
                <span>Chat with Nujoomz</span>
                <span>💬</span>
              </button>
            </div>

            {/* Response Time */}
            <div className="text-center bg-gradient-to-br from-white/5 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold mb-1">Lightning Fast Response</div>
              <div className="text-white/60 text-sm">We typically respond within 2-4 hours during business days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#7EF5A5] rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-3 h-3 bg-[#4AE374]/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default ContactSection;
