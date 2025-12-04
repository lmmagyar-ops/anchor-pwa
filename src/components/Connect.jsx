import React, { useState } from 'react'
import { ShieldCheck, Phone, Mail, ChevronDown, ChevronUp, Star } from 'lucide-react'

const Connect = ({ t, isDark }) => {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleBookCall = () => {
    // Placeholder - can be replaced with actual booking logic or link
    alert('Redirecting to booking page...')
  }

  const handleEmail = () => {
    // Placeholder - can be replaced with mailto link
    alert('Opening email client...')
  }

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-200px)] animate-fade-in px-4 py-6 pb-24 overflow-y-auto">
      {/* Profile Card */}
      <div className={`w-full max-w-md rounded-3xl p-6 mb-6 ${
        isDark
          ? 'bg-white/5 border border-white/10'
          : 'bg-white shadow-xl'
      }`}>
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
            <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">
              V
            </span>
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">
          Viktoriia
        </h2>

        {/* Role */}
        <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3">
          {t.connect.role}
        </p>

        {/* Greeting */}
        <p className="text-center text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          {t.connect.greeting}
        </p>

        {/* Safety Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {t.connect.safety}
            </span>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="w-full max-w-md mb-6 text-center">
        <p className="italic text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          {t.connect.testimonial}
        </p>
        {/* 5 Star Rating */}
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3 mb-8">
        {/* Primary CTA - Book Call */}
        <button
          onClick={handleBookCall}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold text-lg shadow-lg transition-all transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl hover:from-teal-700 hover:to-teal-600 active:scale-95 flex items-center justify-center gap-2"
        >
          <Phone className="w-5 h-5" />
          {t.connect.cta}
        </button>

        {/* Secondary CTA - Email */}
        <button
          onClick={handleEmail}
          className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5" />
          {t.connect.secondary}
        </button>
      </div>

      {/* FAQ Accordion */}
      <div className="w-full max-w-md">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 font-semibold">
          {t.connect.faqTitle}
        </h3>
        <div className="space-y-3">
          {t.connect.faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white border-slate-200'
              } ${openFaq === index ? 'shadow-md' : ''}`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className={`font-medium flex-1 ${
                  openFaq === index
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {faq.q}
                </span>
                {openFaq === index ? (
                  <ChevronUp className={`w-5 h-5 flex-shrink-0 ml-3 ${
                    openFaq === index
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`} />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0 ml-3 text-slate-500 dark:text-slate-400" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Connect

