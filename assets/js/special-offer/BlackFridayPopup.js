// assets/js/special-offer/BlackFridayPopup.js
import React from 'react';
import { X, Sparkles, Rocket, Check, HelpCircle, Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from '../components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';


const InfoTooltip = ({ term, description }) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger className="cursor-help">
            <HelpCircle className="h-4 w-4 text-emerald-500/60 hover:text-emerald-500 transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-gray-900 border border-emerald-500/20">
            <div className="text-sm">
              <span className="font-semibold text-emerald-500">{term}: </span>
              <span className="text-gray-200">{description}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  const BlackFridayPopup = () => {
    const [isOpen, setIsOpen] = React.useState(true);
  
    React.useEffect(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenBlackFridayOffer');
      if (hasSeenPopup) {
        setIsOpen(false);
      }
    }, []);
  
    const handleClose = () => {
      setIsOpen(false);
      localStorage.setItem('hasSeenBlackFridayOffer', 'true');
    };
  
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-2xl bg-black border border-emerald-500/20">
          <div className="absolute -top-3 -left-3">
            <div className="bg-emerald-500 text-black font-bold px-4 py-1 rounded-full text-sm">
              BLACK FRIDAY SPECIAL
            </div>
          </div>
  
          <AlertDialogHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-3xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-emerald-500" />
                  Starter Package
                  <span className="text-emerald-500">$300</span>
                </div>
                <p className="text-gray-400 mt-2">
                  Launch your business with everything you need to succeed
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </AlertDialogHeader>
  
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-emerald-500 font-semibold">Website Essentials</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200">Landing, About, and Contact Pages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200">Professional Logo Design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200 flex items-center gap-1">
                      12-Month Custom Domain Hosting
                      <InfoTooltip 
                        term="Domain Hosting"
                        description="We'll register and maintain your website's address (e.g., yourcompany.com) and provide secure server space for your website for one full year."
                      />
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200 flex items-center gap-1">
                      Mobile Responsive Design
                      <InfoTooltip 
                        term="Responsive Design"
                        description="Your website will automatically adjust to look perfect on all devices - phones, tablets, and computers."
                      />
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200">Contact Form Setup</span>
                  </li>
                </ul>
              </div>
  
              <div className="space-y-4">
                <h3 className="text-emerald-500 font-semibold">Marketing & Optimization</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200">2 Promotional Commercials (30-60s)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200">3 Custom Marketing Banners</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200 flex items-center gap-1">
                      Social Media Profile Setup
                      <InfoTooltip 
                        term="Social Media Setup"
                        description="We'll create and optimize your business profiles on 3 major platforms of your choice (e.g., Instagram, Facebook, LinkedIn) with consistent branding and essential information."
                      />
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200 flex items-center gap-1">
                      SEO Optimization
                      <InfoTooltip 
                        term="SEO Optimization"
                        description="We'll optimize your website to rank better in Google searches through proper keywords, meta descriptions, and technical setup to help customers find you online."
                      />
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-200">Google Business Profile Setup</span>
                  </li>
                </ul>
              </div>
            </div>
  
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Rocket className="text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Bonus Features:</span>
              </div>
              <ul className="mt-2 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-1">
                  • 1 Month Free Maintenance & Support
                  <InfoTooltip 
                    term="Maintenance & Support"
                    description="We'll handle updates, fix any issues, and provide technical support for your first month after launch."
                  />
                </li>
                <li className="flex items-center gap-1">
                  • Basic Analytics Setup
                  <InfoTooltip 
                    term="Analytics Setup"
                    description="Installation and configuration of Google Analytics to track visitor behavior, popular pages, and other key metrics."
                  />
                </li>
                <li className="flex items-center gap-1">
                  • SSL Certificate
                  <InfoTooltip 
                    term="SSL Certificate"
                    description="Security feature that encrypts data between your website and its visitors, showing the padlock icon in browsers and helping with Google rankings."
                  />
                </li>
                <li className="flex items-center gap-1">
                  • Weekly Backup System
                  <InfoTooltip 
                    term="Backup System"
                    description="Automatic weekly saves of your entire website to prevent data loss and enable quick recovery if needed."
                  />
                </li>
              </ul>
            </div>
  
            <div className="text-sm text-emerald-500/80 font-medium">
              🔥 Limited time offer - Save over 40% on regular pricing!
            </div>
          </div>
  
          <AlertDialogFooter className="mt-6 space-y-3">
            <button
              onClick={handleClose}
              className="w-full bg-emerald-500 text-black font-bold py-3 px-4 rounded hover:bg-emerald-600 transition-colors"
            >
              Claim This Offer Now
            </button>
            <button
              onClick={handleClose}
              className="w-full bg-transparent border border-gray-700 text-gray-300 py-2 px-4 rounded hover:bg-gray-900 transition-colors text-sm"
            >
              Maybe Later
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default BlackFridayPopup;