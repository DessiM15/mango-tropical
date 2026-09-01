"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ask } from "@/lib/assistant";
import { copy } from "@/lib/copy";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

type Turn = { role: "you" | "shop"; text: string; link?: { href: string; label: string } };

/** The browser's speech APIs are not in the DOM lib, so they are narrowed here. */
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

/**
 * Whether this browser can listen at all. Never changes during a session, so it
 * is read as an external constant rather than set from an effect, which keeps
 * the server render and the first client render in agreement.
 */
function subscribeToNothing() {
  return () => {};
}

function speechAvailable() {
  return recognitionFactory() !== null && window.isSecureContext;
}

function speechUnavailableOnServer() {
  return false;
}

function recognitionFactory(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * The shop's face, on every answer it gives.
 *
 * The replies come from a keyword table rather than a model, so they were
 * arriving the instant the question was sent, from nobody in particular. That
 * read as a form validating, not as somebody answering. The mango and the
 * short pause below are what turn it back into a conversation.
 */
function MangoFace({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-mango-300 ring-2 ring-ink/70 ${className}`}
    >
      <Image src="/brand/mango-face.webp" alt="" width={512} height={512} className="h-full w-full object-cover" />
    </span>
  );
}

export function Assistant({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [readAloud, setReadAloud] = useState(false);

  // Speech recognition is Chrome, Edge and Safari only, needs a microphone
  // permission and needs a secure context. Where any of that is missing the
  // button simply never renders rather than failing when pressed.
  const canSpeak = useSyncExternalStore(
    subscribeToNothing,
    speechAvailable,
    speechUnavailableOnServer,
  );

  const logRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const replyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (turns.length > 0 || thinking) {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [turns, thinking]);

  useEffect(() => () => window.clearTimeout(replyTimer.current), []);

  const speak = useCallback(
    (text: string) => {
      if (!readAloud || typeof window === "undefined" || !window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === "es" ? "es-US" : "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [locale, readAloud],
  );

  const send = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      const found = ask(trimmed, locale);
      const reply: Turn = found
        ? { role: "shop", text: found.text, link: found.link }
        : {
            role: "shop",
            text: copy.assistant.unknown[locale],
            link: { href: site.phoneHref, label: site.phone },
          };

      // The question lands immediately; the answer waits half a second behind
      // the mango's three dots. It is a real delay on an answer that is already
      // in hand, and it is there so the panel visibly takes a turn rather than
      // printing both halves of the exchange in the same frame.
      setTurns((current) => [...current, { role: "you", text: trimmed }]);
      setDraft("");
      setThinking(true);
      window.clearTimeout(replyTimer.current);
      replyTimer.current = window.setTimeout(() => {
        setThinking(false);
        setTurns((current) => [...current, reply]);
        speak(reply.text);
      }, 520);
    },
    [locale, speak],
  );

  function toggleMic() {
    const Factory = recognitionFactory();
    if (!Factory) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new Factory();
    recognition.lang = locale === "es" ? "es-US" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const said = event.results[0]?.[0]?.transcript ?? "";
      if (said) send(said);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className="fixed bottom-5 right-5 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-chamoy-500 p-1 text-white shadow-lift transition-transform hover:scale-105 focus-visible:scale-105 sm:h-16 sm:w-16"
      >
        <span className="sr-only">{open ? copy.assistant.close[locale] : copy.assistant.open[locale]}</span>
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" strokeWidth="2.5" fill="none" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <>
            {/* The red rim is the button; the mango is who answers. */}
            <MangoFace className="h-full w-full ring-0" />
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-chamoy-500 text-white ring-2 ring-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M12 3c5 0 9 3.3 9 7.4 0 4.1-4 7.4-9 7.4-.9 0-1.8-.1-2.6-.3L4.6 20a.6.6 0 0 1-.9-.7l1-3.1C3.1 14.8 3 12.7 3 10.4 3 6.3 7 3 12 3Z" />
              </svg>
            </span>
          </>
        )}
      </button>

      <div
        id="assistant-panel"
        hidden={!open}
        className="fixed bottom-24 right-4 z-[64] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-white shadow-lift sm:right-5"
      >
        <div className="flex items-center gap-3 bg-ocean-600 px-5 py-4 text-white">
          <MangoFace className="h-11 w-11" />
          <div className="min-w-0">
            <p className="display text-xl">{copy.assistant.title[locale]}</p>
            <p className="mt-0.5 font-body text-[13px] text-white/80">{copy.assistant.subtitle[locale]}</p>
          </div>
        </div>

        <div ref={logRef} className="max-h-[42vh] space-y-3 overflow-y-auto px-5 py-4">
          {turns.length === 0 ? (
            <div>
              <p className="font-body text-[15px] leading-relaxed text-ink-soft">
                {copy.assistant.greeting[locale]}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {copy.assistant.examples.map((example) => (
                  <li key={example.en}>
                    <button
                      type="button"
                      onClick={() => send(example[locale])}
                      className="rounded-full bg-sand-100 px-3.5 py-1.5 font-body text-[13px] font-bold text-ink transition-colors hover:bg-mango-300"
                    >
                      {example[locale]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {turns.map((turn, index) => (
            <div
              key={index}
              data-turn={turn.role}
              className={
                turn.role === "you"
                  ? "flex justify-end"
                  : "flex items-end justify-start gap-2"
              }
            >
              {turn.role === "shop" ? <MangoFace className="h-8 w-8" /> : null}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-body text-[15px] leading-relaxed ${
                  turn.role === "you"
                    ? "rounded-br-md bg-ocean-600 text-white"
                    : "rounded-bl-md bg-sand-100 text-ink"
                }`}
              >
                {turn.text}
                {turn.link ? (
                  turn.link.href.startsWith("/") ? (
                    <Link href={turn.link.href} className="mt-2 block font-bold text-chamoy-500 underline underline-offset-4">
                      {turn.link.label}
                    </Link>
                  ) : (
                    <a href={turn.link.href} className="mt-2 block font-bold text-chamoy-500 underline underline-offset-4">
                      {turn.link.label}
                    </a>
                  )
                ) : null}
              </div>
            </div>
          ))}

          {/* The mango taking its turn. Announced politely rather than
              assertively: it is a placeholder for an answer, and the answer
              itself is what the reader is waiting to be told. */}
          {thinking ? (
            <div className="flex items-end justify-start gap-2" data-turn="thinking">
              <MangoFace className="h-8 w-8" />
              <div
                className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-sand-100 px-4 py-3.5"
                role="status"
                aria-live="polite"
              >
                <span className="sr-only">{copy.assistant.typing[locale]}</span>
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    aria-hidden="true"
                    className="chat-dot h-2 w-2 rounded-full bg-ink-soft"
                    style={{ animationDelay: `${dot * 0.16}s` }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* The microphone is open. Without this the only sign was the button
            changing colour, which is not something you are looking at while
            you are talking. */}
        {listening ? (
          <div
            className="flex items-center gap-3 border-t border-ink/10 bg-chamoy-500 px-5 py-3 text-white"
            role="status"
            aria-live="polite"
          >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center">
              <span aria-hidden="true" className="listen-ring absolute inset-0 rounded-full bg-white/70" />
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white text-chamoy-500">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden="true">
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11Z" />
                </svg>
              </span>
            </span>
            <div className="min-w-0">
              <p className="label-type text-[15px] leading-tight">
                {copy.assistant.listening[locale]}
              </p>
              <p className="font-body text-[12px] text-white/85">
                {copy.assistant.listeningHint[locale]}
              </p>
            </div>
            {/* A meter that is moving, so the panel looks live rather than
                stuck on a red bar. It reports nothing about the microphone
                level, so it stays out of the accessibility tree. */}
            <span aria-hidden="true" className="ml-auto flex items-end gap-1">
              {[0, 1, 2, 3].map((bar) => (
                <span
                  key={bar}
                  className="chat-dot w-1.5 rounded-full bg-white/90"
                  style={{ height: `${0.55 + (bar % 2) * 0.5}rem`, animationDelay: `${bar * 0.13}s` }}
                />
              ))}
            </span>
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 border-t border-ink/10 p-3"
        >
          <label htmlFor="assistant-input" className="sr-only">
            {copy.assistant.inputLabel[locale]}
          </label>
          <input
            id="assistant-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.assistant.placeholder[locale]}
            className="min-w-0 flex-1 rounded-full bg-sand-100 px-4 py-2.5 font-body text-[15px] text-ink outline-none placeholder:text-ink-soft/50"
          />

          {canSpeak ? (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                listening
                  ? "bg-chamoy-500 text-white ring-2 ring-chamoy-500/40"
                  : "bg-sand-100 text-ink hover:bg-mango-300"
              }`}
            >
              <span className="sr-only">
                {listening ? copy.assistant.stopVoice[locale] : copy.assistant.startVoice[locale]}
              </span>
              {listening ? (
                <span aria-hidden="true" className="listen-ring absolute inset-0 rounded-full bg-chamoy-400" />
              ) : null}
              <svg viewBox="0 0 24 24" className="relative h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11Z" />
              </svg>
            </button>
          ) : null}

          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chamoy-400 text-white transition-colors hover:bg-chamoy-500"
          >
            <span className="sr-only">{copy.assistant.send[locale]}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
            </svg>
          </button>
        </form>

        <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-2.5">
          <label className="flex cursor-pointer items-center gap-2 font-body text-[12px] text-ink-soft">
            <input
              type="checkbox"
              checked={readAloud}
              onChange={(event) => setReadAloud(event.target.checked)}
              className="h-3.5 w-3.5 accent-chamoy-400"
            />
            {copy.assistant.readAloud[locale]}
          </label>
          <p className="font-body text-[11px] text-ink-soft/60">{copy.assistant.disclaimer[locale]}</p>
        </div>
      </div>
    </>
  );
}
