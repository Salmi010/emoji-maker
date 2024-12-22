'use client';

import Image from "next/image";
import { Download, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface EmojiGridProps {
  emojis: string[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  if (!emojis?.length) {
    return (
      <div className="text-center text-gray-500 my-8">
        No emojis generated yet. Try creating some!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
      {emojis.map((emoji, index) => {
        console.log(`Rendering emoji ${index}:`, emoji);
        
        if (!emoji || typeof emoji !== 'string') {
          console.warn(`Invalid emoji at index ${index}:`, emoji);
          return null;
        }
        
        return (
          <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              key={emoji}
              src={emoji}
              alt={`Generated emoji ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="icon" variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 