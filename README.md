# 🇮🇳 Welfare AI Assistant: Bilingual Voice-First Welfare Scheme Finder

> **Tagline:** Bridging the digital divide by helping marginalized citizens in Tamil Nadu and across India discover and apply for government welfare schemes using natural voice in **Tamil** and **English**.

---

## 🚀 Inspiration & Problem Statement
Millions of eligible citizens miss out on life-changing government welfare benefits (such as PM-KISAN, educational stipends, and pensions) due to:
* **Language & Digital Barriers:** Complex English-dominated portals that exclude non-English speakers.
* **Lack of Awareness:** Difficulty in navigating eligibility criteria for numerous central and state schemes.
* **Bureaucratic Friction:** Complicated document verification and application paperwork.

**Welfare AI Assistant** solves this by providing a radically simple, voice-first AI interface supporting **Tamil (தமிழ்)** and **English**, listening to a citizen's spoken story and instantly matching them against welfare databases.

---

## ⚙️ Architecture & Technical Stack

* **Frontend:** React.js / Vite, styled for high accessibility. Uses the browser's native Web Speech API configured for Tamil (`ta-IN`) and English (`en-IN`).
* **Backend:** Node.js & Express REST API server.
* **AI Engine:** OpenAI / LLM integration to extract structured socio-economic tags from unstructured natural speech.
* **Identity Verification Layer:** Simulated DigiLocker OAuth verification workflow tailored for hackathon prototyping.

```text
[ Citizen Voice (Tamil / English) ] 
       │
       ▼ (Web Speech API: ta-IN / en-IN)
[ React Frontend ] ──(POST /api/match-schemes)──> [ Node.js Express Backend ]
                                                          │
                                                (LLM Intent Extraction)
                                                          │
                                                          ▼
                                            [ Scheme Eligibility Engine ]
                                                          │
                                                          ▼
[ Instant Scheme Recommendations ] <──────────────────────┘