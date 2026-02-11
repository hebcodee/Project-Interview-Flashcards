import { Link, useRoute } from "wouter";
import { FlipCard } from "@/components/FlipCard";
import { AddCardDialog } from "@/components/AddCardDialog";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { nameToSlug } from "@/lib/utils";

type ApiQAResponse = Record<
  string,
  Array<{ pergunta: string; resposta: string }>
>;

type CategoryFromApi = {
  id: number;
  name: string;
  slug: string;
  cards: Array<{ pergunta: string; resposta: string }>;
};

export default function CategoryView() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug ?? "";

  const [data, setData] = useState<ApiQAResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    api
      .get<ApiQAResponse>("/api/qa")
      .then((response) => setData(response.data))
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const category: CategoryFromApi | null = useMemo(() => {
    if (!data || !slug || typeof data !== "object") return null;
    const entries = Object.entries(data);
    const index = entries.findIndex(([name]) => nameToSlug(name) === slug);
    if (index === -1) return null;
    const [name, cards] = entries[index];
    return {
      id: index,
      name,
      slug: nameToSlug(name),
      cards: cards ?? [],
    };
  }, [data, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Category not found</h2>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] right-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/">
            <span className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                Study Set
              </span>
              <span className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" /> Estimated 15m
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.cards.length > 0
                ? `Explore ${category.cards.length} flashcards in this category.`
                : "No flashcards in this category yet."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-3xl font-bold font-display text-white">
                {category.cards.length}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Cards
              </span>
            </div>
            <AddCardDialog categoryId={category.id} />
          </motion.div>
        </div>

        {/* Cards Grid - pergunta/resposta da API */}
        {category.cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <FlipCard
                  question={card.pergunta}
                  answer={card.resposta}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6 shadow-xl border border-white/5">
              <BookOpen className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No flashcards yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              This category is empty. Be the first to add some knowledge!
            </p>
            <AddCardDialog categoryId={category.id} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
