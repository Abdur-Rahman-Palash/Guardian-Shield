"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  ArrowRight,
  Heart,
  Award,
  Users,
  Globe,
  Lock
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const features = [
    { icon: Shield, title: 'Advanced Protection', description: 'AI-powered content filtering' },
    { icon: Users, title: 'Family Friendly', description: 'Designed for modern families' },
    { icon: Lock, title: 'Privacy First', description: 'Your data is always secure' },
    { icon: Globe, title: 'Global Coverage', description: 'Works worldwide' }
  ]

  const links = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Security', href: '/security' },
      { name: 'Extension', href: '/extension' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Community', href: '/community' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Guardian Shield
                </h3>
                <p className="text-sm text-gray-600">Protecting Families Online</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Guardian Shield is your trusted partner in digital parenting. We provide comprehensive tools to keep your children safe online while giving them the freedom to explore and learn.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Award className="w-3 h-3 mr-1" />
                Award Winning
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                10K+ Families
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Globe className="w-3 h-3 mr-1" />
                Global Coverage
              </Badge>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Product Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-3">
                  {links.product.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                      >
                        <span className="w-0 h-0 border-t-2 border-transparent group-hover:border-blue-600 group-hover:w-4 transition-all duration-200"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-3">
                  {links.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                      >
                        <span className="w-0 h-0 border-t-2 border-transparent group-hover:border-blue-600 group-hover:w-4 transition-all duration-200"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                <ul className="space-y-3">
                  {links.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                      >
                        <span className="w-0 h-0 border-t-2 border-transparent group-hover:border-blue-600 group-hover:w-4 transition-all duration-200"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-3">
                  {links.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group"
                      >
                        <span className="w-0 h-0 border-t-2 border-transparent group-hover:border-blue-600 group-hover:w-4 transition-all duration-200"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Guardian Shield</h3>
            <p className="text-blue-100 mb-6">
              Get the latest updates on digital safety tips, new features, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Email Us</h4>
              <p className="text-gray-600">support@guardianshield.com</p>
              <p className="text-gray-600">help@guardianshield.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
              <p className="text-gray-600">+880 1234 5678</p>
              <p className="text-gray-600">+880 1234 5679</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Visit Us</h4>
              <p className="text-gray-600">123 Safety Street</p>
              <p className="text-gray-600">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © {currentYear} Guardian Shield. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for families worldwide</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-blue-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
