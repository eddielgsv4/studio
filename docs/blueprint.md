# **App Name**: V4_SalesAI

## Core Features:

- Landing Page UI: Display a comprehensive landing page built with Next.js, Shadcn/UI, and Tailwind CSS, incorporating all specified components.
- Component Structure: Organize the landing page into reusable components within the `src/components/landing` directory, including About, ChatLite, Copilot, DiagnosisSection, Ecosystem, Faq, FinalCta, Footer, Gift, Header, Hero, Journey, Partners, Pricing, and StatBar.
- Main Page Layout: Construct the main application page (`src/app/page.tsx`) to import and arrange the landing page components.
- AI Insights: Generate tailored sales insights based on user inputs and data analysis using AI models.
- AI Diagnostic Tool: Provide an AI-driven diagnostic tool to identify sales bottlenecks and opportunities. The tool will analyze user responses in DiagnosisSection.tsx.
- Diagnostic Context: Set up DiagnosticProvider context that will persist diagnostic choices, and any output of an AI-driven diagnosis.

## Style Guidelines:

- Primary color: Dark grey (#121212), creates a sleek and sophisticated look.
- Secondary color: Red (#dc3545), for important interactive elements and calls to action.
- Text Color: White (#FFFFFF), ensures maximum readability against the dark background.
- Headline Font: 'Bebas Neue' sans-serif, for a modern, bold, and impactful feel, based on visual analysis of the provided image.
- Body Font: 'Inter' sans-serif, a neutral font which will complement 'Space Grotesk' if longer blocks of text are added.
- Ensure a responsive layout that adapts to different screen sizes for optimal viewing on desktops, tablets, and mobile devices.
- Use clean, modern icons to represent various features and benefits of the sales AI, aligning with the tech-forward aesthetic.