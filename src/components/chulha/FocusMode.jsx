import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Square, X, Timer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FocusMode({ recipe, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = recipe.steps || [];
  
  // Timer state
  const [timerDuration, setTimerDuration] = useState(null); // in seconds
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  // Parse time from current step text
  useEffect(() => {
    if (!steps[currentStep]) return;
    const text = steps[currentStep];
    
    // Simple regex to find "X min/minutes" or "X hr/hour/hours"
    const match = text.match(/(\d+)\s*(min|minute|minutes|hr|hour|hours)/i);
    if (match) {
      const amount = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      let seconds = 0;
      if (unit.startsWith("min")) {
        seconds = amount * 60;
      } else if (unit.startsWith("h")) {
        seconds = amount * 3600;
      }
      setTimerDuration(seconds);
      setTimeLeft(seconds);
      setTimerActive(false);
    } else {
      setTimerDuration(null);
      setTimeLeft(null);
      setTimerActive(false);
    }
  }, [currentStep, steps]);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Play a sound or alert could be added here
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  if (steps.length === 0) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background text-foreground animate-in fade-in duration-300">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div className="font-display text-lg font-semibold truncate">{recipe.title}</div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close focus mode">
          <X className="size-6" />
        </Button>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-12">
        <span className="mb-6 grid size-16 place-items-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {currentStep + 1}
        </span>
        
        <p className="max-w-4xl text-3xl font-medium leading-relaxed sm:text-5xl sm:leading-tight">
          {steps[currentStep]}
        </p>

        {/* Smart Timer */}
        {timerDuration !== null && (
          <div className="mt-12 flex flex-col items-center gap-4">
            {timeLeft > 0 ? (
              <div className="flex items-center gap-6 rounded-full border bg-card px-8 py-4 shadow-lg">
                <Timer className="size-8 text-primary animate-pulse" />
                <span className="font-display text-5xl font-bold tracking-tighter">
                  {formatTime(timeLeft)}
                </span>
                <Button 
                  size="icon" 
                  variant={timerActive ? "secondary" : "default"}
                  className="size-14 rounded-full"
                  onClick={() => setTimerActive(!timerActive)}
                >
                  {timerActive ? <Square className="size-5 fill-current" /> : <Play className="size-6 fill-current ml-1" />}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-full bg-primary/20 px-8 py-4 text-primary">
                <CheckCircle2 className="size-8" />
                <span className="text-2xl font-bold">Time's up!</span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="flex h-24 shrink-0 items-center justify-between border-t px-6 sm:px-12">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-32 rounded-full text-lg"
          onClick={handlePrev} 
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 size-5" /> Prev
        </Button>
        <div className="text-lg font-medium text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
        <Button 
          size="lg" 
          className="w-32 rounded-full text-lg"
          onClick={currentStep === steps.length - 1 ? onClose : handleNext} 
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"} 
          {currentStep !== steps.length - 1 && <ChevronRight className="ml-2 size-5" />}
        </Button>
      </footer>
    </div>
  );
}
