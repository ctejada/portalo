import Script from "next/script";
import type { PageIntegrations } from "@portalo/shared";

interface AnalyticsScriptsProps {
  integrations: PageIntegrations | null;
}

export function AnalyticsScripts({ integrations }: AnalyticsScriptsProps) {
  if (!integrations) return null;
  const { ga_id, meta_pixel_id } = integrations;
  if (!ga_id && !meta_pixel_id) return null;

  return (
    <>
      {ga_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga_id)}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga_id}');`}
          </Script>
        </>
      )}
      {meta_pixel_id && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta_pixel_id}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
