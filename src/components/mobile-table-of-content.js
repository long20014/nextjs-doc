import React from 'react';
import constants from 'src/utils/constants';
import classNames from 'classnames';
import useTOC from 'src/hooks/useTOC';

const { TEXT_GOLDEN } = constants;

export default function MobileTableOfContent({}) {
  const {
    handleClick,
    TOC,
    mobileTOCDisplay,
    toggleTOCDisplay,
    order,
  } = useTOC();

  const renderMobileTOCItem = (item) => {
    const { dom, children } = item;
    const { innerText: headerContent } = dom;
    if (children) {
      return (
        <li key={headerContent}>
          <span onClick={(e) => handleClick(dom, e)}>{headerContent}</span>
          <ul>{children.map((child) => renderMobileTOCItem(child))}</ul>
        </li>
      );
    }
    return (
      <li key={headerContent}>
        <span onClick={(e) => handleClick(dom, e)}>{headerContent}</span>
      </li>
    );
  };

  const renderMobileTOC = () => {
    return (
      <div className="mobile-table-of-content-container">
        <div
          className={classNames('toc-expand-button', {
            expanded: mobileTOCDisplay,
          })}
          onClick={toggleTOCDisplay}
        >
          <span className="toc-expand-button-label">On this page</span>
        </div>
        <div
          className={classNames('mobile-table-of-content', {
            expanded: mobileTOCDisplay,
          })}
        >
          <ul>{TOC.map((item) => renderMobileTOCItem(item))}</ul>
        </div>
      </div>
    );
  };

  return renderMobileTOC();
}
