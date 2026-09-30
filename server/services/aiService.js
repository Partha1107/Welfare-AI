import OpenAI, { toFile } from 'openai'

export async function transcribeAudio(audio, mimeType, language) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('Voice transcription is not configured on the server.')
    error.status = 503
    throw error
  }

  const extension = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : mimeType.includes('wav') ? 'wav' : 'webm'
  const file = await toFile(audio, `citizen-voice.${extension}`, { type: mimeType })
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const transcript = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: language === 'ta' ? 'ta' : 'en',
  })
  return transcript.text
}

export async function generateSpeech(text, language) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('Spoken Tamil is not configured on the server.')
    error.status = 503
    throw error
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const speech = await client.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'marin',
    input: text,
    response_format: 'mp3',
    instructions: language === 'ta'
      ? 'Speak in clear, natural Tamil as a friendly native Tamil Nadu speaker. Use everyday spoken Tamil pronunciation, not a foreign-accented reading. Speak at a calm, moderate pace, articulate each word clearly, and sound warm and reassuring without becoming theatrical. Keep English scheme names recognizable.'
      : 'Speak in clear, warm conversational Indian English at a calm, moderate pace. Articulate clearly and sound like a friendly, patient helper.',
  })
  return Buffer.from(await speech.arrayBuffer())
}

const offlineAnswers = {
  ta: [
    { terms: ['விவசாய', 'விவசாயி', 'பயிர்'], answer: 'சரி, விவசாய உதவிகளைப் பார்ப்போம். PM-KISAN அல்லது PMFBY போன்ற திட்டங்கள் உங்களுக்கு பொருந்துமா என்று உள்ளூர் விவசாய அலுவலகம் அல்லது CSC-யில் கேட்கலாம். நில ஆவணம், பயிர், மாவட்ட விவரங்களைக் கேட்டுத் தெரிந்துகொள்ளுங்கள். தகுதியை அவர்கள் உறுதிப்படுத்துவார்கள்.' },
    { terms: ['படிப்பு', 'பள்ளி', 'கல்வி', 'மாணவி', 'மாணவன்', 'மகள்', 'மகன்'], answer: 'குழந்தையின் படிப்புக்கான உதவி தேடுகிறீர்களா? பள்ளி அல்லது மேற்படிப்பு உதவித்தொகைகள் இருக்கலாம். குழந்தையின் வகுப்பு, வருமானச் சான்று, விண்ணப்பக் கடைசி தேதி பற்றி பள்ளியில் கேளுங்கள். வேண்டுமானால், அடுத்து என்ன விவரம் தேவை என்று சேர்ந்து பார்க்கலாம்.' },
    { terms: ['மருத்துவ', 'மருந்து', 'சிகிச்சை', 'உடல்நலம்'], answer: 'மருத்துவச் செலவு கவலையாக இருக்கலாம், புரிகிறது. அரசு மருத்துவக் காப்பீடு அல்லது மாநில உதவி கிடைக்குமா என்று மருத்துவமனை உதவி மையத்தில் கேளுங்கள். குடும்ப அட்டை மற்றும் சிகிச்சை விவரங்களை எடுத்துச் செல்லுங்கள்; அவர்கள் உங்கள் குடும்பத்திற்கான விதிகளைச் சரிபார்ப்பார்கள்.' },
    { terms: ['ஆவண', 'சான்று'], answer: 'நிச்சயமாக. பொதுவாக அடையாள அட்டை, குடும்ப அட்டை, வருமானச் சான்று, வங்கி விவரம் போன்றவற்றைக் கேட்கலாம். விவசாய உதவிக்கு நில ஆவணமும், படிப்பு உதவிக்கு பள்ளி விவரங்களும் தேவைப்படலாம். சரியான பட்டியலை CSC அல்லது சம்பந்தப்பட்ட அலுவலகத்தில் உறுதிப்படுத்துங்கள்.' },
    { terms: ['எப்படி', 'எங்கே', 'விண்ணப்ப'], answer: 'அடுத்த படியைப் பார்க்கலாம். திட்டத்தைப் பொறுத்து விண்ணப்பிக்கும் இடம் மாறும். அருகிலுள்ள CSC அல்லது அரசு அலுவலகத்தில் தற்போதைய விண்ணப்ப முறை மற்றும் கடைசி தேதியைக் கேளுங்கள்.' },
  ],
  en: [
    { terms: ['farmer', 'farming', 'crop'], answer: 'Sure, let’s look at farming support. You could ask your local agriculture office or CSC whether programmes such as PM-KISAN or PMFBY may fit. They may ask about land records, your crop and district. They can confirm the current rules with you.' },
    { terms: ['school', 'study', 'student', 'daughter', 'son', 'education'], answer: 'Let’s see what might help with your child’s studies. School or post-school scholarships may be available. Ask the school about the student’s class, income certificate and application dates. I can help you figure out what to ask next.' },
    { terms: ['medical', 'health', 'hospital', 'treatment'], answer: 'Medical costs can be a lot to manage. Ask a participating hospital help desk whether public health coverage or state support may apply to your household and treatment. Take household and treatment details so they can check the rules.' },
    { terms: ['document', 'certificate', 'paper'], answer: 'Of course. Common documents include identity and household details, income certificate and bank details. Farming support may ask for land records, while education support may need school details. A CSC or relevant office can confirm the exact list.' },
    { terms: ['apply', 'where', 'how'], answer: 'Let’s take it one step at a time. Application steps depend on the programme. A local CSC or the relevant department can confirm where to apply, which documents to bring and the current deadlines.' },
  ],
}

export async function answerWelfareQuestion(message, language, history = []) {
  if (!process.env.OPENAI_API_KEY) {
    const text = message.toLowerCase()
    const answers = offlineAnswers[language === 'ta' ? 'ta' : 'en']
    return answers.find(({ terms }) => terms.some((term) => text.includes(term)))?.answer
      ?? (language === 'ta'
        ? 'நிச்சயமாக, உதவுகிறேன். விவசாயம், படிப்பு, மருத்துவச் செலவு அல்லது தேவையான ஆவணங்கள் பற்றி கேட்கலாம். உங்கள் நிலைமையைச் சுருக்கமாகச் சொன்னால், அடுத்து என்ன பார்க்கலாம் என்று சேர்ந்து யோசிப்போம். தகுதியை CSC அல்லது அரசு அலுவலகத்தில் உறுதிப்படுத்துங்கள்.'
        : 'Of course, I’m here to help. You can ask about farming, education, medical costs or documents. Tell me a little about your situation and we’ll work out what to check next. A CSC or government office can confirm eligibility.')
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const messages = [
    {
      role: 'system',
      content: `You are Welfare AI, a friendly public-benefits information helper. Reply in ${language === 'ta' ? 'natural, simple spoken Tamil' : 'plain conversational English'}. Sound like a patient, kind neighbour: warm, reassuring without making promises, never bureaucratic. Use short sentences that sound natural when read aloud. Ask one gentle follow-up question when facts are missing. Give general guidance, never claim eligibility or application approval. Do not invent schemes, amounts, deadlines, or legal/medical advice. Explain that citizens should confirm current rules with myScheme, the relevant department, or a CSC. Welfare AI complements UMANG, myScheme, and CSC; it does not replace them.`,
    },
    ...history.slice(-8).filter(({ role, content }) => ['user', 'assistant'].includes(role) && typeof content === 'string').map(({ role, content }) => ({ role, content })),
    { role: 'user', content: message },
  ]
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.3,
    messages,
  })
  return completion.choices[0]?.message?.content?.trim() || (language === 'ta' ? 'மன்னிக்கவும், இப்போது பதில் அளிக்க முடியவில்லை.' : 'Sorry, I could not prepare an answer just now.')
}

const numberFromText = (text, expression) => {
  const match = text.match(expression)
  return match ? Number(match[1].replaceAll(',', '')) : null
}

function inferProfile(description) {
  const text = description.toLowerCase()
  const age = numberFromText(text, /\b(?:i am|i'm|aged?)\s+(\d{1,3})\b/)
    ?? numberFromText(text, /(?:எனக்கு\s*)?(\d{1,3})\s*வயது/)
  const income = numberFromText(text, /(?:income|earn(?:ing|s)?|salary|வருமானம்)[^\d₹]{0,40}₹?\s*([\d,]+)/)
    ?? numberFromText(text, /₹\s*([\d,]+)/)
  const childCountMatch = text.match(/(?:\b(\d+|one|two|three|four|five|six)\s+(?:children|child|kids)\b|(\d+|ஒன்று|ஒரு|இரண்டு|மூன்று|நான்கு|ஐந்து|ஆறு)\s*(?:குழந்தை|குழந்தைகள்|பிள்ளைகள்))/)
  const writtenCounts = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, ஒன்று: 1, ஒரு: 1, இரண்டு: 2, மூன்று: 3, நான்கு: 4, ஐந்து: 5, ஆறு: 6 }
  const count = childCountMatch?.[1] || childCountMatch?.[2]
  const children = childCountMatch
    ? Number(count) || writtenCounts[count]
    : null
  const locationMatch = description.match(/\b(?:in|from|live in|living in)\s+(?:a\s+)?(?:village\s+in\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/)
  const location = /தமிழ்நா|தமிழக/.test(description) ? 'Tamil Nadu' : locationMatch?.[1]?.replace(/[.,].*$/, '') ?? null
  const occupation = /farmer|farming|cultivat|விவசாயி|விவசாயம்/i.test(description)
    ? 'Small farmer'
    : /daily wage|labourer|laborer/i.test(description)
      ? 'Daily-wage worker'
      : null
  const needs = []
  if (/farmer|farming|crop|cultivat|விவசாயி|விவசாயம்/i.test(text)) needs.push('farming')
  if (/school|student|studying|college|daughter|son|education|படிக்கிற|படிப்பு|மாணவி|மாணவன்|கல்வி|பள்ளி|கல்லூரி|மகள்|மகன்/i.test(text)) needs.push('education')
  if (/medical|health|hospital|treatment|medicine|wife.*expense|husband.*expense|மருத்துவ|மருந்து|சிகிச்சை|உடல்நலம்/i.test(text)) needs.push('healthcare')
  if (children || /family|children|wife|husband|குடும்பம்|குழந்தை|பிள்ளை|மனைவி/i.test(text)) needs.push('family')

  return {
    age,
    location,
    district: null,
    occupation,
    annualIncome: income,
    children,
    farmer: needs.includes('farming'),
    studentInFamily: needs.includes('education'),
    medicalExpenses: needs.includes('healthcare'),
    needs: [...new Set(needs)],
  }
}

export async function extractCitizenProfile(description) {
  if (!process.env.OPENAI_API_KEY) return inferProfile(description)

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'The citizen may write or speak in English or Tamil. Extract facts explicitly stated, and return JSON only with keys age (number|null), location (string|null), district (string|null), occupation (string|null), annualIncome (number|null, annual rupees), children (number|null), farmer (boolean), studentInFamily (boolean), medicalExpenses (boolean), needs (array of farming, education, healthcare, family). Do not infer sensitive attributes, eligibility, caste, disability, or land ownership. Missing facts must be null or false.',
      },
      { role: 'user', content: description },
    ],
  })
  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('The profile could not be extracted.')
  return JSON.parse(content)
}