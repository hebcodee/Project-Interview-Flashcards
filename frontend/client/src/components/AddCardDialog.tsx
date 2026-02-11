import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCard } from "@/hooks/use-flashcards";
import { insertCardSchema } from "@/types";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertCardSchema.extend({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  categoryId: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCardDialog({ categoryId }: { categoryId: number }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createCard = useCreateCard();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      categoryId: categoryId,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createCard.mutate(data);
      toast({
        title: "Success",
        description: "New flashcard added successfully",
      });
      form.reset({ question: "", answer: "", categoryId });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create card",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="
            rounded-full px-6 bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:text-white 
            text-foreground transition-all duration-300 shadow-lg shadow-black/20
          "
        >
          <Plus className="w-4 h-4 mr-2" /> Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Create Flashcard</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new question and answer pair to this deck.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Question</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. What is closure in JavaScript?" 
                      className="bg-zinc-900 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl py-6"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Answer</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. A closure is the combination of a function bundled together with references to its surrounding state..." 
                      className="min-h-[120px] bg-zinc-900 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen(false)}
                className="hover:bg-white/5 text-zinc-400 hover:text-white rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCard.isPending}
                className="bg-primary hover:bg-primary/90 text-white rounded-lg px-8 shadow-lg shadow-primary/20"
              >
                {createCard.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Card"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
