import { CategoryCard } from "@/components/CategoryCard";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { nameToSlug } from "@/lib/utils";

type ApiQAResponse = Record<
  string,
  Array<{ pergunta: string; resposta: string }>
>;

type CategoryFromApi = { id: number; name: string; slug: string };

export default function Home() {
  const [data, setData] = useState<ApiQAResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de busca

  useEffect(() => {
    api
      .get<ApiQAResponse>("/api/qa")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories: CategoryFromApi[] = useMemo(() => {
    if (!data || typeof data !== "object") return [];

    return Object.entries(data)
      .map(([name], index) => ({
        id: index,
        name,
        slug: nameToSlug(name),
      }))
      .filter((category) => {
        // Filtra as categorias baseado no termo de busca
        if (!searchTerm.trim()) return true;

        const term = searchTerm.toLowerCase();
        const categoryName = category.name.toLowerCase();

        // Verifica se o nome da categoria contém o termo de busca
        return categoryName.includes(term);
      });
  }, [data, searchTerm]); // Adiciona searchTerm como dependência

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary/50 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          Could not load categories. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-[100%] blur-[120px] opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-foreground/80 mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Master your knowledge</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
          >
            Interview Flashcards
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Select a topic below to sharpen your interview skills.
            <br className="hidden md:block" />
            Your path to confident interviewing starts here.
          </motion.p>

          {/* Search Bar com funcionalidade real */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-8 max-w-md mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              <div className="relative flex items-center px-4 py-3 rounded-full bg-zinc-900 border border-white/10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xl">
                <Search className="w-5 h-5 text-zinc-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="w-full bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories?.map((category, index) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              slug={category.slug}
              delay={0.1 * index}
            />
          ))}

          {(!categories || categories.length === 0) && (
            <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
              <p className="text-muted-foreground">
                {searchTerm.trim()
                  ? `No categories found for "${searchTerm}". Try a different term.`
                  : "No categories found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
