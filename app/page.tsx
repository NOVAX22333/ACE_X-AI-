import Script from "next/script";
import { MARKUP } from "@/components/markup";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
