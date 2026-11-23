'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex justify-center px-5 py-24">
      <div className="w-full max-w-[540px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        </motion.div>
      </div>
    </div>
  );
}