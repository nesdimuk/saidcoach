import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Meta tag de verificación de Facebook */}
        <meta
          name="facebook-domain-verification"
          content="ctcyu1mazfp63tyqfe0j14sgbm9ih"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
