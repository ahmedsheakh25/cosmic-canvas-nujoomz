
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit, Phone } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  currentLanguage: string;
  onContinue: () => void;
  onEdit: () => void;
  onRequestHelp: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  currentLanguage,
  onContinue,
  onEdit,
  onRequestHelp
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="text-center mb-6">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <Check className="w-8 h-8 text-black" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {currentLanguage === 'ar' 
                ? 'جاهز لإنشاء الموجز؟' 
                : 'Ready to create your brief?'}
            </h3>
            
            <p className="text-white/70">
              {currentLanguage === 'ar'
                ? 'هل ترغب بمراجعة الإجابات أو المتابعة؟'
                : 'Would you like to review your answers or continue?'}
            </p>
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Check className="w-5 h-5" />
              <span>{currentLanguage === 'ar' ? 'كل شيء تمام' : 'Everything looks good'}</span>
            </motion.button>

            <motion.button
              onClick={onEdit}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 border border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="w-5 h-5" />
              <span>{currentLanguage === 'ar' ? 'تعديل الإجابات' : 'Edit answers'}</span>
            </motion.button>

            <motion.button
              onClick={onRequestHelp}
              className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 border border-purple-500/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="w-5 h-5" />
              <span>{currentLanguage === 'ar' ? 'تواصل مع الفريق' : 'Contact our team'}</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
