import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // TODO: Implement contact form submission
    setFormData({ email: '', message: '' });
  };

  return (
    <footer className="bg-ctp-mantle border-t border-ctp-surface0 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Copyright */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-ctp-peach to-ctp-red p-2 rounded-lg">
                <Mail className="h-5 w-5 text-ctp-base" />
              </div>
              <span className="text-lg font-semibold text-ctp-text">Taste Bites</span>
            </div>
            <p className="text-ctp-subtext1 text-sm">
              © 2025 Taste Bites. All rights reserved.
            </p>
            <p className="text-ctp-subtext0 text-xs max-w-md">
              Discover amazing recipes from around the world. Cook, share, and enjoy delicious meals with your loved ones.
            </p>
          </div>

          {/* Right side - Contact Form */}
          <div className="bg-ctp-surface0 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-ctp-text mb-4">Contact Us</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ctp-subtext1 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-ctp-base border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent text-ctp-text placeholder-ctp-subtext0 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ctp-subtext1 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-ctp-base border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent text-ctp-text placeholder-ctp-subtext0 transition-colors resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 bg-ctp-peach text-ctp-base font-medium rounded-lg hover:bg-ctp-red transition-colors group"
              >
                <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;