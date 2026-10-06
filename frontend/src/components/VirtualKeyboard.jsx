import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, CornerDownLeft, Eye, EyeOff, X } from 'lucide-react';

export const VirtualKeyboard = ({ 
  isOpen, 
  onClose, 
  onKeyPress, 
  onBackspace, 
  onSubmit, 
  isPassword = false 
}) => {
  const [shift, setShift] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '.'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', '_', '-']
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl bg-dark-900/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-dark-700 select-none"
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Hands-Free Virtual Keyboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 rounded-lg bg-dark-800 text-gray-400 hover:text-white"
                title="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div className="space-y-1.5">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1.5">
              {rIdx === 3 && (
                <button
                  type="button"
                  onClick={() => setShift(!shift)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    shift ? 'bg-brand-500 text-white shadow-brand' : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  ⇧ Shift
                </button>
              )}
              {row.map((char) => {
                const displayChar = shift ? char.toUpperCase() : char;
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onKeyPress(displayChar)}
                    className="w-9 h-10 sm:w-11 sm:h-11 rounded-xl bg-dark-800 hover:bg-brand-500 text-white font-semibold text-sm sm:text-base flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                  >
                    {displayChar}
                  </button>
                );
              })}
              {rIdx === 3 && (
                <button
                  type="button"
                  onClick={onBackspace}
                  className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center transition-all"
                >
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Bottom Bar: Space, Clear, Enter */}
          <div className="flex justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onKeyPress(' ')}
              className="flex-1 max-w-xs py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 text-xs font-bold transition-all"
            >
              Space
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1 shadow-brand transition-all"
            >
              <span>Done</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VirtualKeyboard;
