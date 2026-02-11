import { useState, useCallback } from "react";
import type { Category, Card, CategoryWithCards } from "@/types";

// Mock Data
const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "JavaScript Basics",
    slug: "javascript-basics",
    description: "Fundamental concepts of JS, from variables to closures."
  },
  {
    id: 2,
    name: "React Hooks",
    slug: "react-hooks",
    description: "Learn about useState, useEffect, and more."
  },
  {
    id: 3,
    name: "CSS Flexbox",
    slug: "css-flexbox",
    description: "Mastering layout with Flexbox."
  }
];

const MOCK_CARDS: Card[] = [
  {
    id: 1,
    categoryId: 1,
    question: "What is a Closure?",
    answer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment)."
  },
  {
    id: 2,
    categoryId: 1,
    question: "What is the difference between == and ===?",
    answer: "The == operator does type coercion before comparing, while === compares both value and type without coercion."
  },
  {
    id: 3,
    categoryId: 1,
    question: "What is 'hoisting'?",
    answer: "Hoisting is JavaScript's behavior of moving declarations to the top of the current scope (script or function) before code execution."
  },
  {
    id: 4,
    categoryId: 2,
    question: "What does useState do?",
    answer: "It declares a state variable that you can update directly. It returns a pair: the current state value and a function that lets you update it."
  },
  {
    id: 5,
    categoryId: 2,
    question: "When does useEffect run?",
    answer: "It runs after the first render and after every update, unless a dependency array is provided to control when it runs."
  },
  {
    id: 6,
    categoryId: 3,
    question: "What is 'justify-content' used for?",
    answer: "It defines how the browser distributes space between and around content items along the main-axis of a flex container."
  },
  {
    id: 7,
    categoryId: 3,
    question: "What is 'align-items' used for?",
    answer: "It defines the default behavior for how flex items are laid out along the cross axis on the current line."
  }
];

// Re-using the same hook names but with local state logic
export function useCategories() {
  return {
    data: MOCK_CATEGORIES,
    isLoading: false,
    error: null
  };
}

export function useCategory(slug: string) {
  const category = MOCK_CATEGORIES.find(c => c.slug === slug);
  const cards = MOCK_CARDS.filter(c => c.categoryId === category?.id);
  
  return {
    data: category ? { ...category, cards } : null,
    isLoading: false,
    error: null
  };
}

export function useCreateCard() {
  // Mock mutation that doesn't persist beyond session for simplicity
  const mutate = useCallback(async (data: any) => {
    console.log("Mock create card:", data);
    return { id: Math.random(), ...data };
  }, []);

  return {
    mutate,
    isPending: false
  };
}
