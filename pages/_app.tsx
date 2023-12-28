import type { AppProps } from "next/app";
import Script from "next/script";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/styles/globals.css";
import Layout from "@/components/Layout";

// FontAwesome Settings
config.autoAddCss = false;

const  App = ({ Component, pageProps }: AppProps) => {
  const gtag = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <>
      {gtag &&
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`} />
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag}');
            `}
          </Script>
        </>
      }
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default App;