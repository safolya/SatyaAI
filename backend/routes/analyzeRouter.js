const express=require("express");
require("dotenv").config();
const router=express.Router();

const {GoogleGenAI, createPartFromCodeExecutionResult} = require ("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function main(contents) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: `
            Analyze the following content for misinformation and credibility. Do not give a simple "true" or "false" verdict.
            Instead, provide a detailed credibility report in JSON format. The JSON object must have these exact keys:
            - "credibilityScore": An integer score from 0 (highly unreliable) to 100 (highly credible).
            - "summary": A brief, neutral summary of the main claims in the content.
            - "manipulativeTechniques": An array of strings, each describing a detected manipulative technique (e.g., "Emotional Language", "Appeal to Authority", "False Dichotomy"). If none, return an empty array.
            - "sourceAnalysis": An analysis of the likely source, its potential biases, and overall reliability.
            - "factCheck": An array of objects, where each object has two keys: "claim" (the specific claim made in the text) and "verification" (a brief verification, correction, or context for that claim).

            Here is the content to analyze:
            ---
            ${contents}
            ---
        `,
  });
  return response.text;
}



router.post("/text",async(req,res)=>{
   try{
      let contents=req.body.question;
      let result=await main(contents);
      res.send(result);
   }catch(err){
    console.log(err.message);
   }
});

module.exports=router