import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { answerWelfareQuestion, extractCitizenProfile, generateSpeech, transcribeAudio } from './services/aiService.js'
import { findMissingInformation, matchSchemes } from './services/eligibilityEngine.js'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'welfare-ai-demo' })
})

app.post('/api/transcribe', express.raw({ type: 'audio/*', limit: '15mb' }), async (request, response) => {
  if (!Buffer.isBuffer(request.body) || request.body.length === 0) {
    return response.status(400).json({ error: 'No voice recording was received.' })
  }

  try {
    const language = request.query.language === 'ta' ? 'ta' : 'en'
    const transcript = await transcribeAudio(request.body, request.headers['content-type'] || 'audio/webm', language)
    return response.json({ transcript })
  } catch (error) {
    console.error('Voice transcription failed:', error.message)
    return response.status(error.status || 502).json({ error: error.message })
  }
})

app.post('/api/speak', async (request, response) => {
  const { text, language } = request.body || {}
  if (typeof text !== 'string' || !text.trim() || text.length > 2000) {
    return response.status(400).json({ error: 'Text must be between 1 and 2,000 characters.' })
  }

  try {
    const audio = await generateSpeech(text.trim(), language === 'ta' ? 'ta' : 'en')
    return response.type('audio/mpeg').send(audio)
  } catch (error) {
    console.error('Speech generation failed:', error.message)
    return response.status(error.status || 502).json({ error: error.message })
  }
})

app.post('/api/chat', async (request, response) => {
  const { message, language, history } = request.body || {}
  if (typeof message !== 'string' || message.trim().length < 1 || message.length > 2000) {
    return response.status(400).json({ error: 'Send a message under 2,000 characters.' })
  }

  try {
    const reply = await answerWelfareQuestion(message.trim(), language === 'ta' ? 'ta' : 'en', Array.isArray(history) ? history : [])
    return response.json({ reply })
  } catch (error) {
    console.error('Chat response failed:', error.message)
    return response.status(502).json({ error: 'The assistant could not reply right now. Please try again.' })
  }
})

app.post('/api/match', async (request, response) => {
  const description = request.body?.description
  if (typeof description !== 'string' || description.trim().length < 12) {
    return response.status(400).json({ error: 'Please share a little more about your situation.' })
  }
  if (description.length > 3000) {
    return response.status(413).json({ error: 'Please keep your description under 3,000 characters.' })
  }

  try {
    const profile = await extractCitizenProfile(description.trim())
    const matches = matchSchemes(profile)
    return response.json({
      profile,
      matches,
      missingInformation: findMissingInformation(matches),
      notice: 'Prototype only. This is not an official eligibility decision or application.',
    })
  } catch (error) {
    console.error('Scheme matching failed:', error.message)
    return response.status(502).json({ error: 'We could not review that description right now. Please try again.' })
  }
})

app.listen(port, () => {
  console.log(`Welfare AI API listening on http://localhost:${port}`)
})