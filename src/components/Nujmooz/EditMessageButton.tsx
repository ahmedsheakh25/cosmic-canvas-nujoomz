
import React from 'react';
import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';

interface EditMessageButtonProps {
  onEdit: () => void;
  currentLanguage: string;
}

const EditMessageButton: React.FC<EditMessageButtonProps> = ({ onEdit, currentLanguage }) => {
  return (
    <motion.button
      onClick={onEdit}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-white/10 text-white/60 hover:text-[#7EF5A5]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={currentLanguage === 'ar' ? 'تعديل الإجابة' : 'Edit answer'}
    >
      <Edit2 className="w-3 h-3" />
    </motion.button>
  );
};

export default EditMessageButton;
