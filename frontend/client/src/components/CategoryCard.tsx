import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  count?: number;
  delay?: number;
}

export function CategoryCard({
  name,
  slug,
  count,
  delay = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      <Link
        href={`/category/${slug}`}
        className="block h-full outline-none group"
      >
        <div
          className="
          relative h-full flex flex-col justify-between p-8 rounded-3xl
          bg-card/50 border border-white/5 backdrop-blur-sm
          hover:bg-card hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10
          transition-all duration-300 group-focus:ring-2 group-focus:ring-primary/50
        "
        >
          {/* Decorative gradient blob */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-primary group-hover:text-white group-hover:bg-primary transition-colors duration-300">
                <Layers className="w-6 h-6" />
              </div>
              {count !== undefined && (
                <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  {count} cards
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>

            <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm"></p>
          </div>

          <div className="mt-8 flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Start Learning <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
