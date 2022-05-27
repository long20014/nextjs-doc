import Head from 'next/head';
import Sidebar from './sidebar';
import Header from './header';
import Footer from './footer';
import React from 'react';
import TableOfContent from './table-of-content';
import MobileTableOfContent from './mobile-table-of-content';
import { LangStateProvider } from 'src/contexts/language';
import GoTopButton from './go-top-btn';

export const siteTitle = 'Next.js Sample Website';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

function InnerLayout({ children, home }) {
  return (
    <div id="container" style={containerStyle}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Header home={home} />
      <div className="outer-container">
        {!home && <MobileTableOfContent />}
        {<Sidebar home={home} />}
        <main className="post-container">
          {children}
          {!home && <TableOfContent />}
        </main>
        <GoTopButton></GoTopButton>
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
