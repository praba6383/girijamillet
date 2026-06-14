import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    
    // Simulate API registration delay
    setTimeout(() => {
      // Save to local storage for realistic state management
      try {
        const existing = JSON.parse(localStorage.getItem('millet_subscribers') || '[]');
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem('millet_subscribers', JSON.stringify(existing));
        }
        setStatus('success');
        setEmail('');
      } catch (err) {
        setStatus('success');
        setEmail('');
      }
    }, 1200);
  };

  return (
    <div className="w-full bg-brand-green-800 text-white rounded-3xl overflow-hidden shadow-xl py-12 px-6 sm:py-16 sm:px-12 relative">
      {/* Background radial soft light gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-green-700/60 via-transparent to-transparent"></div>
      
      {/* Absolute decorative grains layout */}
      <div className="absolute right-0 bottom-0 opacity-[0.06] select-none pointer-events-none hidden md:block">
        <svg width="240" height="240" viewBox="0 0 100 100" fill="currentColor">
          <path d="M 10 90 Q 50 50 90 10" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="30" cy="70" r="4" />
          <circle cx="40" cy="62" r="4" />
          <circle cx="50" cy="50" r="4" />
          <circle cx="62" cy="38" r="4" />
          <circle cx="70" cy="30" r="4" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Spark decoration label */}
        <div className="inline-flex items-center gap-1 bg-white/10 text-brand-green-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#ffd700]" />
          Join The Healthy Millet Community
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
            Get Traditional Recipes & Fresh Offers
          </h2>
          <p className="text-brand-green-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Subscribe to our newsletter! Receive monthly nutritional charts, secret organic recipes, and exclusive discount coupons on combo offers.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto space-y-3 animate-scaleUp">
            <CheckCircle2 className="w-10 h-10 text-[#ffd700] mx-auto" />
            <div>
              <h4 className="font-serif text-lg font-bold">You're Sworn In!</h4>
              <p className="text-brand-green-150 text-xs mt-1 leading-relaxed">
                Thank you for subscribing. We will send you your first 15% discount coupon immediately! Elevate your kitchen diets.
              </p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="text-xs font-semibold text-brand-green-200 hover:text-white transition-colors cursor-pointer underline"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your active email address"
                  value={email}
                  disabled={status === 'submitting'}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="w-full bg-white/10 border border-white/20 focus:border-white focus:bg-white/20 focus:outline-hidden text-sm px-4 py-3.5 pl-11 rounded-xl placeholder-brand-green-200 text-white transition-all"
                  aria-label="Email subscription input"
                />
                <Mail className="absolute left-4 top-4 w-4 h-4 text-brand-green-200" />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-white hover:bg-brand-green-50 text-brand-green-900 font-display text-sm font-extrabold px-6 py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
              >
                {status === 'submitting' ? 'Signing Up...' : 'Subscribe Now'}
              </button>
            </div>

            {status === 'error' && (
              <p className="text-red-300 text-xs mt-2 text-left sm:text-center pl-2">
                ⚠️ {errorMessage}
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-brand-green-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>We value your inbox privacy. No spam. Unsubscribe anytime in 1-click.</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
