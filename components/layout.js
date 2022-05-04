import Head from 'next/head';
import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import TableOfContent from './table-of-content';
import { LangStateProvider } from '../contexts/language/index';
import { useLangContext } from '../contexts/language/index';
export const siteTitle = 'Next.js Sample Website';

function InnerLayout({ children, home }) {
  // const { state } = useLangContext();

  return (
    <div id="container">
      <Head>
        {/* <html lang={state.lang}></html> */}
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header />
      <div className="outer-container">
        {!home && <Sidebar />}
        <main className="post-container">
          {children}
          {!home && <TableOfContent />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function Layout({ children, home }) {
  return (
    <LangStateProvider>
      <InnerLayout home={home}>{children}</InnerLayout>
    </LangStateProvider>
  );
}
