import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Meta tag de verificación de Facebook */}
        <meta
          name="facebook-domain-verification"
          content="ctcyu1mazfp63tyqfef01j4sbgmi9h"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
