# Welfare-AI

## Tamil AI and voice setup

Text chat supports OpenRouter and requests replies in Tamil script. Put your OpenRouter key in `OPENAI_API_KEY`. The example config routes text requests through OpenRouter and uses `openai/gpt-4o-mini`.

For native Tamil speech, set a Sarvam AI key in `SARVAM_API_KEY`. Tamil audio uses Sarvam Bulbul with the `ta-IN` voice. `OPENAI_AUDIO_API_KEY` is optional and is used for English speech and voice transcription; an OpenRouter text key cannot be used for these audio endpoints. Keep real keys in `server/.env`, never in `.env.example` or client code. Revoke any key that has been pasted into a shared file or chat.