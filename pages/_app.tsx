import type { AppProps } from "next/app";
import "../styles/index.css";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={bricolage.className}>
      <Component {...pageProps} />
    </div>
  );
}
