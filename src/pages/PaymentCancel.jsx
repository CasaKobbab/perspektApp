import React from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/components/i18n/translations";
import { motion } from "framer-motion";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 text-center shadow-xl"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold font-heading mb-4 text-gray-900 dark:text-white">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          The payment process was cancelled. No charges were made to your account. You can try again whenever you're ready.
        </p>

        <div className="space-y-4">
          <Link to={createPageUrl("Subscribe")}>
            <Button className="w-full h-12 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 rounded-xl">
              Try Again
            </Button>
          </Link>
          
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="w-full text-gray-600 dark:text-gray-400">
              Return to Home <ArrowLeft className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}