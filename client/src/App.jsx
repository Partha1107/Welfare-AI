import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  HeartPulse,
  Leaf,
  LoaderCircle,
  Mic,
  GraduationCap,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  UsersRound,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { askAssistant, findSchemes, generateSpokenReply, transcribeVoice } from './api.js'

const translations = {
  en: {
    language: 'Language', prototype: 'Prototype · India', eyebrow: 'Find support that may fit', title: 'Tell us what is going on.', intro: 'Use your own words. We’ll look for support your family may be able to check.',
    steps: ['Your story', 'Possible help', 'Next steps'], ecosystemTitle: 'Works alongside public services.', ecosystem: 'UMANG, myScheme and CSC help people access government services. Welfare AI is a prototype that helps explain possible support. It does not replace those services.',
    household: 'YOUR FAMILY', question: 'What do you need help with?', noAccount: 'No account needed', describe: 'Tell us about your situation', placeholder: 'For example: I am a farmer. My daughter is in school and my wife needs medical care.',
    hint: 'Add your place, work, income or family needs if you can.', speak: 'Speak in English', listening: 'Listening…', example: 'Use example', gentle: 'Say it in your own words.', submit: 'Find possible help', loading: 'Checking…',
    emptyError: 'Tell us a little about your family and what help you need.', voiceUnsupported: 'Voice input is not available in this browser. You can type instead.', voiceError: 'Could not start voice input. Check microphone permission or type instead.', voicePermission: 'Allow microphone access for this site in your browser settings, then try again.', voiceNoSpeech: 'No speech was heard. Check your microphone and try speaking again.', voiceNetwork: 'Speech recognition could not connect. Check your internet connection or use voice recording below.', voiceNetworkFallback: 'Online speech recognition is unavailable. You can record a short voice message; audio is sent to the server for transcription.', voiceLanguage: 'Speech recognition does not support this language in your browser. Choose another language or type instead.', stopSpeaking: 'Stop listening', recordVoice: 'Record voice', transcribing: 'Transcribing…', voiceFallbackUnsupported: 'Voice recording is not supported by this browser. Try another browser or type instead.', voiceNeedsServerKey: 'Voice transcription needs an OpenAI API key in server/.env. You can type your situation meanwhile.', voiceRecordingError: 'Could not record audio. Check microphone permission and try again.', noAudio: 'No audio was recorded. Please try again.',
    quietTitle: 'Clear answers, in simple words.', quietBody: 'See why support may fit, what details are missing, and what to do next.', summary: 'YOUR SUMMARY', resultsTitle: 'Here is what you can check.', startOver: 'Start again', understood: 'What we understood', moreDetails: 'Add a little more detail to your story.',
    possibleMatch: 'POSSIBLE MATCHES', demo: 'DEMO DATA', potential: 'May fit', confirm: 'To check:', documents: 'Documents to ask about:', noMatches: 'No close match in this small demo list. A local CSC may help you check other support.',
    disclaimer: 'These are ideas to check, not approvals. Rules can change. Confirm with the relevant department or service.', needDetails: 'DETAILS THAT MAY HELP', gather: 'Before you check, find out…', allSet: 'You have a useful starting point. A local service can check the full rules.',
    needPerson: 'Would you like help in person?', csc: 'A Common Services Centre (CSC) can help people use government services.', findCsc: 'CSC information', how: 'How it works', howBody: 'AI helps understand your story. Simple rules find possible matches. This is not an official decision.',
    years: 'years', children: 'children', perYear: 'per year', noResult: 'We could not check that just now. Please try again.',
    botTitle: 'Ask Welfare AI', botOnline: 'Here with you', chatWelcome: 'Hi, I’m glad you stopped by. Tell me what’s on your mind. I can help you look into farming, education or health support, one step at a time.', chatPlaceholder: 'Type a question…', chatSend: 'Send message', chatSpeak: 'Speak this reply', chatMic: 'Ask by voice', chatListening: 'Listening…', chatBusy: 'Thinking…', chatError: 'I could not answer just now. Please try again.', chatVoiceError: 'Could not hear you. Check microphone access or type your question.', chatVoiceFallback: 'Online voice recognition is unavailable. Tap the microphone again to record a question.', chatRecord: 'Record your question', chatStopRecord: 'Stop recording', chatTranscribing: 'Transcribing…', chatNeedsKey: 'Voice transcription needs an OpenAI API key in server/.env. You can type your question meanwhile.', speechOn: 'Turn off spoken replies', speechOff: 'Turn on spoken replies', nativeTamilUnavailable: 'This device has no Tamil voice installed. Add an OpenAI API key in server/.env for natural Tamil voice replies.', speechPlaybackBlocked: 'Your browser blocked automatic audio. Tap the speaker button to hear this reply.',
  },
  ta: {
    language: 'மொழி', prototype: 'முன்மாதிரி · இந்தியா', eyebrow: 'உதவி வாய்ப்புகளைத் தேடுங்கள்', title: 'உங்கள் நிலைமையைச் சொல்லுங்கள்.', intro: 'உங்கள் சொந்த வார்த்தைகளில் சொல்லுங்கள். உங்கள் குடும்பத்திற்குப் பொருந்தக்கூடிய உதவிகளைத் தேடுகிறோம்.',
    steps: ['உங்கள் விவரம்', 'உதவி வாய்ப்புகள்', 'அடுத்த படி'], ecosystemTitle: 'அரசு சேவைகளுடன் இணைந்து செயல்படும்.', ecosystem: 'UMANG, myScheme, CSC ஆகியவை அரசு சேவைகளைப் பெற உதவுகின்றன. Welfare AI உதவி வாய்ப்புகளை விளக்கும் முன்மாதிரி. இது அந்த சேவைகளுக்கு மாற்றாகாது.',
    household: 'உங்கள் குடும்பம்', question: 'என்ன உதவி தேவை?', noAccount: 'கணக்கு தேவையில்லை', describe: 'உங்கள் நிலைமையைச் சொல்லுங்கள்', placeholder: 'உதாரணம்: நான் விவசாயி. என் மகள் பள்ளியில் படிக்கிறாள். என் மனைவிக்கு மருத்துவ உதவி தேவை.',
    hint: 'ஊர், வேலை, வருமானம் அல்லது குடும்பத் தேவைகளைச் சொல்லலாம்.', speak: 'தமிழில் பேசுங்கள்', listening: 'கேட்கிறோம்…', example: 'உதாரணம் பார்க்க', gentle: 'உங்கள் சொந்த வார்த்தைகளில் சொல்லுங்கள்.', submit: 'உதவி வாய்ப்புகளைப் பாருங்கள்', loading: 'பார்க்கிறோம்…',
    emptyError: 'உங்கள் குடும்பம் மற்றும் தேவையான உதவி பற்றி கொஞ்சம் சொல்லுங்கள்.', voiceUnsupported: 'இந்த உலாவியில் குரல் வசதி இல்லை. தட்டச்சு செய்து தொடரலாம்.', voiceError: 'குரலைப் பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது தட்டச்சு செய்யவும்.', voicePermission: 'உலாவி அமைப்புகளில் இந்தத் தளத்திற்கு மைக் அனுமதி வழங்கி மீண்டும் முயற்சிக்கவும்.', voiceNoSpeech: 'குரல் கேட்கவில்லை. மைக்கைச் சரிபார்த்து மீண்டும் பேசுங்கள்.', voiceNetwork: 'இணைய குரல் சேவை கிடைக்கவில்லை. கீழே உள்ள குரல் பதிவைப் பயன்படுத்தலாம்.', voiceNetworkFallback: 'இணைய குரல் சேவை கிடைக்கவில்லை. குரல் பதிவு சேவையகத்திற்கு அனுப்பப்படும்.', voiceLanguage: 'இந்த மொழியை உங்கள் உலாவி குரல் மூலம் அறியவில்லை. வேறு மொழியைத் தேர்ந்தெடுக்கவும் அல்லது தட்டச்சு செய்யவும்.', stopSpeaking: 'பதிவை நிறுத்து', recordVoice: 'குரலைப் பதிவு செய்', transcribing: 'எழுத்தாக்கப்படுகிறது…', voiceFallbackUnsupported: 'இந்த உலாவியில் குரல் பதிவு இல்லை. வேறு உலாவியைப் பயன்படுத்தவும் அல்லது தட்டச்சு செய்யவும்.', voiceNeedsServerKey: 'குரலை எழுத்தாக்க server/.env கோப்பில் OpenAI API key தேவை. அதுவரை தட்டச்சு செய்யலாம்.', voiceRecordingError: 'குரலைப் பதிவு செய்ய முடியவில்லை. மைக் அனுமதியைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.', noAudio: 'குரல் பதிவு கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
    quietTitle: 'எளிய சொற்களில் தெளிவான பதில்கள்.', quietBody: 'எந்த உதவி பொருந்தலாம், என்ன விவரம் தேவை, அடுத்து என்ன செய்யலாம் என்பதைப் பாருங்கள்.', summary: 'உங்கள் விவரம்', resultsTitle: 'நீங்கள் பார்க்கக்கூடிய உதவிகள்.', startOver: 'மீண்டும் தொடங்கு', understood: 'நாங்கள் புரிந்துகொண்டது', moreDetails: 'உங்கள் நிலைமையைப் பற்றி மேலும் சொல்லுங்கள்.',
    possibleMatch: 'உதவி வாய்ப்புகள்', demo: 'முன்மாதிரி தரவு', potential: 'பொருந்தலாம்', confirm: 'சரிபார்க்க வேண்டியது:', documents: 'கேட்டு அறிய வேண்டிய ஆவணங்கள்:', noMatches: 'இந்தச் சிறிய பட்டியலில் பொருத்தமான உதவி இல்லை. அருகிலுள்ள CSC-யில் மற்ற உதவிகளைப் பற்றி கேட்கலாம்.',
    disclaimer: 'இவை பார்க்க வேண்டிய வாய்ப்புகள் மட்டுமே; ஒப்புதல் அல்ல. விதிகள் மாறலாம். சம்பந்தப்பட்ட துறை அல்லது சேவையில் உறுதிப்படுத்துங்கள்.', needDetails: 'தேவையான விவரங்கள்', gather: 'சரிபார்க்கும் முன் தெரிந்துகொள்ளுங்கள்…', allSet: 'தொடங்குவதற்கான விவரங்கள் கிடைத்துள்ளன. மீதமுள்ள விதிகளை உள்ளூர் சேவையில் சரிபார்க்கலாம்.',
    needPerson: 'நேரில் உதவி வேண்டுமா?', csc: 'அரசு சேவைகளைப் பெற Common Services Centre (CSC) உதவும்.', findCsc: 'CSC விவரங்கள்', how: 'இது எப்படி வேலை செய்கிறது', howBody: 'AI உங்கள் விவரத்தைப் புரிந்துகொள்ள உதவும். எளிய விதிகள் உதவி வாய்ப்புகளைத் தேடும். இது அரசு முடிவு அல்ல.',
    years: 'வயது', children: 'குழந்தைகள்', perYear: 'ஆண்டு வருமானம்', noResult: 'இப்போது சரிபார்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    botTitle: 'நல உதவி AI-யிடம் கேளுங்கள்', botOnline: 'உங்களுடன் இருக்கிறேன்', chatWelcome: 'வணக்கம்! பேச வந்ததற்கு மகிழ்ச்சி. உங்கள் மனதில் இருப்பதைச் சொல்லுங்கள். விவசாயம், படிப்பு அல்லது மருத்துவ உதவி பற்றி ஒவ்வொரு படியாகவும் பார்க்கலாம்.', chatPlaceholder: 'உங்கள் கேள்வியை எழுதுங்கள்…', chatSend: 'கேள்வியை அனுப்பு', chatSpeak: 'இந்தப் பதிலைக் கேளுங்கள்', chatMic: 'குரலில் கேளுங்கள்', chatListening: 'கேட்கிறேன்…', chatBusy: 'பதில் யோசிக்கிறேன்…', chatError: 'இப்போது பதில் அளிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.', chatVoiceError: 'உங்கள் குரலைக் கேட்க முடியவில்லை. மைக் அனுமதியைச் சரிபார்க்கவும் அல்லது தட்டச்சு செய்யவும்.', chatVoiceFallback: 'இணைய குரல் சேவை கிடைக்கவில்லை. கேள்வியைப் பதிவு செய்ய மைக்கை மீண்டும் அழுத்துங்கள்.', chatRecord: 'கேள்வியைப் பதிவு செய்', chatStopRecord: 'பதிவை நிறுத்து', chatTranscribing: 'எழுத்தாக்கப்படுகிறது…', chatNeedsKey: 'குரலை எழுத்தாக்க server/.env கோப்பில் OpenAI API key தேவை. அதுவரை தட்டச்சு செய்யலாம்.', speechOn: 'குரல் பதிலை நிறுத்து', speechOff: 'குரல் பதிலை இயக்கு', nativeTamilUnavailable: 'இந்தச் சாதனத்தில் தமிழ் குரல் இல்லை. இயல்பான தமிழ் குரல் பதில்களுக்கு server/.env கோப்பில் OpenAI API key அமைக்கவும்.', speechPlaybackBlocked: 'உலாவி தானாக ஒலிக்க அனுமதிக்கவில்லை. பதிலைக் கேட்க ஒலிபெருக்கி பொத்தானை அழுத்துங்கள்.',
  },
}

const sampleDescriptions = {
  en: 'I am 48 years old and live in a village in Tamil Nadu. I am a small farmer with yearly income around Rs 90,000. I have two children; my daughter is studying and my wife has medical expenses.',
  ta: 'எனக்கு 48 வயது. நான் தமிழ்நாட்டில் ஒரு கிராமத்தில் வசிக்கிறேன். நான் சிறு விவசாயி. என் ஆண்டு வருமானம் சுமார் 90,000 ரூபாய். எனக்கு இரண்டு குழந்தைகள். என் மகள் படிக்கிறாள்; என் மனைவிக்கு மருத்துவச் செலவு உள்ளது.',
}

const tamilSchemeText = {
  'pm-kisan': { name: 'PM-KISAN விவசாயி வருமான உதவி', summary: 'தகுதியுள்ள நிலம் வைத்திருக்கும் விவசாயக் குடும்பங்களுக்கு வருமான உதவி கிடைக்கலாம். விதிவிலக்குகள் மற்றும் விதிகள் பொருந்தும்.', whyMatch: 'நீங்கள் விவசாயம் செய்வதாகச் சொன்னதால், விவசாயி உதவிகளைப் பார்க்கலாம்.', missing: ['விவசாய நிலம் சொந்தமா அல்லது குத்தகையா'], documents: ['ஆதார்', 'நில ஆவணங்கள்', 'வங்கி கணக்கு விவரம்'], next: 'விவசாய அலுவலகம் அல்லது சேவை மையத்தில் தற்போதைய PM-KISAN விதிகளையும் நில ஆவணத் தேவைகளையும் கேளுங்கள்.' },
  pmfby: { name: 'பயிர் காப்பீடு (PMFBY)', summary: 'குறிப்பிட்ட பயிர் மற்றும் பகுதியில், அந்தப் பருவத்தில் பயிர் காப்பீடு கிடைக்கலாம்.', whyMatch: 'நீங்கள் விவசாயம் செய்வதாகச் சொன்னதால், பயிர் காப்பீட்டைப் பார்க்கலாம்.', missing: ['பயிர் மற்றும் தற்போதைய பருவம்', 'உங்கள் மாவட்டம்'], documents: ['பயிர் மற்றும் விதைப்பு விவரம்', 'நிலம் அல்லது குத்தகை ஆவணங்கள்', 'வங்கி கணக்கு விவரம்'], next: 'இந்தப் பருவத்தில் உங்கள் பயிருக்கும் பகுதிக்கும் காப்பீடு உள்ளதா என உள்ளூர் விவசாய அலுவலகம் அல்லது வங்கியில் கேளுங்கள்.' },
  'education-scholarships': { name: 'பள்ளி மற்றும் மேற்படிப்பு உதவித்தொகைகள்', summary: 'சில அரசு உதவித்தொகைகள் தகுதியுள்ள மாணவர்களுக்கு உதவலாம். ஒவ்வொரு திட்டத்திற்கும் விதிகள் வேறுபடும்.', whyMatch: 'உங்கள் குழந்தை படிப்பதாகச் சொன்னதால், மாணவர் உதவித்தொகைகளைப் பார்க்கலாம்.', missing: ['குழந்தையின் வகுப்பு அல்லது படிப்பு நிலை', 'பொருந்தக்கூடிய உதவித்தொகை வகை அல்லது நிபந்தனை (விருப்பம்)'], documents: ['மாணவர் மற்றும் பள்ளி விவரம்', 'வருமானச் சான்று', 'வங்கி விவரம்', 'தேவைப்பட்டால் வகுப்புச் சான்று'], next: 'பள்ளியில் தற்போது உள்ள உதவித்தொகைகள் மற்றும் கடைசி தேதிகளைப் பற்றி கேட்டு, தகுதியை உறுதிப்படுத்துங்கள்.' },
  'healthcare-support': { name: 'அரசு மருத்துவக் காப்பீடு மற்றும் மாநில உதவி', summary: 'குடும்பப் பட்டியல், மாநில விதிகள், சிகிச்சை ஆகியவற்றைப் பொறுத்து மருத்துவ உதவி கிடைக்கலாம்.', whyMatch: 'மருத்துவச் செலவு இருப்பதாகச் சொன்னதால், மருத்துவ உதவியைப் பார்க்கலாம்.', missing: ['அரசு மருத்துவக் காப்பீட்டுப் பட்டியலில் உங்கள் குடும்பம் உள்ளதா', 'தேவையான சிகிச்சை அல்லது மருத்துவ உதவி'], documents: ['குடும்ப அட்டை அல்லது குடும்ப விவரம்', 'அடையாள ஆவணங்கள்', 'மருத்துவமனை அல்லது சிகிச்சை விவரம்'], next: 'சிகிச்சைக்கு முன், மருத்துவமனை உதவி மையம் அல்லது மாநில மருத்துவ உதவி எண்ணில் காப்பீட்டைச் சரிபாருங்கள்.' },
}

const tamilMissingInformation = {
  'Whether you own or lease agricultural land': 'விவசாய நிலம் சொந்தமா அல்லது குத்தகையா',
  'Your crop and current growing season': 'பயிர் மற்றும் தற்போதைய பருவம்',
  'Your district, to check local scheme availability': 'உங்கள் மாவட்டம்',
  'Your child’s current class or education level': 'குழந்தையின் வகுப்பு அல்லது படிப்பு நிலை',
  'Any scholarship category or criteria that may apply (optional to share here)': 'பொருந்தக்கூடிய உதவித்தொகை வகை அல்லது நிபந்தனை (விருப்பம்)',
  'Whether your household appears on the applicable health-coverage list': 'அரசு மருத்துவக் காப்பீட்டுப் பட்டியலில் உங்கள் குடும்பம் உள்ளதா',
  'The treatment or medical support needed': 'தேவையான சிகிச்சை அல்லது மருத்துவ உதவி',
}

const needIcons = {
  farming: Leaf,
  education: GraduationCap,
  healthcare: HeartPulse,
  family: UsersRound,
}

function App() {
  const [language, setLanguage] = useState('en')
  const copy = translations[language]
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)
  const [fallbackReady, setFallbackReady] = useState(false)
  const [fallbackState, setFallbackState] = useState('')
  const recognitionRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => () => {
    recognitionRef.current?.abort()
    recorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  async function reviewSituation(text = description) {
    if (!text.trim()) {
      setError(copy.emptyError)
      return
    }
    setLoading(true)
    setError('')
    try {
      setResult(await findSchemes(text.trim()))
    } catch (requestError) {
      setError(language === 'ta' ? copy.noResult : requestError.message || copy.noResult)
    } finally {
      setLoading(false)
    }
  }

  async function startVoiceRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError(copy.voiceFallbackUnsupported)
      setFallbackReady(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      audioChunksRef.current = []
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        recorderRef.current = null
        setListening(false)
        setFallbackState('transcribing')
        const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (audio.size === 0) {
          setFallbackState('')
          setError(copy.noAudio)
          return
        }
        try {
          const transcript = await transcribeVoice(audio, language)
          if (!transcript.trim()) {
            setError(copy.noAudio)
          } else {
            setDescription((current) => [current.trim(), transcript.trim()].filter(Boolean).join(' '))
            setError('')
          }
        } catch (transcriptionError) {
          setError(transcriptionError.message.includes('not configured') ? copy.voiceNeedsServerKey : transcriptionError.message)
        } finally {
          setFallbackState('')
        }
      }
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        recorderRef.current = null
        setListening(false)
        setFallbackState('')
        setError(copy.voiceRecordingError)
      }
      recorder.start()
      setFallbackReady(false)
      setFallbackState('recording')
      setListening(true)
      setError('')
    } catch (recordingError) {
      setFallbackReady(false)
      setError(recordingError.name === 'NotAllowedError' ? copy.voicePermission : copy.voiceRecordingError)
    }
  }

  function startVoiceInput() {
    if (fallbackState === 'recording') {
      recorderRef.current?.stop()
      return
    }
    if (fallbackState === 'transcribing') return
    if (fallbackReady) {
      void startVoiceRecording()
      return
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError(copy.voiceUnsupported)
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN'
    recognition.continuous = true
    recognition.interimResults = true
    const originalText = description.trim()
    recognition.onstart = () => setListening(true)
    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }
    recognition.onerror = (event) => {
      setListening(false)
      recognitionRef.current = null
      const messages = {
        'not-allowed': copy.voicePermission,
        'service-not-allowed': copy.voicePermission,
        'audio-capture': copy.voicePermission,
        'no-speech': copy.voiceNoSpeech,
        'language-not-supported': copy.voiceLanguage,
      }
      if (event.error === 'network') {
        setFallbackReady(true)
        setError(copy.voiceNetworkFallback)
      } else {
        setFallbackReady(false)
        setError(messages[event.error] || copy.voiceError)
      }
    }
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((item) => item[0].transcript).join(' ')
      setDescription([originalText, transcript].filter(Boolean).join(' '))
      setError('')
    }
    try {
      recognition.start()
      setError('')
    } catch {
      recognitionRef.current = null
      setListening(false)
      setError(copy.voiceError)
    }
  }

  function loadExample() {
    setDescription(sampleDescriptions[language])
    setError('')
  }

  function clearForm() {
    setDescription('')
    setResult(null)
    setError('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Welfare AI home">
          <span className="brand-mark"><AudioLines size={19} strokeWidth={2.2} /></span>
          <span>Welfare <b>AI</b></span>
        </a>
        <div className="topbar-right">
          <span className="prototype-label"><span /> {copy.prototype}</span>
          <label className="language-picker">
            <span className="sr-only">{copy.language}</span>
            <select className="language-button" value={language} onChange={(event) => {
              const nextLanguage = event.target.value
              setLanguage(nextLanguage)
              document.documentElement.lang = nextLanguage === 'ta' ? 'ta' : 'en'
            }} aria-label={copy.language}>
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
        </div>
      </header>

      <section className="workbench" id="top">
        <div className="intro-column">
          <div className="eyebrow"><Sparkles size={14} /> {copy.eyebrow}</div>
          <h1>{copy.title}</h1>
          <p className="intro-copy">{copy.intro}</p>
          <div className="steps" aria-label={copy.how}>
            <div className="step-item"><span className="step-number">01</span><span>{copy.steps[0]}</span></div>
            <span className="step-rule" />
            <div className="step-item"><span className="step-number">02</span><span>{copy.steps[1]}</span></div>
            <span className="step-rule" />
            <div className="step-item"><span className="step-number">03</span><span>{copy.steps[2]}</span></div>
          </div>
          <div className="ecosystem-note">
            <div className="ecosystem-icon"><CircleHelp size={18} /></div>
            <p><strong>{copy.ecosystemTitle}</strong><br />{copy.ecosystem}</p>
          </div>
        </div>

        <section className="intake-panel" aria-labelledby="intake-title">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">{copy.household}</span>
              <h2 id="intake-title">{copy.question}</h2>
            </div>
            <span className="privacy-note"><span className="privacy-dot" /> {copy.noAccount}</span>
          </div>
          <label className="sr-only" htmlFor="situation">{copy.describe}</label>
          <div className="input-wrap">
            <textarea
              id="situation"
              lang={language === 'ta' ? 'ta-IN' : 'en-IN'}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={copy.placeholder}
              maxLength={3000}
              rows={7}
            />
            <div className="input-meta">
              <span>{copy.hint}</span>
              <span>{description.length}/3000</span>
            </div>
          </div>
          <div className="input-actions">
            <button className={`voice-button${listening ? ' is-listening' : ''}`} type="button" onClick={startVoiceInput} aria-label={fallbackState === 'transcribing' ? copy.transcribing : listening ? copy.stopSpeaking : fallbackReady ? copy.recordVoice : copy.speak} aria-pressed={listening} disabled={fallbackState === 'transcribing'}>
              <Mic size={17} /> <span>{fallbackState === 'transcribing' ? copy.transcribing : fallbackState === 'recording' || listening ? copy.stopSpeaking : fallbackReady ? copy.recordVoice : copy.speak}</span>
            </button>
            <button className="example-button" type="button" onClick={loadExample}>{copy.example} <ArrowDownRight size={15} /></button>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="submit-row">
            <span className="gentle-note"><Volume2 size={15} /> {copy.gentle}</span>
            <button className="submit-button" type="button" onClick={() => reviewSituation()} disabled={loading}>
              {loading ? <><LoaderCircle className="spinner" size={17} /> {copy.loading}</> : <>{copy.submit} <ArrowRight size={17} /></>}
            </button>
          </div>
        </section>
      </section>

      <WelfareChat language={language} />

      {result ? (
        <Results result={result} onReset={clearForm} language={language} />
      ) : (
        <section className="quiet-band">
          <div className="quiet-icon"><FileText size={19} /></div>
          <div><strong>{copy.quietTitle}</strong><span>{copy.quietBody}</span></div>
          <span className="band-illustration" aria-hidden="true"><span /><span /><span /><span /><span /></span>
        </section>
      )}

      <footer className="footer">
        <span>Welfare AI <span className="footer-separator">/</span> Hackathon prototype</span>
        <span>{language === 'ta' ? 'முன்மாதிரி தரவு · அரசு தகுதி முடிவு அல்ல' : 'Demo scheme data · Not an official eligibility decision'}</span>
      </footer>
    </main>
  )
}

function WelfareChat({ language }) {
  const copy = translations[language]
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceFallback, setVoiceFallback] = useState(false)
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [voiceReplies, setVoiceReplies] = useState(true)
  const [error, setError] = useState('')
  const messageEndRef = useRef(null)
  const audioRef = useRef(null)
  const recognitionRef = useRef(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => () => {
    recognitionRef.current?.abort()
    recorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    window.speechSynthesis?.cancel()
    audioRef.current?.pause()
    if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src)
  }, [])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, busy])

  async function sendMessage(event) {
    event.preventDefault()
    const message = draft.trim()
    if (!message || busy) return
    const history = messages.map(({ role, content }) => ({ role, content }))
    setMessages((current) => [...current, { role: 'user', content: message }])
    setDraft('')
    setBusy(true)
    setError('')
    try {
      const reply = await askAssistant(message, language, history)
      setMessages((current) => [...current, { role: 'assistant', content: reply }])
      if (voiceReplies) speakReply(reply)
    } catch {
      setError(copy.chatError)
    } finally {
      setBusy(false)
    }
  }

  async function speakReply(content) {
    window.speechSynthesis?.cancel()
    audioRef.current?.pause()
    if (audioRef.current?.src) URL.revokeObjectURL(audioRef.current.src)
    audioRef.current = null

    if (language === 'ta') {
      try {
        const audioBlob = await generateSpokenReply(content, language)
        const audio = new Audio(URL.createObjectURL(audioBlob))
        audioRef.current = audio
        audio.onended = () => {
          URL.revokeObjectURL(audio.src)
          audioRef.current = null
        }
        await audio.play()
        setError('')
        return
      } catch (audioError) {
        const tamilVoice = window.speechSynthesis?.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('ta-'))
        if (audioError.status === 503 && !tamilVoice) {
          setError(copy.nativeTamilUnavailable)
          return
        }
      }
    }

    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError(language === 'ta' ? 'இந்த உலாவியில் குரல் வாசிப்பு இல்லை.' : 'Spoken replies are not available in this browser.')
      return
    }
    const utterance = new SpeechSynthesisUtterance(content)
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN'
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find((item) => item.lang.toLowerCase() === (language === 'ta' ? 'ta-in' : 'en-in'))
      || voices.find((item) => item.lang.toLowerCase().startsWith(language === 'ta' ? 'ta-' : 'en-in'))
    if (language === 'ta' && !voice) {
      setError(copy.nativeTamilUnavailable)
      return
    }
    if (voice) utterance.voice = voice
    utterance.rate = language === 'ta' ? 0.88 : 0.96
    utterance.pitch = 1
    utterance.onstart = () => setError('')
    utterance.onerror = () => setError(copy.speechPlaybackBlocked)
    window.speechSynthesis.speak(utterance)
  }

  async function recordSpokenQuestion() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError(copy.chatVoiceError)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      audioChunksRef.current = []
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size) audioChunksRef.current.push(event.data)
      }
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        recorderRef.current = null
        setRecording(false)
        setError(copy.chatVoiceError)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        recorderRef.current = null
        setRecording(false)
        setTranscribing(true)
        try {
          const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
          const transcript = await transcribeVoice(audio, language)
          if (!transcript.trim()) throw new Error('empty transcription')
          setDraft((current) => [current.trim(), transcript.trim()].filter(Boolean).join(' '))
          setVoiceFallback(false)
          setError('')
        } catch (transcriptionError) {
          setError(transcriptionError.message.includes('not configured') ? copy.chatNeedsKey : copy.chatVoiceError)
        } finally {
          setTranscribing(false)
        }
      }
      recorder.start()
      setRecording(true)
      setVoiceFallback(false)
      setError('')
    } catch {
      setError(copy.chatVoiceError)
    }
  }

  function listenToQuestion() {
    if (recording) {
      recorderRef.current?.stop()
      return
    }
    if (transcribing) return
    if (voiceFallback) {
      void recordSpokenQuestion()
      return
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setError(copy.chatVoiceError)
      return
    }
    const recognition = new Recognition()
    recognitionRef.current = recognition
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.onstart = () => {
      setListening(true)
      setError('')
    }
    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }
    recognition.onerror = (event) => {
      setListening(false)
      recognitionRef.current = null
      if (event.error === 'network') {
        setVoiceFallback(true)
        setError(copy.chatVoiceFallback)
      } else {
        setError(copy.chatVoiceError)
      }
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) setDraft((current) => [current.trim(), transcript.trim()].filter(Boolean).join(' '))
    }
    try {
      recognition.start()
    } catch {
      setListening(false)
      setError(copy.chatVoiceError)
    }
  }

  return (
    <section className="chat-panel" aria-labelledby="chat-title">
      <header className="chat-header">
        <span className="chat-avatar"><MessageCircle size={18} /></span>
        <div className="chat-header-copy"><h2 id="chat-title">{copy.botTitle}</h2><span><i />{copy.botOnline}</span></div>
        <span className="chat-language">{language === 'ta' ? 'தமிழ்' : 'EN'}</span>
        <button className={`chat-sound-toggle${voiceReplies ? ' is-on' : ''}`} type="button" onClick={() => {
          if (voiceReplies) window.speechSynthesis?.cancel()
          setVoiceReplies(!voiceReplies)
        }} aria-label={voiceReplies ? copy.speechOn : copy.speechOff} title={voiceReplies ? copy.speechOn : copy.speechOff} aria-pressed={voiceReplies}>
          {voiceReplies ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </header>
      <div className="chat-messages" aria-live="polite" aria-relevant="additions text">
        <article className="chat-message assistant-message"><p>{copy.chatWelcome}</p></article>
        {messages.map((message, index) => (
          <article className={`chat-message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`} key={`${message.role}-${index}`}>
            <p>{message.content}</p>
            {message.role === 'assistant' && <button className="speak-reply" type="button" onClick={() => speakReply(message.content)} aria-label={copy.chatSpeak} title={copy.chatSpeak}><Volume2 size={15} /></button>}
          </article>
        ))}
        {busy && <article className="chat-message assistant-message chat-typing"><LoaderCircle className="spinner" size={15} />{copy.chatBusy}</article>}
        <div ref={messageEndRef} />
      </div>
      {error && <p className="chat-error" role="alert">{error}</p>}
      <form className="chat-form" onSubmit={sendMessage}>
        <button className={`chat-mic${listening || recording ? ' is-listening' : ''}`} type="button" onClick={listenToQuestion} disabled={busy || transcribing} aria-label={transcribing ? copy.chatTranscribing : recording ? copy.chatStopRecord : voiceFallback ? copy.chatRecord : listening ? copy.chatMic : copy.chatMic} title={transcribing ? copy.chatTranscribing : recording ? copy.chatStopRecord : voiceFallback ? copy.chatRecord : copy.chatMic}><Mic size={17} /></button>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={transcribing ? copy.chatTranscribing : recording || listening ? copy.chatListening : copy.chatPlaceholder} aria-label={copy.chatPlaceholder} maxLength={2000} />
        <button className="chat-send" type="submit" disabled={busy || !draft.trim()} aria-label={copy.chatSend} title={copy.chatSend}>{busy ? <LoaderCircle className="spinner" size={17} /> : <Send size={17} />}</button>
      </form>
      <p className="chat-footnote">{language === 'ta' ? 'முன்மாதிரி தகவல். தகுதியை அரசு சேவையில் உறுதிப்படுத்துங்கள்.' : 'Demo guidance only. Confirm eligibility with an official service.'}</p>
    </section>
  )
}

function Results({ result, onReset, language }) {
  const copy = translations[language]
  const { profile, matches, missingInformation } = result
  const profileFacts = [
    profile.age && `${profile.age} ${copy.years}`,
    profile.location && (language === 'ta' && profile.location === 'Tamil Nadu' ? 'தமிழ்நாடு' : profile.location),
    profile.occupation && (language === 'ta' && profile.farmer ? 'விவசாயி' : profile.occupation),
    profile.annualIncome != null && `₹${Number(profile.annualIncome).toLocaleString('en-IN')} · ${copy.perYear}`,
    profile.children != null && `${profile.children} ${copy.children}`,
  ].filter(Boolean)

  return (
    <section className="results-area" aria-live="polite">
      <div className="results-topline">
        <div><span className="section-kicker">{copy.summary}</span><h2>{copy.resultsTitle}</h2></div>
        <button className="reset-button" type="button" onClick={onReset}><RotateCcw size={15} /> {copy.startOver}</button>
      </div>
      <div className="result-grid">
        <div className="matches-column">
          <div className="profile-strip">
            <div className="profile-icon"><UsersRound size={18} /></div>
            <div><strong>{copy.understood}</strong><div className="fact-list">{profileFacts.length ? profileFacts.map((fact) => <span key={fact}>{fact}</span>) : <span>{copy.moreDetails}</span>}</div></div>
          </div>
          <div className="match-heading"><span>{matches.length} {copy.possibleMatch}</span><span>{copy.demo}</span></div>
          {matches.length ? matches.map((scheme) => {
            const Icon = needIcons[scheme.category] || FileText
            const localized = language === 'ta' ? tamilSchemeText[scheme.id] : null
            const schemeName = localized?.name || scheme.name
            const schemeSummary = localized?.summary || scheme.summary
            const whyMatch = localized?.whyMatch || scheme.whyMatch
            const missing = localized?.missing || scheme.missingInformation
            const documents = localized?.documents || scheme.documents
            const nextAction = localized?.next || scheme.nextAction
            return (
              <article className="scheme-row" key={scheme.id}>
                <div className={`scheme-icon scheme-icon-${scheme.category}`}><Icon size={20} /></div>
                <div className="scheme-content">
                  <div className="scheme-name-line"><h3>{schemeName}</h3><span className="match-badge">{copy.potential}</span></div>
                  <p>{schemeSummary}</p>
                  <div className="reason-line"><Check size={14} /><span>{whyMatch}</span></div>
                  {missing.length > 0 && <p className="scheme-missing"><strong>{copy.confirm}</strong> {missing.join('; ')}</p>}
                  <p className="scheme-documents"><strong>{copy.documents}</strong> {documents.join(', ')}</p>
                  <div className="scheme-next"><ArrowRight size={14} /><span>{nextAction}</span></div>
                </div>
              </article>
            )
          }) : <div className="empty-matches">{copy.noMatches}</div>}
          <p className="dataset-disclaimer">{copy.disclaimer}</p>
        </div>

        <aside className="next-column">
          <div className="next-card">
            <div className="next-card-head"><span className="next-icon"><CircleHelp size={18} /></span><span className="section-kicker">{copy.needDetails}</span></div>
            <h3>{copy.gather}</h3>
            {missingInformation.length ? (
              <ul className="missing-list">{missingInformation.map((item) => <li key={item}><span className="list-bullet" />{language === 'ta' ? (tamilMissingInformation[item] || item) : item}</li>)}</ul>
            ) : <p className="all-set"><Check size={15} /> {copy.allSet}</p>}
            <div className="help-divider" />
            <div className="help-callout"><strong>{copy.needPerson}</strong><p>{copy.csc}</p><a href="https://www.csc.gov.in/" target="_blank" rel="noreferrer">{copy.findCsc} <ArrowRight size={14} /></a></div>
          </div>
          <div className="reasoning-note"><Sparkles size={15} /><p><strong>{copy.how}</strong><br />{copy.howBody}</p></div>
        </aside>
      </div>
    </section>
  )
}

export default App