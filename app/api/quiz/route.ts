import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai";
import { isPro } from "@/lib/pro";
import { parseQuiz, shuffleQuestion } from "@/lib/quizparse";

export const runtime = "nodejs";
export const maxDuration = 60;

const LEVELS: Record<string, string> = {
  Easy: "Mostly straightforward one-step application: the student must use a definition or formula on a short, concrete scenario, not just state it from memory.",
  Medium:
    "Standard current WASSCE-level questions: a short real-life or practical scenario (a calculation, a diagram, a data table, a situation to interpret) that needs one or two steps of reasoning to apply the knowledge.",
  Hard: "Top-grade WASSCE and JAMB questions: a multi-step scenario that combines two or more ideas and asks the student to analyse, calculate or decide, with tricky but fair distractor options.",
  Extreme:
    "Very hard: multi-concept problems in unfamiliar, realistic situations, derivations and reasoning traps at first-year university or olympiad level. No simple recall.",
};
const EXAMS = ["WASSCE", "NECO", "JAMB", "BECE"];
const SUBJECTS = ["Mathematics", "English", "Physics", "Chemistry", "Biology"];

const SYSTEM = [
  "You are a senior examiner and teacher who writes accurate, exam-standard multiple-choice questions for West African students (WASSCE, NECO, JAMB, BECE) and general learners.",
  "WAEC has moved its exams away from pure recall and towards critical thinking and the application of knowledge: a 2025 WASSCE question would ask the student to apply a principle to a real-life situation, a calculation, or data to interpret, rather than just define it.",
  "Write your questions the same way. Prefer a short scenario, a real-world context, a set of data, or a situation to interpret over a bare 'what is the definition of...' question, except at Easy level where some are allowed.",
  "Accuracy matters more than anything: every question has exactly one correct option, and you solve each question yourself before writing its answer.",
].join(" ");

export async function POST(req: Request) {
  let body: { topic?: string; level?: string; n?: number; exam?: string; subject?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const topic = (body.topic ?? "").trim().slice(0, 120);
  const level = body.level && Object.prototype.hasOwnProperty.call(LEVELS, body.level) ? body.level : "Medium";
  const n = Math.min(8, Math.max(3, Math.floor(Number(body.n) || 5)));
  const exam = EXAMS.includes(body.exam ?? "") ? (body.exam as string) : "";
  const subject = SUBJECTS.includes(body.subject ?? "") ? (body.subject as string) : "";

  if (exam && !isPro(req)) {
    return NextResponse.json({ error: "Exam Practice is a Pro feature. Upgrade to continue." }, { status: 402 });
  }
  if (!exam && !topic) {
    return NextResponse.json({ error: "Type a topic first." }, { status: 400 });
  }

  const examLine = exam
    ? `Exam style: ${exam} ${subject || "general"}. Follow the real ${exam} syllabus, wording and standard. Write original questions in that style. Never claim that a question comes from a particular year or paper.`
    : "";
  const topicLine = topic ? `Topic: ${topic}` : `Topic: the whole ${exam} ${subject} syllabus`;

  const prompt = [
    `Write ${n} multiple-choice questions.`,
    topicLine,
    examLine,
    `Level: ${level}. ${LEVELS[level]}`,
    "",
    "Rules:",
    "- Every question must test the topic directly. No general-knowledge filler and no questions from other topics.",
    "- Match the level exactly. Never write easy recall questions for Hard or Extreme.",
    "- Favour application and scenario-based questions over bare definitions, in line with WAEC's current standard. Ground questions in a short real-life situation, a calculation, a diagram description, or data to interpret wherever the topic allows it.",
    "- Four options A to D with exactly one correct. Wrong options must be believable and based on common student mistakes. Spread the correct letter across A, B, C and D.",
    "- Write maths in LaTeX with $...$ for inline maths.",
    "- Work each question out first. If you are not sure of an answer, replace the question.",
    "- Write in the same language as the topic.",
    "",
    "Output format, exactly, with no other text before or after:",
    "### Q",
    "<question>",
    "A) <option>",
    "B) <option>",
    "C) <option>",
    "D) <option>",
    "ANSWER: <letter>",
    "WHY: <short explanation showing the working or reasoning, and the usual mistake>",
    "MARKING: <how an examiner would award marks, for example a method mark and an accuracy mark>",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const r = await callAI({
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
    maxTokens: 6000,
    temperature: 0.4,
    effort: "medium",
  });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status });

  const questions = parseQuiz(r.text).map(shuffleQuestion).slice(0, n);
  if (questions.length < Math.max(3, Math.ceil(n * 0.6))) {
    return NextResponse.json({ error: "Could not build a good quiz this time. Please try again." }, { status: 502 });
  }

  const title = exam ? `${exam} ${subject}${topic ? " · " + topic : ""}` : topic;
  return NextResponse.json({ title, level, questions });
}
