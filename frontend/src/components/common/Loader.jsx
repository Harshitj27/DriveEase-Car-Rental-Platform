import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className={`${sizes[size]} border-4 border-gray-200 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="mt-3 text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
