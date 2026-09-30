export async function findSchemes(description) {
  const response = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'We could not review that description. Please try again.')
  }
  return result
}

export async function transcribeVoice(blob, language) {
  const response = await fetch(`/api/transcribe?language=${language}`, {
    method: 'POST',
    headers: { 'Content-Type': blob.type || 'audio/webm' },
    body: blob,
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Voice transcription failed.')
  }
  return result.transcript
}

export async function askAssistant(message, language, history) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history }),
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'The assistant could not reply right now.')
  }
  return result.reply
}

export async function generateSpokenReply(text, language) {
  const response = await fetch('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  })

  if (!response.ok) {
    const result = await response.json()
    const error = new Error(result.error || 'Spoken reply is unavailable.')
    error.status = response.status
    throw error
  }
  return response.blob()
}