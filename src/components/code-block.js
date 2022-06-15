import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);
    return (
      <div className="code-wrapper">
        <CopyToClipboard
          text={String(children).replace(/\n$/, '')}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
        >
          <span className="copy-to-clip-board-btn">
            {copied ? 'Copied' : 'Copy'}
          </span>
        </CopyToClipboard>
        {!inline && match ? (
          <SyntaxHighlighter
            style={dracula}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        )}
      </div>
    );
  },
};

export default CodeBlock;
