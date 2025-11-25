"use client"

import { Globe, Linkedin, Facebook, Github, Phone, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[#FF9900]">Wessam Zidan</h3>
          <p className="text-sm text-slate-400">Business Development Executive @ CityLockers</p>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            17+ years turning digital marketing, consultative sales & web development into explosive revenue growth.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="https://www.wessamzidan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#FF9900] transition-colors"
              aria-label="Website"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/wessamzidan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#FF9900] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/zidanwessam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#FF9900] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/wessamzidan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#FF9900] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-[#FF9900] font-bold uppercase tracking-wider text-sm">Quick Links</h4>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors text-sm">
              Dashboard
            </Link>
            <Link href="/configuration" className="text-slate-300 hover:text-white transition-colors text-sm">
              Configuration
            </Link>
            <Link href="/scenarios" className="text-slate-300 hover:text-white transition-colors text-sm">
              Scenario Management
            </Link>
            <a
              href="https://citylockers.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Company Website
            </a>
          </nav>
        </div>

        {/* Contact Developer */}
        <div className="space-y-4">
          <h4 className="text-[#FF9900] font-bold uppercase tracking-wider text-sm">Contact Developer</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <User className="w-4 h-4 text-[#FF9900] shrink-0" />
              <span>Wessam Zidan</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Phone className="w-4 h-4 text-[#FF9900] shrink-0" />
              <a href="tel:+971557115562" className="hover:text-white transition-colors">
                +971 55 711 5562
              </a>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Mail className="w-4 h-4 text-[#FF9900] shrink-0" />
              <a href="mailto:wessam.zidan@citylockers.com" className="hover:text-white transition-colors">
                wessam.zidan@citylockers.com
              </a>
            </div>
            <a
              href="https://wa.me/971557115562?text=Hi%20Wessam,%20I'm%20interested%20in%20CityLockers%20partnership"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-500 hover:bg-green-600 text-white w-full mt-2 gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800">
        <p className="text-center text-xs text-slate-500 mb-4">CityLockers Revenue Calculator v2.0</p>
        <p className="text-center text-[10px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
          This web app is a personal project by Wessam Zidan ("The Developer"). It is not affiliated with, endorsed by,
          or officially supported by CityLockers. Provided for personal use only, without warranties or liabilities.
        </p>
      </div>
    </footer>
  )
}
