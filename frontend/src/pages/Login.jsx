import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail, HiLockClosed, HiChevronLeft } from 'react-icons/hi';
import { PiPlantFill } from 'react-icons/pi';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
// using RiRecycleFill as main icon
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
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
    const { error } = await signIn(email, password);
    if (error) alert(error.message);
    else window.location.href = '/';
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={`max-w-md w-full p-8 bg-card rounded-2xl border border-border shadow-md`}
      >
      <motion.div variants={item} className="flex items-center gap-4 mb-6">
        <a href="/" className="text-muted-foreground hover:text-foreground"><HiChevronLeft className="w-6 h-6" /></a>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <PiPlantFill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">EcoScan</div>
            <div className="text-sm text-muted-foreground">Fresh sustainable choices</div>
          </div>
        </div>
      </motion.div>

      <motion.h2 variants={item} className="text-2xl font-bold mb-4 text-foreground text-center">Welcome Back</motion.h2>
      <motion.p variants={item} className="text-center text-sm text-muted-foreground mb-6">Sign in to your account to continue</motion.p>

      <motion.form variants={item} onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold mt-2">Sign In</button>
      </motion.form>

      <motion.div variants={item} className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <div className="text-sm text-muted-foreground">Or continue with</div>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      <motion.button variants={item} onClick={handleGoogle} className="mt-4 w-full py-3 flex items-center justify-center gap-2 border rounded-md bg-background">
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </motion.button>

      <motion.p variants={item} className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account? <a href="/signup" className="text-primary font-medium">Sign up</a>
      </motion.p>
      </motion.div>
    </div>
  );
}
