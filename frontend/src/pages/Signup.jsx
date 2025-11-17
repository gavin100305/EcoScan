import { useState } from 'react';
import { PiPlantFill } from 'react-icons/pi';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail, HiLockClosed, HiChevronLeft, HiUser } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import EmailVerificationModal from '../components/ui/EmailVerificationModal';


export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const container = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, when: 'beforeChildren', duration: 0.5 } }
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    const { data, error } = await signUp(email, password, fullName);
    if (error) {
      alert(error.message);
    } else {
      // Show email verification modal instead of redirecting
      setShowVerificationModal(true);
      // Clear password fields for security
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div variants={container} initial="hidden" animate="visible" className={`max-w-md w-full p-8 bg-card rounded-2xl border border-border shadow-md`}>
      <motion.div variants={item} className="flex items-center gap-4 mb-6">
        <a href="/" className="text-muted-foreground hover:text-foreground"><HiChevronLeft className="w-6 h-6" /></a>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <PiPlantFill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">EcoScan</div>
            <div className="text-sm text-muted-foreground">Create your account</div>
          </div>
        </div>
      </motion.div>
      <motion.h2 variants={item} className="text-2xl font-bold mb-4 text-foreground text-center">Create an account</motion.h2>
      <motion.p variants={item} className="text-center text-sm text-muted-foreground mb-6">Get started quickly and scan sustainably</motion.p>

      <motion.form variants={item} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md p-2">
            <HiUser className="w-5 h-5 text-muted-foreground" />
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Email</label>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md p-2">
            <HiOutlineMail className="w-5 h-5 text-muted-foreground" />
            <input
              className="w-full bg-transparent outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Password</label>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md p-2">
            <HiLockClosed className="w-5 h-5 text-muted-foreground" />
            <input
              className="w-full bg-transparent outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Create a password (min 6 characters)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
          <div className="flex items-center gap-2 bg-background border border-border rounded-md p-2">
            <HiLockClosed className="w-5 h-5 text-muted-foreground" />
            <input
              className="w-full bg-transparent outline-none"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold mt-2">
          Create Account
        </motion.button>
      </motion.form>

      <motion.div variants={item} className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <div className="text-sm text-muted-foreground">Or continue with</div>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      <motion.button 
        variants={item} 
        onClick={handleGoogle} 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full py-3 flex items-center justify-center gap-2 border rounded-md bg-background">
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </motion.button>

      <motion.p variants={item} className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account? <a href="/login" className="text-primary font-medium">Sign in</a>
      </motion.p>
      </motion.div>

      {/* Email Verification Modal */}
      <EmailVerificationModal 
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          window.location.href = '/login';
        }}
        email={email}
      />
    </div>
  );
}

