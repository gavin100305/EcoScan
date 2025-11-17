import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiCheckCircle, HiX } from 'react-icons/hi';

export default function EmailVerificationModal({ isOpen, onClose, email }) {
  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        delay: 0.2,
        damping: 15, 
        stiffness: 200 
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>

              {/* Icon with animation */}
              <div className="flex justify-center mb-6">
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative"
                >
                  <motion.div
                    variants={pulseVariants}
                    animate="animate"
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <HiOutlineMail className="w-10 h-10 text-primary" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', damping: 15 }}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-4 border-card"
                  >
                    <HiCheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-4"
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Check Your Email
                </h2>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    We've sent a verification link to
                  </p>
                  <p className="text-foreground font-semibold bg-background px-4 py-2 rounded-lg border border-border break-all">
                    {email}
                  </p>
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-2">
                  <p className="text-sm text-foreground font-medium">
                    📬 What's next?
                  </p>
                  <ul className="text-sm text-muted-foreground text-left space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Check your inbox (and spam folder)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Click the verification link in the email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>You'll be redirected to sign in</span>
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </motion.div>

              {/* Action button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
