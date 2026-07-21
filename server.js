import express from 'express'
import { GoogleGenAI } from '@google/genai'

const app = express()
app.use(express.json())

app.post('/api/generate-message', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  const { name, gender, date, time, food, notes } = req.body

  const prompt = `You are writing a heartfelt romantic message for someone who has just accepted a date invitation.

Name: ${name}
Gender: ${gender}
Date: ${date}
Time: ${time}
Food: ${food || 'not specified'}
Notes: ${notes || 'none'}

Requirements:
- Around 50 words.
- Warm, cute, genuine, natural, slightly playful.
- Mention their name naturally.
- Mention the planned date or food only if it feels natural.
- Do NOT sound like AI. Do NOT write poetry. Do NOT overuse compliments.
- Do NOT use emojis. Do NOT use quotation marks.
- Output ONLY the final message. No preamble, no labels, no markdown.`

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    })

    const message = response.text?.trim()
    if (!message) throw new Error('Empty response from Gemini')

    res.json({ message })
  } catch (err) {
    console.error('Gemini API Error:', err)
    const fallbackMessage = `Hey, you. Yes, you.\n\nI've been wanting to tell you something for a while now, and I finally worked up the courage to say it — in the form of a website, because apparently that's my love language.\n\nYou make everything better. Not just good, but genuinely, noticeably better. The way you laugh, the way you think, the way you show up — it matters more than you know.\n\nSo here it is: I like you. A lot. And I'd really love for you to say yes. 💕`
    res.json({ message: fallbackMessage })
  }
})

app.listen(3001, () => console.log('Express server running on http://localhost:3001'))
