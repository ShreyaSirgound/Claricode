# Claricode

> 🏆 Best Use of Gemini API — EmberHacks 2025

An AI-powered web app that transforms lecture files and code into 
structured, editable lessons with definitions, examples, and visuals.

**[→ Try the live app](https://claricode.netlify.app/)** · [Devpost](https://devpost.com/software/claricode)

<div align="center">
  <img src="/demo.gif" width="700" alt="Claricode demo"/>
</div>

---

## the problem
CS lectures move fast and material ends up scattered across slides, 
PDFs, and live code. Claricode consolidates everything into one 
structured, reviewable lesson.

## key features
- **Structured lessons** — definitions, annotated code snippets, examples auto-generated from your files
- **Embedded AI assistant** — ask questions without losing your place in the lesson
- **Inline note-taking + highlighting** — personalize generated content
- **Text-to-speech** — audio playback for hands-free or auditory learning
- **PDF export** — download your annotated lesson with highlights preserved
- **Accessibility themes** — designed with diverse learning needs in mind

## tech stack
| Layer | Tools |
|---|---|
| Frontend | React · TypeScript · Vite · Tailwind CSS |
| AI | Google Gemini API |
| Export | jsPDF |
| Deploy | Netlify |

## key decisions
**Embedded chatbot** — instead of a separate chat interface, the AI assistant 
sits beside lesson content so students never lose context while asking questions.

**Client-side PDF export** — avoids backend complexity while still delivering 
meaningful value within a 24-hour hackathon constraint.

**Component-based architecture** — lessons and chatbot are reusable components, 
keeping the codebase maintainable as features evolved under time pressure.

## run locally
```bash
git clone https://github.com/ShreyaSirgound/Claricode
cd Claricode
npm install
npm run dev
```
Add your Gemini API key to a `.env` file:
```
VITE_GEMINI_API_KEY=your_key_here
```

## built by
[Shreya Sirgound](https://github.com/ShreyaSirgound) + [Rhea Paste](https://github.com/RheaPaste1) · Oct 2025 · 24 hours
