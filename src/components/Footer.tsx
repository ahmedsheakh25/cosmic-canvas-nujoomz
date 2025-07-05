
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    services: [
      'Brand Identity & Strategy',
      'UI/UX & Product Design', 
      'Motion Graphics & Video',
      'No-Code Websites',
      'E-Commerce Development',
      'Digital Marketing'
    ],
    company: [
      'About Our Orbit',
      'Our Process',
      'Case Studies',
      'Blog & Insights',
      'Careers',
      'Contact'
    ],
    resources: [
      'Brand Guidelines',
      'Design System',
      'Project Templates',
      'AI Tools',
      'Support Center',
      'Documentation'
    ]
  };

  return (
    <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-white/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="text-3xl font-bold mb-2">
                <span className="text-white">Of Space</span>
                <span className="text-[#7EF5A5] ml-2">Studio</span>
              </div>
              <p className="text-[#7EF5A5] font-medium text-lg">We Think Out of the Space</p>
            </div>
            
            <p className="text-white/70 leading-relaxed mb-6 max-w-md">
              A creative studio crafting cosmic brand identities, no-code websites, and interactive experiences that transcend conventional boundaries.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: '📧', label: 'Email', href: 'mailto:hello@ofspacestudio.com' },
                { icon: '💬', label: 'WhatsApp', href: '#' },
                { icon: '📸', label: 'Instagram', href: '#' },
                { icon: '🐦', label: 'Twitter', href: '#' },
                { icon: '💼', label: 'LinkedIn', href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-[#7EF5A5]/20 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:text-[#7EF5A5] transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Services</h4>
            <ul className="space-y-3">
              {footerSections.services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#services" 
                    className="text-white/60 hover:text-[#7EF5A5] transition-colors text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
            <ul className="space-y-3">
              {footerSections.company.map((item, index) => (
                <li key={index}>
                  <a 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white/60 hover:text-[#7EF5A5] transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              {footerSections.resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-white/60 hover:text-[#7EF5A5] transition-colors text-sm"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-br from-white/5 via-white/10 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold text-xl mb-2 flex items-center">
                <span className="mr-3">📡</span>
                Cosmic Updates
              </h4>
              <p className="text-white/70">Stay connected with our latest missions and industry insights</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-[#7EF5A5] focus:outline-none focus:ring-2 focus:ring-[#7EF5A5]/20 transition-all"
              />
              <button className="bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#7EF5A5]/25 transition-all duration-300 whitespace-nowrap">
                Join Fleet 🚀
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © {currentYear} Of Space Studio. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#7EF5A5] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-[#7EF5A5] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-[#7EF5A5] transition-colors">
                Cookies Policy
              </a>
            </div>

            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <span>Made with</span>
              <span className="text-[#7EF5A5] text-base">💚</span>
              <span>in Kuwait</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-[#7EF5A5] rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-32 left-32 w-1 h-1 bg-[#4AE374] rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }} />
      </div>
    </footer>
  );
};

export default Footer;
