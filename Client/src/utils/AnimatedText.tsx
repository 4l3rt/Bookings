import { AnimatePresence, motion } from "framer-motion";

export const AnimatedText = ({ value }: { value: string | number }) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={value}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="txt-secondary"
    >
      {value}
    </motion.p>
  </AnimatePresence>
);