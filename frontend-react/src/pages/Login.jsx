import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Lock, Activity, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginWithGoogle, loginAsDemo } = useAuth();

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Cyber Grid Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-cardSecondary border border-gray-800/80 rounded-2xl shadow-2xl p-8 relative z-10 backdrop-blur-xl"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/10">
            <ShieldAlert size={36} />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">ThreatPulse</h1>
          <p className="text-xs uppercase tracking-widest text-primary font-bold mt-1">
            Security Operations Center
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Authorized Personnel Only. Authenticate to access real-time incident prioritization.
          </p>
        </div>

        {/* Status indicator */}
        <div className="bg-background border border-gray-800 rounded-xl p-3.5 mb-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-gray-300 font-medium">SOC Gateway</span>
          </div>
          <span className="text-gray-500 font-mono">TLS 1.3 / OAuth2.0</span>
        </div>

        {/* Google Login Component */}
        <div className="space-y-4">
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                loginWithGoogle(credentialResponse);
              }}
              onError={() => {
                console.error('Google Sign-In Failed');
              }}
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
              text="signin_with"
            />
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-gray-500 uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          {/* Demo Bypass Option */}
          <button
            onClick={loginAsDemo}
            className="w-full py-2.5 px-4 bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white rounded-full text-xs font-semibold tracking-wider transition-all border border-gray-700 flex items-center justify-center gap-2"
          >
            <Terminal size={14} className="text-primary" />
            Continue with Demo Analyst Profile
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800/80 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
            <Lock size={12} />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
