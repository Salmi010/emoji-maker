'use client';

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface EmojiGeneratorProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

export function EmojiGenerator({ onGenerate, isLoading }: EmojiGeneratorProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await onGenerate(prompt);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
        <span role="img" aria-label="emoji">😊</span> 
        Emoji maker
      </h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="Enter a prompt to generate an emoji"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </form>
    </div>
  );
} 