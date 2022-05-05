import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

function MyDocument(props) {
  const nextData = props?.__NEXT_DATA__;
  const currentLocale =
    nextData?.query.lang ||
    (nextData?.query.id && nextData?.query.id[0]) ||
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
