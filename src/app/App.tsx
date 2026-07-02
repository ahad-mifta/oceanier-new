import { useState, useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Navigation2, BarChart3, MessageSquare, BookOpen, Cpu, Settings,
  ArrowRight, Menu, X, ChevronDown, Clock, Mail, ExternalLink,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { Analytics } from "@vercel/analytics/react";
import darkLogo from "../imports/Dark_BG-1.png";
import emailLogo from "../imports/Dark_BG-2.png";

// ─── Email Config ─────────────────────────────────────────────────────────────
// Set these in a .env file at project root:
//   VITE_EMAILJS_PUBLIC_KEY=your_public_key
//   VITE_EMAILJS_SERVICE_ID=your_service_id
//   VITE_EMAILJS_TEMPLATE_CLIENT=your_client_template_id
//   VITE_EMAILJS_TEMPLATE_INTERNAL=your_internal_template_id
//
// EmailJS templates use subject + {{{html_content}}} as body (raw HTML mode).
// Client template: To = {{to_email}}, Subject = ⚓ Welcome Aboard!
// Internal template: To = your team email, Subject = 🚀 New Lead: {{company}}

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_CLIENT = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENT ?? "";
const EMAILJS_TEMPLATE_INTERNAL = import.meta.env.VITE_EMAILJS_TEMPLATE_INTERNAL ?? "";

// Use a publicly hosted URL for the email logo so it can be viewed by email clients.
const EMAIL_LOGO_URL = "https://i.imgur.com/NV40umI.png";

type FormParams = { name: string; company: string; email: string; message: string };

// ─── Client Email HTML ────────────────────────────────────────────────────────

function generateClientEmail(p: FormParams, logoUrl = ""): string {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Welcome Aboard | Oceanier</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F4F6;">
<tr><td align="center" style="padding:48px 16px 48px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background-color:#FFFFFF;border-radius:12px 12px 0 0;padding:32px 40px 28px;text-align:center;border-bottom:1px solid #E5E7EB;">
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-bottom:16px;">
      ${logoUrl
        ? `<img src="${logoUrl}" alt="Oceanier" width="200" height="auto" style="display:block;margin:0 auto;width:200px;max-width:200px;height:auto;border:0;outline:none;text-decoration:none;" />`
        : `<div style="font-size:20px;font-weight:700;color:#111827;letter-spacing:3px;">OCEANIER</div>`
      }
      <div style="margin-top:10px;font-size:9px;color:#3AA8FF;letter-spacing:4px;font-weight:500;text-transform:uppercase;">Navigate Business with AI</div>
    </td></tr>
    </table>
    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(58,168,255,0.3),transparent);"></div>
  </td></tr>

  <!-- HERO -->
  <tr><td style="background-color:#FFFFFF;padding:40px 40px 28px;">
    <h1 style="font-size:36px;font-weight:700;color:#111827;margin:0 0 20px;line-height:1.1;letter-spacing:-0.5px;">Welcome Aboard.</h1>
    <p style="font-size:16px;color:#374151;margin:0 0 8px;line-height:1.6;">Hi <strong>${p.name}</strong>,</p>
    <p style="font-size:16px;color:#6B7280;margin:0 0 12px;line-height:1.7;">Thank you for reaching out to Oceanier.</p>
    <p style="font-size:16px;color:#6B7280;margin:0 0 12px;line-height:1.7;">We've successfully received your request and our strategy team has already started reviewing your business requirements.</p>
    <p style="font-size:16px;color:#6B7280;margin:0;line-height:1.7;">We're excited to learn more about <strong style="color:#374151;">${p.company}</strong> and explore how AI can simplify operations, reduce costs, and help your team focus on what matters most.</p>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="background-color:#FFFFFF;padding:0 40px;">
    <div style="height:1px;background-color:#E5E7EB;"></div>
  </td></tr>

  <!-- SUBMITTED INFO -->
  <tr><td style="background-color:#FFFFFF;padding:28px 40px;">
    <p style="font-size:13px;font-weight:600;color:#3AA8FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Submitted Information</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
      ${[
        ["Your Name", p.name],
        ["Company", p.company],
        ["Email Address", p.email],
        ["What Can We Automate?", p.message || "Not specified"],
      ].map(([label, value], i, arr) => `
      <tr>
        <td style="padding:14px 20px;border-bottom:${i < arr.length - 1 ? "1px solid #E5E7EB" : "none"};">
          <div style="font-size:11px;color:#6B7280;letter-spacing:2px;text-transform:uppercase;margin-bottom:5px;">${label}</div>
          <div style="font-size:15px;color:#1F2937;font-weight:500;line-height:1.5;">${value}</div>
        </td>
      </tr>`).join("")}
    </table>
  </td></tr>

  <!-- WHAT HAPPENS NEXT -->
  <tr><td style="background-color:#FFFFFF;padding:0 40px 28px;">
    <p style="font-size:13px;font-weight:600;color:#3AA8FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">What Happens Next?</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ["01", "Our team carefully reviews your request."],
        ["02", "We identify automation opportunities within your business."],
        ["03", "One of our AI consultants will contact you within 24 business hours."],
        ["04", "Together, we'll create a custom AI solution tailored to your business goals."],
      ].map(([n, text]) => `
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;">
        <tr>
          <td style="padding:14px 16px;width:44px;vertical-align:top;">
            <div style="width:30px;height:30px;background:rgba(174,236,1,0.1);border:1px solid rgba(174,236,1,0.25);border-radius:8px;text-align:center;line-height:30px;font-size:12px;font-weight:700;color:#AEEC01;">${n}</div>
          </td>
          <td style="padding:14px 16px 14px 0;vertical-align:middle;">
            <p style="font-size:14px;color:#4B5563;margin:0;line-height:1.5;">${text}</p>
          </td>
        </tr>
        </table>
      </td></tr>`).join("")}
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="background-color:#FFFFFF;padding:0 40px 36px;text-align:center;">
    <table cellpadding="0" cellspacing="0" align="center">
    <tr>
      <td style="padding-right:12px;">
        <a href="https://oceanier.com" style="display:inline-block;background:#AEEC01;color:#010D18;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:100px;letter-spacing:0.3px;">Visit Oceanier</a>
      </td>
      <td>
        <a href="https://oceanier.com/#solutions" style="display:inline-block;background:transparent;color:#3AA8FF;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:100px;border:1px solid rgba(58,168,255,0.35);">Learn About Our AI Solutions</a>
      </td>
    </tr>
    </table>
  </td></tr>

  <!-- BRAND MESSAGE -->
  <tr><td style="background-color:#F9FAFB;padding:28px 40px;border-top:1px solid #E5E7EB;">
    <p style="font-size:14px;color:#AEEC01;margin:0 0 10px;font-weight:600;">&#9875; The journey toward a smarter business starts here.</p>
    <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.7;">Oceanier helps startups and growing businesses navigate AI with confidence — building intelligent systems that save time, reduce costs, and scale alongside your team.</p>
  </td></tr>

  <!-- REPLY INVITE -->
  <tr><td style="background-color:#F9FAFB;padding:0 40px 28px;">
    <div style="background-color:#FFFFFF;border-radius:10px;padding:16px 20px;border:1px solid #E5E7EB;">
      <p style="font-size:13px;color:#6B7280;margin:0;line-height:1.6;">Need to add more information before we reach out? <strong style="color:#374151;">Simply reply to this email</strong> — we'd love to hear from you.</p>
    </div>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background-color:#FFFFFF;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
    ${logoUrl
      ? `<img src="${logoUrl}" alt="Oceanier" width="150" height="auto" style="display:block;margin:0 auto 10px;width:150px;max-width:150px;height:auto;border:0;outline:none;text-decoration:none;" />`
      : `<p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 4px;letter-spacing:2px;">OCEANIER</p>`
    }
    <p style="font-size:12px;color:#6B7280;margin:0 0 14px;">Building AI Workforces for Modern Businesses</p>
    <table cellpadding="0" cellspacing="0" align="center"><tr>
      <td style="padding:0 12px;"><a href="mailto:contact@oceanier.com" style="font-size:12px;color:#3AA8FF;text-decoration:none;">contact@oceanier.com</a></td>
      <td style="padding:0 12px;"><a href="https://oceanier.com" style="font-size:12px;color:#3AA8FF;text-decoration:none;">www.oceanier.com</a></td>
    </tr></table>
    <p style="font-size:11px;color:#9CA3AF;margin:14px 0 0;">© ${new Date().getFullYear()} Oceanier. All rights reserved.</p>
    <p style="font-size:10px;color:#9CA3AF;margin:6px 0 0;">Submitted on ${date}</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Internal Email HTML ──────────────────────────────────────────────────────

function generateInternalEmail(p: FormParams, logoUrl = ""): string {
  const date = new Date().toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>New Lead | Oceanier Internal</title>
</head>
<body style="margin:0;padding:0;background-color:#06070A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#06070A;">
<tr><td align="center" style="padding:48px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background-color:#0C1018;border-radius:16px 16px 0 0;padding:32px 40px 28px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-bottom:14px;">
      ${logoUrl
        ? `<img src="${logoUrl}" alt="Oceanier" width="200" height="auto" style="display:block;margin:0 auto;width:200px;max-width:200px;height:auto;border:0;outline:none;text-decoration:none;" />`
        : `<div style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:3px;">OCEANIER</div>`
      }
      <div style="margin-top:10px;font-size:9px;color:#3AA8FF;letter-spacing:4px;font-weight:500;text-transform:uppercase;">Internal Notification</div>
    </td></tr>
    </table>
    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(58,168,255,0.3),transparent);"></div>
    <!-- NEW LEAD BADGE -->
    <div style="margin-top:20px;display:inline-block;background:rgba(174,236,1,0.1);border:1px solid rgba(174,236,1,0.3);border-radius:100px;padding:6px 18px;">
      <span style="font-size:11px;font-weight:700;color:#AEEC01;letter-spacing:3px;">&#128640; NEW LEAD RECEIVED</span>
    </div>
  </td></tr>

  <!-- HERO -->
  <tr><td style="background-color:#0C1018;padding:36px 40px 24px;">
    <h1 style="font-size:28px;font-weight:700;color:#FFFFFF;margin:0 0 10px;line-height:1.2;">A New Business Wants to Start Their AI Journey</h1>
    <p style="font-size:15px;color:#8AAFC4;margin:0 0 6px;line-height:1.6;">A visitor has submitted the "Start the Journey" form on the Oceanier website.</p>
    <div style="margin-top:14px;background:#141B25;border-radius:8px;padding:10px 14px;display:inline-block;border:1px solid rgba(58,168,255,0.15);">
      <span style="font-size:11px;color:#5C8BAD;letter-spacing:2px;text-transform:uppercase;">Submission Time&nbsp;&nbsp;</span>
      <span style="font-size:13px;color:#3AA8FF;font-weight:600;">${date}</span>
    </div>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="background-color:#0C1018;padding:0 40px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>

  <!-- CONTACT TABLE -->
  <tr><td style="background-color:#0C1018;padding:24px 40px;">
    <p style="font-size:13px;font-weight:600;color:#3AA8FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px;">Contact Information</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#141B25;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">
      <tr style="background:rgba(58,168,255,0.06);">
        <td style="padding:11px 20px;font-size:11px;font-weight:600;color:#3AA8FF;letter-spacing:2px;text-transform:uppercase;width:38%;border-bottom:1px solid rgba(255,255,255,0.05);">Field</td>
        <td style="padding:11px 20px;font-size:11px;font-weight:600;color:#3AA8FF;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.05);">Value</td>
      </tr>
      ${[
        ["Name", p.name],
        ["Company", p.company],
        ["Email", p.email],
      ].map(([label, value], i, arr) => `
      <tr>
        <td style="padding:13px 20px;font-size:13px;color:#5C8BAD;font-weight:500;border-bottom:${i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"};">${label}</td>
        <td style="padding:13px 20px;font-size:14px;color:#D8EAF5;font-weight:600;border-bottom:${i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"};">${value}</td>
      </tr>`).join("")}
    </table>
  </td></tr>

  <!-- AUTOMATION REQUEST -->
  <tr><td style="background-color:#0C1018;padding:0 40px 24px;">
    <p style="font-size:13px;font-weight:600;color:#3AA8FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px;">Automation Request</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(174,236,1,0.05);border:1px solid rgba(174,236,1,0.18);border-radius:12px;">
    <tr><td style="padding:20px 24px;">
      <p style="font-size:12px;color:#AEEC01;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px;font-weight:600;">What Can We Automate?</p>
      <p style="font-size:15px;color:#D8EAF5;margin:0;line-height:1.7;">${p.message || "No details provided."}</p>
    </td></tr>
    </table>
  </td></tr>

  <!-- QUICK ACTIONS -->
  <tr><td style="background-color:#0C1018;padding:0 40px 28px;">
    <p style="font-size:13px;font-weight:600;color:#3AA8FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px;">Quick Actions</p>
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="padding-right:8px;">
        <a href="mailto:${p.email}" style="display:block;background:#AEEC01;color:#010D18;font-size:13px;font-weight:700;text-decoration:none;padding:12px 16px;border-radius:10px;text-align:center;letter-spacing:0.3px;">Reply to Client</a>
      </td>
      <td style="padding-right:8px;">
        <a href="https://cal.com" style="display:block;background:#141B25;border:1px solid rgba(58,168,255,0.25);color:#3AA8FF;font-size:13px;font-weight:600;text-decoration:none;padding:12px 16px;border-radius:10px;text-align:center;">Schedule Call</a>
      </td>
      <td>
        <a href="https://crm.example.com" style="display:block;background:#141B25;border:1px solid rgba(255,255,255,0.08);color:#8AAFC4;font-size:13px;font-weight:600;text-decoration:none;padding:12px 16px;border-radius:10px;text-align:center;">Add to CRM</a>
      </td>
    </tr></table>
  </td></tr>

  <!-- SUGGESTED NEXT STEP -->
  <tr><td style="background-color:#0A0F16;padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
    <div style="background:#0D1520;border-radius:10px;padding:16px 20px;border-left:3px solid #AEEC01;">
      <p style="font-size:12px;color:#AEEC01;letter-spacing:2px;text-transform:uppercase;font-weight:600;margin:0 0 8px;">Suggested Next Step</p>
      <p style="font-size:14px;color:#A0C4DB;margin:0;line-height:1.6;">Review the client's automation request and respond within <strong style="color:#D8EAF5;">24 business hours</strong> to maintain Oceanier's premium customer experience.</p>
    </div>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background-color:#080C12;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
    <p style="font-size:12px;font-weight:600;color:#374555;margin:0 0 4px;letter-spacing:1px;">OCEANIER INTERNAL NOTIFICATION</p>
    <p style="font-size:11px;color:#2A3540;margin:0;">This email was generated automatically from the Oceanier website. Please do not reply to this message.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Send Emails ──────────────────────────────────────────────────────────────

async function sendEmails(p: FormParams, logoUrl = ""): Promise<void> {
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
    await new Promise((r) => setTimeout(r, 1400));
    return;
  }

  const clientParams = {
    to_email: p.email,
    to_name: p.name,
    company: p.company,
    html_content: generateClientEmail(p, logoUrl),
  };

  const internalParams = {
    company: p.company,
    name: p.name,
    email: p.email,
    message: p.message,
    html_content: generateInternalEmail(p, logoUrl),
  };

  await Promise.all([
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CLIENT, clientParams, EMAILJS_PUBLIC_KEY),
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INTERNAL, internalParams, EMAILJS_PUBLIC_KEY),
  ]);
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020C16]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 blur-3xl scale-[2] bg-[#AEEC01]/8 rounded-full" />
        <motion.img
          src={darkLogo}
          alt="Oceanier"
          className="relative w-44 h-auto"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <div className="mt-10 w-44 h-px bg-[#AEEC01]/15 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#AEEC01]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />
        </div>
        <motion.p
          className="mt-4 font-mono text-[10px] tracking-widest text-[#AEEC01]/40 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Charting Course
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Scroll Progress ──────────────────────────────────────────────────────────

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(dh > 0 ? window.scrollY / dh : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-px bg-white/5 pointer-events-none">
      <div
        className="h-full bg-[#AEEC01] origin-left transition-none"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2"
        style={{ left: `${progress * 100}%` }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#AEEC01] opacity-80" />
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const links = ["Solutions", "Process", "Voyages", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#020C16]/92 backdrop-blur-2xl" : "bg-transparent"
      }`}
    >
      {/* Wave underline */}
      <div
        className={`absolute bottom-0 left-0 right-0 overflow-hidden transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: "2px" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 2" preserveAspectRatio="none">
          <motion.path
            d="M0,1 C240,2 480,0 720,1 C960,2 1200,0 1440,1"
            stroke="#AEEC01"
            strokeWidth="0.6"
            strokeOpacity="0.35"
            fill="none"
            strokeDasharray="12 6"
            animate={{ strokeDashoffset: [0, -36] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#">
            <img src={darkLogo} alt="Oceanier" className="h-7 w-auto" />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-sm text-[#7A9DB8] hover:text-[#D8EAF5] transition-colors duration-200 tracking-wide"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full border border-[#AEEC01]/30 text-[#AEEC01] overflow-hidden transition-all duration-300 hover:border-[#AEEC01] hover:shadow-md hover:shadow-[#AEEC01]/10"
            >
              <span className="absolute inset-0 bg-[#AEEC01]/6 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <span className="relative">Start the Journey</span>
              <ArrowRight size={13} className="relative group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            className="lg:hidden text-[#D8EAF5] p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#020C16]/96 backdrop-blur-2xl border-b border-[#AEEC01]/10"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-base text-[#A0C4DB] hover:text-[#AEEC01] transition-colors"
                >
                  {l}
                </a>
              ))}
              <a
                href="#contact"
                className="text-sm font-semibold px-5 py-3 rounded-full border border-[#AEEC01]/30 text-[#AEEC01] text-center"
              >
                Start the Journey
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Ocean Background ─────────────────────────────────────────────────────────

function OceanBackground({ mx, my }: { mx: number; my: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020C16] via-[#021018] to-[#010810]" />

      {/* Subtle light rays */}
      <div
        className="absolute top-0 left-1/2 w-[700px] h-[450px] opacity-[0.05]"
        style={{
          background:
            "conic-gradient(from 175deg at 50% 0%, transparent 55deg, rgba(174,236,1,0.7) 85deg, transparent 115deg, transparent 235deg, rgba(30,100,180,0.5) 265deg, transparent 295deg)",
          transform: `translateX(calc(-50% + ${mx * -25}px))`,
          transition: "transform 0.2s ease-out",
        }}
      />

      {/* Nautical contour rings — barely visible */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        preserveAspectRatio="xMidYMid slice"
      >
        {[90, 200, 340, 510, 720].map((r, i) => (
          <ellipse
            key={i}
            cx="50%"
            cy="38%"
            rx={`${28 + i * 9}%`}
            ry={r / 10 + "%"}
            fill="none"
            stroke="#AEEC01"
            strokeWidth="0.7"
          />
        ))}
        {[130, 260, 420, 600].map((r, i) => (
          <ellipse
            key={i + 5}
            cx="50%"
            cy="38%"
            rx={`${22 + i * 8}%`}
            ry={r / 10 + "%"}
            fill="none"
            stroke="#4A9ECC"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Very subtle water surface wave */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "35%" }}
        viewBox="0 0 1800 220"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#041830" stopOpacity="0" />
            <stop offset="100%" stopColor="#030F1C" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#wg)"
          animate={{
            d: [
              "M0,80 C300,55 600,105 900,80 C1200,55 1500,105 1800,80 L1800,220 L0,220 Z",
              "M0,95 C300,70 600,95 900,65 C1200,95 1500,70 1800,95 L1800,220 L0,220 Z",
              "M0,80 C300,55 600,105 900,80 C1200,55 1500,105 1800,80 L1800,220 L0,220 Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating micro-particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#AEEC01]"
          style={{
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            left: `${((i * 7.3 + 4) % 92) + 4}%`,
            top: `${((i * 11.7 + 8) % 75) + 8}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Ship Silhouette ──────────────────────────────────────────────────────────

function ShipSilhouette() {
  return (
    <svg
      viewBox="0 0 420 200"
      className="absolute right-[3%] top-1/2 -translate-y-[55%] w-[38%] lg:w-[32%] pointer-events-none"
      style={{ opacity: 0.03 }}
      fill="#A8C8E0"
    >
      <path d="M35,150 L385,150 L360,165 L60,165 Z" />
      <path d="M130,150 L130,55 L210,22 L210,150 Z" />
      <path d="M210,150 L210,45 L285,75 L285,150 Z" />
      <path d="M90,150 L90,80 L130,55 L130,150 Z" />
      <path d="M65,150 L65,105 L90,85 L90,150 Z" />
      <line x1="130" y1="55" x2="90" y2="80" stroke="#A8C8E0" strokeWidth="1" />
      <line x1="210" y1="22" x2="285" y2="75" stroke="#A8C8E0" strokeWidth="1" />
      <line x1="210" y1="45" x2="130" y2="60" stroke="#A8C8E0" strokeWidth="0.7" />
    </svg>
  );
}

// ─── Floating Navigation Elements ─────────────────────────────────────────────

function FloatingNavElements({ mx, my }: { mx: number; my: number }) {
  return (
    <>
      {/* Compass rose */}
      <motion.div
        className="absolute top-28 right-[6%] lg:top-36 lg:right-[10%] opacity-[0.16] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        style={{
          transform: `rotate(var(--r, 0deg)) translate(${mx * 14}px, ${my * 9}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="#AEEC01" strokeWidth="0.7">
          <circle cx="32" cy="32" r="29" strokeOpacity="0.45" />
          <circle cx="32" cy="32" r="2.5" fill="#AEEC01" stroke="none" />
          <line x1="32" y1="5" x2="32" y2="59" strokeOpacity="0.25" />
          <line x1="5" y1="32" x2="59" y2="32" strokeOpacity="0.25" />
          <polygon points="32,5 29,20 32,16 35,20" fill="#AEEC01" stroke="none" />
          <polygon points="32,59 29,44 32,48 35,44" fill="#AEEC01" stroke="none" strokeOpacity="0.4" />
          <text x="32" y="10" textAnchor="middle" fontSize="4.5" fill="#AEEC01" stroke="none" fontFamily="JetBrains Mono">N</text>
          <text x="32" y="58" textAnchor="middle" fontSize="4.5" fill="#AEEC01" stroke="none" fontFamily="JetBrains Mono" opacity="0.5">S</text>
          <text x="57" y="33.5" textAnchor="middle" fontSize="4.5" fill="#AEEC01" stroke="none" fontFamily="JetBrains Mono" opacity="0.5">E</text>
          <text x="7" y="33.5" textAnchor="middle" fontSize="4.5" fill="#AEEC01" stroke="none" fontFamily="JetBrains Mono" opacity="0.5">W</text>
        </svg>
      </motion.div>

      {/* Coordinate readout */}
      <div
        className="absolute top-1/2 left-[4%] -translate-y-1/2 font-mono text-[9px] text-[#AEEC01]/25 space-y-0.5 pointer-events-none hidden lg:block"
        style={{
          transform: `translateY(-50%) translate(${mx * -10}px, ${my * -7}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div>LAT 48.2109°N</div>
        <div>LON 011.6072°E</div>
        <div className="mt-1.5 border-t border-[#AEEC01]/10 pt-1.5">DEPTH ∞</div>
        <div>STATUS: UNDERWAY</div>
      </div>

      {/* Route markers */}
      {[
        { top: "28%", left: "32%" },
        { top: "62%", left: "28%" },
        { top: "42%", left: "68%" },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 pointer-events-none"
          style={{ top: pos.top, left: pos.left }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.9, ease: "easeInOut" }}
        >
          <div className="w-1.5 h-1.5 rounded-full border border-[#AEEC01]/50" />
        </motion.div>
      ))}

      {/* Route dashed lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]">
        <line x1="32%" y1="28%" x2="28%" y2="62%" stroke="#AEEC01" strokeWidth="0.6" strokeDasharray="5 9" />
        <line x1="28%" y1="62%" x2="68%" y2="42%" stroke="#AEEC01" strokeWidth="0.6" strokeDasharray="5 9" />
      </svg>
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function FloatingDashboard({ mx, my }: { mx: number; my: number }) {
  return (
    <div
      className="relative w-full max-w-[22rem]"
      style={{
        transform: `perspective(1100px) rotateY(-6deg) rotateX(3deg) translate(${mx * -14}px, ${my * -9}px)`,
        transition: "transform 0.18s ease-out",
      }}
    >
      {/* Water reflection */}
      <div className="absolute -bottom-3 left-6 right-6 h-1/2 rounded-2xl blur-2xl bg-[#AEEC01]/6 opacity-50" />

      {/* Main glass panel */}
      <div className="relative rounded-2xl border border-[#AEEC01]/14 bg-[#050F1E]/82 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-black/70">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#AEEC01]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-mono text-[10px] text-[#AEEC01]/75 tracking-widest">
              AI NAVIGATION CONSOLE
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#AEEC01]/25" />
            <div className="w-2 h-2 rounded-full bg-[#4A9ECC]/25" />
            <div className="w-2 h-2 rounded-full bg-white/15" />
          </div>
        </div>

        {/* Metric tiles */}
        <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
          {[
            { label: "Tickets", value: "12,847", delta: "+23%" },
            { label: "Response", value: "0.8s", delta: "-91%" },
            { label: "CSAT", value: "4.9/5", delta: "+0.4" },
          ].map((m, i) => (
            <div key={i} className="px-3 py-2.5 bg-[#030E1A]/80">
              <div className="font-mono text-[9px] text-[#5C8BAD] mb-1 truncate">{m.label}</div>
              <div className="text-sm font-semibold text-[#D8EAF5]">{m.value}</div>
              <div className="font-mono text-[9px] text-[#AEEC01] mt-0.5">{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Chat thread */}
        <div className="p-4 space-y-3">
          {/* AI bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#0A2240] border border-[#AEEC01]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[7px] text-[#AEEC01] font-mono font-bold">AI</span>
            </div>
            <div className="flex-1 rounded-xl rounded-tl-none bg-[#0A2240] border border-[#4A9ECC]/10 px-3 py-2">
              <p className="text-[11px] text-[#A0C4DB] leading-relaxed">
                Hello! I can help you track your order. Could you share your order ID?
              </p>
            </div>
          </div>

          {/* User bubble */}
          <div className="flex items-start gap-2.5 flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-[#AEEC01]/15 border border-[#AEEC01]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[7px] text-[#D8EAF5] font-mono">U</span>
            </div>
            <div className="max-w-[68%] rounded-xl rounded-tr-none bg-[#051C35] border border-white/5 px-3 py-2">
              <p className="text-[11px] text-[#D8EAF5]/80">Order #NC-48291</p>
            </div>
          </div>

          {/* AI response with progress */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#0A2240] border border-[#AEEC01]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[7px] text-[#AEEC01] font-mono font-bold">AI</span>
            </div>
            <div className="flex-1 rounded-xl rounded-tl-none bg-[#0A2240] border border-[#4A9ECC]/10 px-3 py-2">
              <p className="text-[11px] text-[#A0C4DB] leading-relaxed mb-2">
                Found it! Shipped 2 hours ago. Arrives tomorrow by 2 PM.
              </p>
              <div className="h-1.5 rounded-full bg-[#AEEC01]/15 overflow-hidden">
                <div className="h-full bg-[#AEEC01] rounded-full" style={{ width: "72%" }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[8px] text-[#5C8BAD]">Shipped</span>
                <span className="font-mono text-[8px] text-[#AEEC01]">72%</span>
                <span className="font-mono text-[8px] text-[#5C8BAD]">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coordinate footer */}
        <div className="px-4 pb-3.5 flex items-center justify-between border-t border-white/4 pt-2.5">
          <span className="font-mono text-[8px] text-[#AEEC01]/35">
            48.21°N 11.60°E // LIVE
          </span>
          <span className="font-mono text-[8px] text-[#5C8BAD]/55">
            ↑ 99.97% uptime
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Wave Section Divider ─────────────────────────────────────────────────────

function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative h-10 overflow-hidden${flip ? " -scale-y-100" : ""}`}>
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 C180,6 360,34 540,20 C720,6 900,34 1080,20 C1260,6 1440,34 1440,20 L1440,40 L0,40 Z"
          fill="rgba(6,24,40,0.45)"
        />
        <path
          d="M0,28 C240,14 480,42 720,28 C960,14 1200,42 1440,28 L1440,40 L0,40 Z"
          fill="rgba(5,20,34,0.6)"
        />
      </svg>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-5 h-px bg-[#AEEC01]" />
      <span className="font-mono text-[10px] tracking-widest text-[#AEEC01] uppercase">
        {children}
      </span>
    </div>
  );
}

// ─── Solutions ────────────────────────────────────────────────────────────────

const SOLUTIONS = [
  {
    Icon: MessageSquare,
    tag: "Communication Buoy",
    title: "Customer Support",
    desc: "AI agents handle every inquiry with human precision — 24/7, in every language, at any scale.",
  },
  {
    Icon: Navigation2,
    tag: "Treasure Route",
    title: "Sales Automation",
    desc: "Intelligent lead qualification, follow-up sequences, and conversion paths that never sleep.",
  },
  {
    Icon: Settings,
    tag: "Captain's Bridge",
    title: "Operations",
    desc: "Streamline workflows, automate repetitive processes, and free your crew for strategic work.",
  },
  {
    Icon: BarChart3,
    tag: "Navigation Console",
    title: "Analytics Intelligence",
    desc: "Real-time insights surfaced automatically. Know what matters before you need to ask.",
  },
  {
    Icon: BookOpen,
    tag: "Navigation Charts",
    title: "Knowledge Base",
    desc: "A living, AI-maintained knowledge system that grows smarter with every interaction.",
  },
  {
    Icon: Cpu,
    tag: "Ship Control Room",
    title: "Internal AI",
    desc: "Deploy a custom model trained on your data, culture, and workflows — fully yours.",
  },
];

function SolutionCard({ s, i }: { s: (typeof SOLUTIONS)[0]; i: number }) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const onEnter = (e: React.MouseEvent) => {
    setHovered(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setRipple(null), 700);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: i * 0.07 }}
      onMouseEnter={onEnter}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-xl border border-white/7 bg-[#051828]/55 backdrop-blur-sm overflow-hidden transition-all duration-350 hover:border-[#AEEC01]/22 hover:bg-[#061C38]/75"
    >
      {ripple && (
        <motion.div
          className="absolute rounded-full border border-[#AEEC01]/25 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y, x: "-50%", y: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 140, height: 140, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="w-10 h-10 rounded-lg border border-[#AEEC01]/14 bg-[#AEEC01]/5 flex items-center justify-center group-hover:border-[#AEEC01]/28 group-hover:bg-[#AEEC01]/9 transition-all duration-300">
            <s.Icon size={18} className="text-[#AEEC01]" strokeWidth={1.5} />
          </div>
          <span className="font-mono text-[8px] tracking-widest text-[#5C8BAD]/65 text-right leading-tight max-w-[7rem]">
            {s.tag}
          </span>
        </div>

        <h3 className="text-base font-semibold text-[#D8EAF5] mb-2 group-hover:text-white transition-colors">
          {s.title}
        </h3>
        <p className="text-[13px] text-[#5C8BAD] leading-relaxed">{s.desc}</p>

        <div
          className={`mt-5 flex items-center gap-1.5 text-xs text-[#AEEC01] font-medium transition-all duration-300 ${
            hovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          <span>Learn more</span>
          <ArrowRight size={11} />
        </div>
      </div>
    </motion.div>
  );
}

function SolutionsSection() {
  return (
    <section id="solutions" className="relative py-24 lg:py-32 bg-[#020C16]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <SectionLabel>Navigation Stations</SectionLabel>
          <h2 className="text-3xl lg:text-[2.6rem] font-bold text-[#D8EAF5] leading-tight mb-4">
            Every role on your ship,
            <br />
            covered by AI.
          </h2>
          <p className="text-[#5C8BAD] text-lg leading-relaxed">
            Six specialized AI agents — each trained for a specific station aboard your business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUTIONS.map((s, i) => (
            <SolutionCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Map the Waters",
    desc: "We audit your current operations, identifying where AI can navigate most effectively and immediately.",
  },
  {
    n: "02",
    title: "Chart the Route",
    desc: "Custom AI strategy tailored to your business model, customer base, and growth trajectory.",
  },
  {
    n: "03",
    title: "Build the Crew",
    desc: "We engineer, train, and integrate your AI agents — custom-built to match your brand voice and processes.",
  },
  {
    n: "04",
    title: "Launch the Fleet",
    desc: "Controlled deployment with full monitoring. Your AI crew goes live, ready to handle real volume.",
  },
  {
    n: "05",
    title: "Optimize the Voyage",
    desc: "Continuous performance analysis and model refinement. The fleet gets smarter with every mile.",
  },
];

function ProcessSection() {
  return (
    <section id="process" className="relative py-24 lg:py-32 bg-[#020C16]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(14,50,85,0.18),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <SectionLabel>Navigation Chart</SectionLabel>
          <h2 className="text-3xl lg:text-[2.6rem] font-bold text-[#D8EAF5] leading-tight">
            From discovery
            <br />
            to full deployment.
          </h2>
        </div>

        <div className="relative max-w-2xl">
          {/* Vertical route line */}
          <div className="absolute left-[10px] top-5 bottom-5 w-px bg-gradient-to-b from-[#AEEC01]/50 via-[#AEEC01]/20 to-transparent" />

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className="flex gap-7 items-start pb-8 last:pb-0"
              >
                <div className="flex-shrink-0 flex flex-col items-center pt-1 relative z-10">
                  <div className="w-[21px] h-[21px] rounded-full border-2 border-[#AEEC01]/45 bg-[#020C16] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#AEEC01]" />
                  </div>
                </div>

                <div className="flex-1 border-b border-white/5 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-[10px] text-[#AEEC01]/45">{step.n}</span>
                    <h3 className="text-lg font-semibold text-[#D8EAF5]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[#5C8BAD] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Voyages ──────────────────────────────────────────────────────────────────

const VOYAGES = [
  {
    id: "001",
    company: "NovaCommerce",
    destination: "Customer Support Automation",
    challenge: "Incoming support volume had outpaced the human team by 4×.",
    route: "AI Support Agent trained on 3 years of historical ticket data",
    result: "Support workload reduced by 80%.",
    days: "9 days",
    sector: "E-commerce",
  },
  {
    id: "002",
    company: "Meridian Health",
    destination: "Patient Intake Automation",
    challenge: "Staff spent 60% of their time on administrative intake and scheduling.",
    route: "AI Intake Agent integrated with existing EMR system",
    result: "Administrative time cut by 65%. Staff refocused on care.",
    days: "18 days",
    sector: "Healthcare",
  },
  {
    id: "003",
    company: "Kessler Logistics",
    destination: "Sales Pipeline Intelligence",
    challenge: "Leads fell through the cracks — no systematic follow-up in place.",
    route: "AI Sales Agent with CRM integration and dynamic sequencing",
    result: "Lead-to-close rate improved by 38%. Zero leads missed.",
    days: "11 days",
    sector: "Logistics",
  },
];

function VoyagesSection() {
  return (
    <section id="voyages" className="relative py-24 lg:py-32 bg-[#010C18]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <SectionLabel>Completed Voyages</SectionLabel>
          <h2 className="text-3xl lg:text-[2.6rem] font-bold text-[#D8EAF5] leading-tight mb-4">
            Every voyage,
            <br />a proven result.
          </h2>
          <p className="text-[#5C8BAD] leading-relaxed">
            Real businesses. Real AI crews. Real outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {VOYAGES.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.09 }}
              className="rounded-xl border border-white/7 bg-[#051828]/55 backdrop-blur-sm overflow-hidden group hover:border-[#AEEC01]/18 transition-all duration-300"
            >
              <div className="px-5 py-3.5 border-b border-white/6 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#AEEC01]/55 tracking-widest">
                  VOYAGE {v.id}
                </span>
                <span className="font-mono text-[8px] text-[#5C8BAD] bg-[#0A2240]/80 px-2 py-0.5 rounded">
                  {v.sector}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="font-mono text-[8px] text-[#5C8BAD] mb-1 tracking-wider uppercase">
                    Company
                  </div>
                  <div className="text-xl font-bold text-[#D8EAF5]">{v.company}</div>
                </div>

                <div>
                  <div className="font-mono text-[8px] text-[#5C8BAD] mb-1 tracking-wider uppercase">
                    Destination
                  </div>
                  <div className="text-sm text-[#A0C4DB] font-medium">{v.destination}</div>
                </div>

                <div>
                  <div className="font-mono text-[8px] text-[#5C8BAD] mb-1 tracking-wider uppercase">
                    Challenge
                  </div>
                  <div className="text-[13px] text-[#5C8BAD]">{v.challenge}</div>
                </div>

                <div>
                  <div className="font-mono text-[8px] text-[#5C8BAD] mb-1 tracking-wider uppercase">
                    Route
                  </div>
                  <div className="text-[13px] text-[#5C8BAD]">{v.route}</div>
                </div>

                <div className="rounded-lg bg-[#AEEC01]/5 border border-[#AEEC01]/14 p-3.5">
                  <div className="font-mono text-[8px] text-[#AEEC01]/55 mb-1 tracking-wider uppercase">
                    Result
                  </div>
                  <div className="text-sm font-semibold text-[#AEEC01]">{v.result}</div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[9px] text-[#5C8BAD]">
                  <Clock size={10} />
                  <span>Journey completed in {v.days}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 80, suffix: "%", label: "Average support\nworkload reduction" },
  { value: 9, suffix: " days", label: "Average time to\nfull deployment" },
  { value: 99, suffix: ".9%", label: "Uptime across all\ndeployed agents" },
  { value: 3, suffix: "×", label: "Average ROI in\nthe first quarter" },
];

function StatItem({ stat, active }: { stat: (typeof STATS)[0]; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-[#D8EAF5] tabular-nums tracking-tight">
        {count}
        {stat.suffix}
      </div>
      <div className="mt-2.5 text-[13px] text-[#5C8BAD] leading-snug whitespace-pre-line">
        {stat.label}
      </div>
    </div>
  );
}

function StatsSection() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative py-24 bg-[#020C16]" ref={ref}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.028]"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse
              key={i}
              cx="50%"
              cy="50%"
              rx={`${22 + i * 11}%`}
              ry={`${13 + i * 6}%`}
              fill="none"
              stroke="#AEEC01"
              strokeWidth="0.55"
            />
          ))}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {STATS.map((s, i) => (
            <StatItem key={i} stat={s} active={active} />
          ))}
        </div>

        {/* Wave line beneath stats */}
        <div className="mt-12 relative" style={{ height: "20px" }}>
          <svg
            className="absolute inset-0 w-full"
            viewBox="0 0 1200 20"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,10 C150,3 300,17 450,10 C600,3 750,17 900,10 C1050,3 1200,17 1200,10"
              stroke="#AEEC01"
              strokeWidth="0.9"
              strokeOpacity="0.28"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState<FormParams>({ name: "", company: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentParams, setSentParams] = useState<FormParams | null>(null);

  const set = (k: keyof FormParams) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendEmails(form, EMAIL_LOGO_URL);
      setSentParams({ ...form });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-[#010C18] overflow-hidden">
      {/* Topographic map bg */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.038]" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 9 }).map((_, i) => (
            <ellipse key={i} cx="72%" cy="50%" rx={`${18 + i * 9}%`} ry={`${10 + i * 5}%`} fill="none" stroke="#4A9ECC" strokeWidth="0.55" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse key={i + 9} cx="18%" cy="58%" rx={`${12 + i * 7}%`} ry={`${8 + i * 4}%`} fill="none" stroke="#AEEC01" strokeWidth="0.4" />
          ))}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Copy */}
          <div>
            <SectionLabel>Set Sail</SectionLabel>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#D8EAF5] leading-tight mb-5">
              Ready to set sail<br />
              <span className="text-[#AEEC01]">with AI?</span>
            </h2>
            <p className="text-[#5C8BAD] text-lg leading-relaxed mb-8">
              Book a strategy session and discover how Oceanier can build an AI workforce tailored to your business.
            </p>

            <div className="space-y-3.5">
              {[
                "No generic demos — your business, your AI crew",
                "Full deployment in as little as 7 days",
                "Ongoing optimization, not a one-time setup",
              ].map((pt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#AEEC01] flex-shrink-0" />
                  <span className="text-sm text-[#A0C4DB]">{pt}</span>
                </div>
              ))}
            </div>

            

            <div className="mt-8 font-mono text-[9px] text-[#AEEC01]/25 space-y-1">
              <div>// INITIATE CONTACT SEQUENCE</div>
              <div>// ENCRYPTION: ACTIVE</div>
              <div>// ROUTE: SECURE CHANNEL</div>
            </div>
          </div>

          {/* Form panel */}
          <div className="rounded-2xl border border-white/7 bg-[#051828]/70 backdrop-blur-sm p-7 lg:p-8">
            {status === "sent" && sentParams ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                {/* Ripple success animation */}
                <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#AEEC01]"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#AEEC01]/40"
                    animate={{ scale: [1, 2.4], opacity: [0.3, 0] }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
                  />
                  <div className="w-16 h-16 rounded-full border-2 border-[#AEEC01] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#AEEC01]" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#D8EAF5] mb-2">Message received.</h3>
                <p className="text-sm text-[#5C8BAD] mb-1">
                  We set sail shortly. Expect contact within 24 hours.
                </p>
                <p className="text-xs text-[#5C8BAD] mb-6">
                  A confirmation email has been sent to{" "}
                  <span className="text-[#A0C4DB] font-medium">{sentParams.email}</span>
                </p>

                <p className="font-mono text-[9px] text-[#AEEC01]/35 mt-6">// TRANSMISSION COMPLETE</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: "name" as const, label: "Your Name", ph: "Full name" },
                    { k: "company" as const, label: "Company", ph: "Company name" },
                  ].map((f) => (
                    <div key={f.k}>
                      <label className="block font-mono text-[9px] tracking-widest text-[#5C8BAD] mb-1.5 uppercase">
                        {f.label}
                      </label>
                      <input
                        type="text"
                        placeholder={f.ph}
                        value={form[f.k]}
                        onChange={set(f.k)}
                        required
                        className="w-full bg-[#0A2240] border border-white/7 rounded-lg px-4 py-2.5 text-sm text-[#D8EAF5] placeholder-[#5C8BAD]/45 focus:outline-none focus:border-[#AEEC01]/35 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[#5C8BAD] mb-1.5 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={set("email")}
                    required
                    className="w-full bg-[#0A2240] border border-white/7 rounded-lg px-4 py-2.5 text-sm text-[#D8EAF5] placeholder-[#5C8BAD]/45 focus:outline-none focus:border-[#AEEC01]/35 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] tracking-widest text-[#5C8BAD] mb-1.5 uppercase">
                    What can we automate?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your biggest operational challenge..."
                    value={form.message}
                    onChange={set("message")}
                    className="w-full bg-[#0A2240] border border-white/7 rounded-lg px-4 py-2.5 text-sm text-[#D8EAF5] placeholder-[#5C8BAD]/45 focus:outline-none focus:border-[#AEEC01]/35 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-4 py-2.5">
                    Something went wrong. Please try again or email us directly at contact@oceanier.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group w-full rounded-full bg-[#AEEC01] text-[#010D18] font-bold text-sm py-3.5 transition-all duration-300 hover:bg-[#C5F520] hover:shadow-lg hover:shadow-[#AEEC01]/18 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-[#010D18]/40 border-t-[#010D18]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Sending Emails…
                    </>
                  ) : (
                    <>
                      Start the Journey
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center font-mono text-[9px] text-[#5C8BAD]/45 pt-2">
                  By submitting, you agree to our terms and to receive communication from Oceanier.
                  <br />
                  We will never share your data.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative bg-[#010810] pt-12 pb-8 overflow-hidden border-t border-white/5">
      {/* Horizon line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AEEC01]/18 to-transparent" />

      {/* Ghost ship — barely visible */}
      <svg
        viewBox="0 0 200 80"
        className="absolute bottom-0 right-1/2 translate-x-1/2 w-36 pointer-events-none"
        style={{ opacity: 0.05 }}
        fill="#A8C8E0"
      >
        <path d="M20,58 L180,58 L168,66 L32,66 Z" />
        <path d="M70,58 L70,22 L100,8 L100,58 Z" />
        <path d="M100,58 L100,18 L128,36 L128,58 Z" />
        <path d="M46,58 L46,36 L70,22 L70,58 Z" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-white/5">
          <div>
            <img src={darkLogo} alt="Oceanier" className="h-6 w-auto mb-3 opacity-90" />
            <p className="text-xs text-[#5C8BAD] max-w-xs leading-relaxed">
              Building the intelligent crew that keeps your business moving forward.
            </p>
          </div>

          <nav className="flex flex-wrap gap-8 text-xs text-[#5C8BAD]">
            {["Solutions", "Process", "Voyages", "Contact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="hover:text-[#A0C4DB] transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-[9px] text-[#5C8BAD]/45">
            © 2026 Oceanier. All rights reserved.
          </p>
          <p className="font-mono text-[9px] text-[#AEEC01]/28">
            48.2109°N // 011.6072°E // UNDERWAY
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ mx, my }: { mx: number; my: number }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <OceanBackground mx={mx} my={my} />
      <ShipSilhouette />
      <FloatingNavElements mx={mx} my={my} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-px bg-[#AEEC01]" />
              <span className="font-mono text-[10px] tracking-widest text-[#AEEC01] uppercase">
                AI Workforce Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-[#D8EAF5] leading-[1.07] mb-6">
              Navigate the
              <br />
              <span className="text-[#AEEC01]">Future of Business</span>
              <br />
              with AI.
            </h1>

            <p className="text-lg text-[#5C8BAD] leading-relaxed mb-9 max-w-[440px]">
              Every great business needs a smarter crew. Oceanier builds the AI workforce that keeps your ship on course — 24/7, at any scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#AEEC01] text-[#010D18] font-bold text-sm px-7 py-3.5 transition-all duration-300 hover:bg-[#C5F520] hover:shadow-xl hover:shadow-[#AEEC01]/18"
              >
                Start the Journey
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>
              <a
                href="#voyages"
                className="inline-flex items-center justify-center rounded-full border border-white/14 text-[#A0C4DB] font-medium text-sm px-7 py-3.5 hover:border-white/28 hover:text-[#D8EAF5] transition-all duration-300"
              >
                View Completed Voyages
              </a>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2.5 mt-9">
              {["80% less support load", "9-days deployment", "99.9% uptime"].map((s) => (
                <span
                  key={s}
                  className="font-mono text-[9px] text-[#5C8BAD] bg-[#0A2240]/60 border border-white/7 rounded-full px-3 py-1.5 tracking-wide"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <FloatingDashboard mx={mx} my={my} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#5C8BAD]/60"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown size={13} />
      </motion.div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const scrollY = useScrollY();

  useEffect(() => {
    let pending = false;
    let lx = 0, ly = 0;

    const onMove = (e: MouseEvent) => {
      lx = (e.clientX / window.innerWidth) * 2 - 1;
      ly = (e.clientY / window.innerHeight) * 2 - 1;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          setMouse({ x: lx, y: ly });
          pending = false;
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#020C16] text-[#D8EAF5]">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
        <ScrollProgress />
        <Navbar scrolled={scrollY > 24} />

        <main>
          <HeroSection mx={mouse.x} my={mouse.y} />
          <WaveDivider />
          <SolutionsSection />
          <WaveDivider flip />
          <ProcessSection />
          <WaveDivider />
          <VoyagesSection />
          <StatsSection />
          <ContactSection />
        </main>

        <Footer />

        <Analytics />
      </motion.div>
    </div>
  );
}
