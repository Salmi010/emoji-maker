'use client';

import { useState } from "react";
import { EmojiGenerator } from "@/components/emoji-generator";
import { EmojiGrid } from "@/components/emoji-grid";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmojis, setGeneratedEmojis] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      console.log('Sending prompt:', prompt);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log('Full API Response:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate emoji');
      }

      if (!data.output) {
        throw new Error('No output received from the API');
      }

      // Log the exact structure of data.output
      console.log('Output structure:', {
        type: typeof data.output,
        isArray: Array.isArray(data.output),
        value: data.output
      });

      const outputArray = Array.isArray(data.output) ? data.output : [data.output];
      
      // Log each URL validation attempt
      const validUrls = outputArray.filter(url => {
        const isString = typeof url === 'string';
        const startsWithHttp = isString && url.startsWith('http');
        console.log('URL validation:', {
          url,
          isString,
          startsWithHttp
        });
        return isString && startsWithHttp;
      });

      if (validUrls.length === 0) {
        console.error('No valid URLs found in:', outputArray);
        throw new Error('No valid image URLs received from the API');
      }

      setGeneratedEmojis(prev => [...prev, ...validUrls]);
    } catch (error) {
      console.error('Failed to generate emoji:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate emoji',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <EmojiGenerator onGenerate={handleGenerate} isLoading={isLoading} />
        <EmojiGrid emojis={generatedEmojis} />
      </div>
    </main>
  );
}
