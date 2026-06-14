# AssessCraft — Free IT Exam Simulation Platform

Unlimited mock tests with dynamically generated questions for TCS, Infosys, Cognizant, Wipro, Accenture, and Capgemini assessments.

## Features

- **Dynamic Question Generation** — Every attempt produces unique questions with randomized values
- **6 Company Modules** — TCS, Infosys, Cognizant, Wipro, Accenture, Capgemini
- **Real Exam Simulation** — Timer, tab-switch detection, question navigation
- **Performance Dashboard** — Track accuracy, scores, and error patterns
- **Readiness Index** — See how prepared you are for each company's assessment

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** for animations
- **localStorage** for data persistence

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd assesscraft

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers (auth)
├── data/           # Company data and configuration
├── hooks/          # Custom React hooks
├── lib/            # Utilities (question generator, storage)
├── pages/          # Route pages
└── test/           # Test files
```

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start development server       |
| `npm run build`  | Build for production            |
| `npm run preview`| Preview production build        |
| `npm run test`   | Run tests                       |
| `npm run lint`   | Lint the codebase               |

## License

MIT
