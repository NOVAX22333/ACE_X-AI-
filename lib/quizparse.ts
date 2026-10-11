export type QuizQ = { q: string; options: string[]; answer: number; explanation: string; marking: string };

// A question header: "### Q", "### Q1. text", "Q1)", "Question 2:" ... (text after the header is kept)
const HEAD =
  /^[ \t]*(?:#{1,4}[ \t]*(?:\*\*)?[ \t]*Q(?:uestion)?[ \t]*\d*|(?:\*\*)?Q(?:uestion)?[ \t]*\d+)[ \t]*[:.)]?[ \t]*(?:\*\*)?[ \t]*(.*)$/gim;

const opt = (L: string) => `\\n[ \\t]*[-*]?[ \\t]*(?:\\*\\*)?\\(?${L}[).:]\\)?(?:\\*\\*)?[ \\t]*([^\\n]*)`;
const BODY = new RegExp(
  "^([\\s\\S]*?)" +
    opt("A") +
    opt("B") +
    opt("C") +
    opt("D") +
    "\\n[ \\t]*(?:\\*\\*)?ANSWER(?:\\*\\*)?[ \\t]*:(?:\\*\\*)?[ \\t]*\\(?([A-D])\\)?[^\\n]*\\n?([\\s\\S]*)$",
  "i"
);

/** Parses the plain-text quiz format (no JSON, so LaTeX backslashes stay safe). */
export function parseQuiz(raw: string): QuizQ[] {
  const out: QuizQ[] = [];
  const heads = [...raw.matchAll(HEAD)];
  for (let k = 0; k < heads.length; k++) {
    const h = heads[k];
    const start = (h.index ?? 0) + h[0].length;
    const end = k + 1 < heads.length ? (heads[k + 1].index ?? raw.length) : raw.length;
    const block = (h[1] ? h[1] + "\n" : "") + raw.slice(start, end).replace(/^\n/, "");
    const m = ("\n" + block).match(BODY);
    if (!m) continue;
    const q = m[1].trim();
    const options = [m[2], m[3], m[4], m[5]].map((s) => s.trim());
    if (!q || options.some((o) => !o)) continue;
    const rest = m[7] ?? "";
    const why = rest.match(/WHY(?:\*\*)?[ \t]*:(?:\*\*)?[ \t]*([\s\S]*?)(?=\n[ \t]*(?:\*\*)?MARKING|$)/i);
    const mark = rest.match(/MARKING(?:\*\*)?[ \t]*:(?:\*\*)?[ \t]*([\s\S]*)$/i);
    out.push({
      q,
      options,
      answer: "ABCD".indexOf(m[6].toUpperCase()),
      explanation: (why?.[1] ?? "").trim(),
      marking: (mark?.[1] ?? "").trim(),
    });
  }
  return out;
}

/** Shuffles the options so the correct letter is not predictable. */
export function shuffleQuestion(x: QuizQ): QuizQ {
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { ...x, options: idx.map((i) => x.options[i]), answer: idx.indexOf(x.answer) };
}
