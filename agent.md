# Gemini AI Agent Integration

This document explains how the AI agent works in this project, what data it consumes, and how it is tuned to generate the personalized love letter.

## What the Agent Does

The agent's sole purpose is to dynamically write a personalized, heartfelt romantic message after the user accepts the date invitation and fills out the form. 

Instead of showing a generic "Thank you" page, the website transforms the collected data into a unique, custom-written letter that feels natural and warm.

## Where to Find the Code

The code that actually communicates with the Gemini API is located in a Vercel Serverless Function:
**[api/generate-message.ts](file:///C:/Users/Kausthub/OneDrive/Desktop/weblight/api/generate-message.ts)**

If you want to modify the prompt, change the model, or add more data fields, you will do it inside that file.

## What Data the Agent Reads

The agent is fed the specific choices the user made during the website flow. When the user clicks "Continue" on the About You card, the frontend gathers the following state and sends it to the serverless function (`api/generate-message.ts`):

1. **Name**: The user's name (e.g., "Sarah").
2. **Gender**: The user's gender (e.g., "Female").
3. **Date**: The chosen date for the outing (e.g., "2026-07-25").
4. **Time**: The chosen time (e.g., "19:00").
5. **Food**: The selected food choices (e.g., "Sushi, Italian").
6. **Notes**: Any extra dietary restrictions or comments provided by the user.

## How the Agent is Tuned (The System Prompt)

To ensure the AI doesn't sound robotic, overly cheesy, or like a standard ChatGPT response, it is given a strict set of instructions (a "System Prompt") alongside the user's data.

Here is the exact prompt used to tune the agent's behavior:

```text
You are writing a heartfelt romantic message for someone who has just accepted a date invitation.

Name: [User's Name]
Gender: [User's Gender]
Date: [Chosen Date]
Time: [Chosen Time]
Food: [Chosen Food]
Notes: [Optional Notes]

Requirements:
- Around 50 words.
- Warm, cute, genuine, natural, slightly playful.
- Mention their name naturally.
- Mention the planned date or food only if it feels natural.
- Do NOT sound like AI. Do NOT write poetry. Do NOT overuse compliments.
- Do NOT use emojis. Do NOT use quotation marks.
- Output ONLY the final message. No preamble, no labels, no markdown.
```

### Why these constraints?
- **"Around 50 words"**: Keeps the message short enough to read quickly on the typewriter animation without dragging on too long.
- **"Mention food/date ONLY if it feels natural"**: Prevents the AI from awkwardly forcing the schedule into the middle of a romantic paragraph (e.g. avoiding *"I can't wait to eat Sushi with you on 2026-07-25 at 19:00"*).
- **"Do NOT sound like AI / No poetry / No emojis"**: Forces the LLM to drop its default "helpful assistant" persona and write like a real human texting or writing a physical letter. Since we already have a floating envelope emoji in the UI, extra emojis in the text look messy.
- **"Output ONLY the final message"**: Prevents the AI from saying *"Here is your message: ..."* before the actual text, which would break the illusion.

## The Model

The project uses `gemini-3.5-flash`. This model is chosen because it is extremely fast (crucial for keeping the loading animation around 3 seconds) while still being more than capable of generating high-quality, natural language text.
