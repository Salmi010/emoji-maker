import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('REPLICATE_API_TOKEN is not set');
    return NextResponse.json(
      { error: 'Replicate API token not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();
    console.log('Generating emoji with prompt:', prompt);
    console.log('Using Replicate token:', process.env.REPLICATE_API_TOKEN?.slice(0, 5) + '...');

    // First, predict the model
    const prediction = await replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        prompt: "A TOK emoji of " + prompt,
        width: 512,
        height: 512,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        negative_prompt: "",
        num_outputs: 1
      }
    });

    console.log('Prediction created:', prediction);

    // Wait for the prediction to complete
    let finalPrediction = await replicate.predictions.get(prediction.id);
    while (finalPrediction.status !== 'succeeded' && finalPrediction.status !== 'failed') {
      console.log('Waiting for prediction...', finalPrediction.status);
      await new Promise(resolve => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    console.log('Final prediction:', finalPrediction);

    if (finalPrediction.status === 'failed') {
      throw new Error('Prediction failed: ' + finalPrediction.error);
    }

    const output = finalPrediction.output;
    console.log('Replicate Response:', {
      outputType: typeof output,
      isArray: Array.isArray(output),
      rawOutput: output,
      stringified: JSON.stringify(output)
    });

    if (!output) {
      throw new Error('No output received from Replicate');
    }

    if (typeof output === 'string') {
      console.log('Returning single URL:', output);
      return NextResponse.json({ output: [output] });
    }

    if (Array.isArray(output)) {
      const validUrls = output.filter(url => typeof url === 'string');
      console.log('Returning array of URLs:', validUrls);
      if (validUrls.length === 0) {
        throw new Error('Replicate returned no valid URLs');
      }
      return NextResponse.json({ output: validUrls });
    }

    console.error('Unexpected output format:', output);
    throw new Error(`Unexpected output format: ${typeof output}`);

  } catch (error) {
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      error
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate emoji' },
      { status: 500 }
    );
  }
} 