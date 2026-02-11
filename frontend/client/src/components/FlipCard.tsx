import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  question: string;
  answer: string;
  className?: string;
}

export function FlipCard({ question, answer, className }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div
      className={cn(
        "h-64 w-full cursor-pointer perspective-1000 group",
        className,
      )}
      onClick={handleFlip}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Custom cubic bezier for smooth flip
      >
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden">
          <div
            className={cn(
              "w-full h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center",
              "bg-card border border-white/5 shadow-xl shadow-black/20",
              "transition-colors duration-300",
              isHovering && !isFlipped ? "border-primary/30 bg-card/80" : "",
            )}
          >
            <div className="text-xs font-bold tracking-widest text-primary/70 uppercase mb-4">
              Question
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {question}
            </h3>
            <div className="absolute bottom-6 text-xs text-muted-foreground font-medium opacity-50"></div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div
            className={cn(
              "w-full h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center",
              "bg-zinc-900 border border-primary/20 shadow-xl shadow-primary/5",
              "relative overflow-hidden",
            )}
          >
            {/* Subtle gradient background for the answer side */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10">
              <div className="text-xs font-bold tracking-widest text-emerald-500/80 uppercase mb-4">
                Answer
              </div>
              <p className="text-lg md:text-xl text-zinc-100 font-medium leading-relaxed">
                {answer}
              </p>
            </div>

            <div className="absolute bottom-6 text-xs text-muted-foreground font-medium opacity-50 z-10"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
