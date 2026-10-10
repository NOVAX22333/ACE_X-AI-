import Script from "next/script";
import { MARKUP } from "@/components/markup";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
      <Script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" strategy="afterInteractive" />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
