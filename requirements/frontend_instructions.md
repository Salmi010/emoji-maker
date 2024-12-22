# Project Overview
Use this guide to build a web app where users can give a text prompt to generate emoji using model hosted on Replicate.

# Feature Requirements
- We will use Next.js, Shadcn, Lucid, Supabase, Clark
- Create a form where users can put in a prompt, and clicking on a button that calls the Replicate model to generate an emoji
-Have a nice UI & animation when the emoji is blank or generating
- Display all the images ever generated in a grid
- When hover each emoji img, an icon button for download and an icon button for like should be shown up

# Relevant Docs

## How to use the replicate emoji generator model
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const output = await replicate.run(
  "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
  {
    input: {
      width: 1024,
      height: 1024,
      prompt: "A TOK emoji of a man",
      refine: "no_refiner",
      scheduler: "K_EULER",
      lora_scale: 0.6,
      num_outputs: 1,
      guidance_scale: 7.5,
      apply_watermark: false,
      high_noise_frac: 0.8,
      negative_prompt: "",
      prompt_strength: 0.8,
      num_inference_steps: 50
    }
  }
);
console.log(output);

# Current File structure

