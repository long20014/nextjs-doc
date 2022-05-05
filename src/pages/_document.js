import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

function MyDocument({ __NEXT_DATA__ }) {
  const currentLocale =
    __NEXT_DATA__.query.lang ||
    (__NEXT_DATA__.query.id && __NEXT_DATA__.query.id[0]) ||
    'en';
  return (
    <Html lang={currentLocale}>
      <Head></Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;
