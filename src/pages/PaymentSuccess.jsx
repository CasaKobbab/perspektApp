import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation, createPageUrl } from "@/components/i18n/translations";
import { motion } from "framer-motion";
import { User } from "@/entities/User";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Refresh user data to ensure subscription status is updated
    User.me().then(() => {
        // Optional: Trigger a global user update event if needed
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-xl"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h1 className="text-3xl font-bold font-heading mb-4 text-gray-900 dark:text-white">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Thank you for subscribing to Perspekt. Your account has been upgraded, and you now have full access to our content.
        </p>

        <div className="space-y-4">
          <Link to={createPageUrl("Home")}>
            <Button className="w-full h-12 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              Start Reading <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <Link to={createPageUrl("Account")}>
            <Button variant="ghost" className="w-full text-gray-600 dark:text-gray-400">
              Go to My Account
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}