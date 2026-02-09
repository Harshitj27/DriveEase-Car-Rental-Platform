import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} border-4 border-primary-100 border-t-primary-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <div className={`absolute inset-0 ${sizes[size]} border-4 border-transparent border-b-accent-400/30 rounded-full animate-spin`} style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      {text && <p className="mt-4 text-gray-500 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
