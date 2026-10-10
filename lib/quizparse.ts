export type QuizQ = { q: string; options: string[]; answer: number; explanation: string; marking: string };

/** Parses the plain-text quiz format (no JSON, so LaTeX backslashes stay safe). */
export function parseQuiz(raw: string): QuizQ[] {
  const out: QuizQ[] = [];
  const blocks = raw.split(/^\s*#{2,3}\s*Q[^\n]*$/gim).slice(1);
  for (const b of blocks) {
    const m = b.match(
      /^([\s\S]*?)\n\s*A[).:]\s*([^\n]*)\n\s*B[).:]\s*([^\n]*)\n\s*C[).:]\s*([^\n]*)\n\s*D[).:]\s*([^\n]*)\n\s*ANSWER\s*:\s*\(?([A-D])\)?[^\n]*\n?([\s\S]*)$/i
    );
    if (!m) continue;
    const q = m[1].trim();
    const options = [m[2], m[3], m[4], m[5]].map((s) => s.trim());
    if (!q || options.some((o) => !o)) continue;
    const rest = m[7] ?? "";
    const why = rest.match(/WHY\s*:\s*([\s\S]*?)(?=\n\s*MARKING\s*:|$)/i);
    const mark = rest.match(/MARKING\s*:\s*([\s\S]*)$/i);
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
