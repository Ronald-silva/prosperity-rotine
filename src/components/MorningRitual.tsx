import { useState } from 'react';
import { useStore } from '../store/useStore';
import { playLevelUp } from '../lib/sounds';
import { Sword, Shield, Flame, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WAR_CRIES = [
  "Hoje eu escolho a dor da disciplina, não a dor do arrependimento.",
  "Não existe amanhã. Existe agora.",
  "Enquanto os fracos dormem, os guerreiros constroem impérios.",
  "Cada tarefa completada é um tijolo no meu futuro.",
  "A procrastinação é o ladrão dos sonhos. Hoje eu recupero o que é meu.",
  "Disciplina é liberdade. Preguiça é prisão.",
  "Eu não preciso de motivação. Eu preciso de decisão.",
  "O mundo pertence a quem executa.",
];

export function MorningRitual() {
  const { user, completeMorningRitual, settings, tasks } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const ritualDone = user.morningRitualDate === today;

  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  if (ritualDone) return null;

  const warCry = WAR_CRIES[Math.floor(new Date().getDate() % WAR_CRIES.length)];
  const totalXPAvailable = tasks.reduce((s, t) => s + t.xpReward, 0);

  const handleCommit = () => {
    setExiting(true);
    if (settings.soundEnabled) playLevelUp();
    setTimeout(() => {
      completeMorningRitual();
    }, 600);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="max-w-lg w-full mx-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center space-y-8"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sword className="w-10 h-10 text-primary" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-3">
                      Ritual Matinal
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Antes de começar, declare guerra ao dia.
                    </p>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="mx-auto flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/25"
                  >
                    Estou pronto
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center space-y-8"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Flame className="w-10 h-10 text-orange-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-8">
                    <p className="text-xl font-medium text-foreground italic leading-relaxed">
                      "{warCry}"
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-card/50 border border-border rounded-lg p-4">
                      <p className="text-2xl font-bold text-primary">{tasks.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Missões hoje</p>
                    </div>
                    <div className="bg-card/50 border border-border rounded-lg p-4">
                      <p className="text-2xl font-bold text-orange-400">{totalXPAvailable}</p>
                      <p className="text-xs text-muted-foreground mt-1">XP disponível</p>
                    </div>
                    <div className="bg-card/50 border border-border rounded-lg p-4">
                      <p className="text-2xl font-bold text-green-400">{user.streak}</p>
                      <p className="text-xs text-muted-foreground mt-1">Dias de streak</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="mx-auto flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-xl text-lg font-semibold hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-orange-600/25"
                  >
                    Eu aceito o desafio
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center space-y-8"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-red-400" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Seu compromisso:
                    </h2>
                    <div className="bg-card border border-red-900/30 rounded-xl p-6 space-y-3 text-left">
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Vou completar TODAS as tarefas hoje
                      </p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Não vou negociar comigo mesmo
                      </p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Se a procrastinação vier, vou usar o botão do pânico
                      </p>
                      <p className="text-sm text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Execução é tudo. Perfeição é desculpa.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCommit}
                    className="mx-auto flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl text-xl font-bold hover:from-red-500 hover:to-orange-500 transition-all active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                  >
                    <Sword className="w-6 h-6" />
                    DECLARAR GUERRA AO DIA
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
