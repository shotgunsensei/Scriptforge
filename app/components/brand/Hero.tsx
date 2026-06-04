import Link from "next/link";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#24304A] px-5 py-16 sm:px-8 lg:px-10">
      <CommandRain />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
        <div>
          <Logo />
          <h1 className="mt-8 text-5xl font-semibold tracking-normal text-[#F8FAFC] md:text-6xl">SCRIPTFORGE</h1>
          <p className="mt-4 text-2xl font-semibold text-[#F8FAFC]">Forge Better Automation</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#94A3B8]">
            Free PowerShell scripts, MSP automation, Microsoft 365 tools, security audits, and technician utilities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="border border-[#E53935] bg-[#E53935] px-5 py-3 text-sm font-semibold text-white" href="/scripts">
              Browse Scripts
            </Link>
            <Link className="border border-[#24304A] bg-[#121A2E] px-5 py-3 text-sm font-semibold text-[#F8FAFC]" href="/community/submit">
              Submit Script
            </Link>
          </div>
        </div>
        <div className="border border-[#24304A] bg-[#121A2E] p-5">
          <svg aria-label="ScriptForge connected automation visualization" className="h-[360px] w-full" viewBox="0 0 520 360">
            <g fill="none" stroke="#24304A" strokeWidth="2">
              <path d="M260 180 130 70M260 180 120 180M260 180 135 290M260 180 390 92M260 180 404 264" />
            </g>
            <g stroke="#5E81F4" strokeWidth="3">
              <path d="M260 180 130 70" opacity=".65" />
              <path d="M260 180 120 180" opacity=".65" />
              <path d="M260 180 135 290" opacity=".65" />
              <path d="M260 180 390 92" opacity=".65" />
              <path d="M260 180 404 264" opacity=".65" />
            </g>
            <Node x={260} y={180} label="ScriptForge" primary />
            <Node x={130} y={70} label="M365" />
            <Node x={120} y={180} label="AD" />
            <Node x={135} y={290} label="Datto" />
            <Node x={390} y={92} label="Security" />
            <Node x={404} y={264} label="RMM" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function Node({ x, y, label, primary = false }: { x: number; y: number; label: string; primary?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} fill={primary ? "#E53935" : "#0B1020"} r={primary ? 54 : 42} stroke={primary ? "#F8FAFC" : "#5E81F4"} strokeWidth="3" />
      <text fill="#F8FAFC" fontFamily="Inter, Arial" fontSize={primary ? "18" : "15"} fontWeight="700" textAnchor="middle" x={x} y={y + 5}>
        {label}
      </text>
    </g>
  );
}

function CommandRain() {
  const commands = ["Get-ADUser", "Get-Mailbox", "Get-MgUser", "Get-ChildItem"];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-[0.06]">
      <div className="grid grid-cols-4 gap-10 text-sm font-mono leading-10 text-[#F8FAFC]">
        {Array.from({ length: 40 }, (_, index) => (
          <span key={index}>{commands[index % commands.length]}</span>
        ))}
      </div>
    </div>
  );
}
