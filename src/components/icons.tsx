
import type { SVGProps } from "react";
import {
  BrainCircuit,
  ListChecks,
  Target,
  Megaphone,
  Handshake,
  Heart,
  Wallet,
  Bot,
  Zap,
  BarChart,
  RefreshCw,
  Shield,
  Headset,
  Send,
  ChevronRight,
  Menu,
  X,
  Plus,
  Minus,
  ArrowRight,
  Copy,
  Check,
  Gift,
  UploadCloud,
  Calculator,
  Sparkles
} from 'lucide-react';

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.356-11.303-8H6.393c3.56,8.32,12.034,14,21.607,14L24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.336,44,30.603,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      aria-label="V4SalesAI logo"
      width="32"
      height="32"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M60 0L120 60L60 120L0 60L60 0Z" fill="hsl(var(--primary))" />
      <path
        d="M60 10L110 60L60 110L10 60L60 10Z"
        fill="hsl(var(--background))"
      />
      <path
        d="M75.5999 47.7L60 31.5L44.3999 47.7L60 63.9L75.5999 47.7ZM60 92V67.5"
        stroke="hsl(var(--primary))"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  google: GoogleIcon,
  brain: BrainCircuit,
  listChecks: ListChecks,
  target: Target,
  megaphone: Megaphone,
  handshake: Handshake,
  heart: Heart,
  wallet: Wallet,
  bot: Bot,
  zap: Zap,
  barChart: BarChart,
  refresh: RefreshCw,
  shield: Shield,
  headset: Headset,
  send: Send,
  chevronRight: ChevronRight,
  menu: Menu,
  close: X,
  plus: Plus,
  minus: Minus,
  arrowRight: ArrowRight,
  copy: Copy,
  check: Check,
  gift: Gift,
  uploadCloud: UploadCloud,
  calculator: Calculator,
  sparkles: Sparkles,
};
