import React from 'react';
import constants from 'src/utils/constants';
import classNames from 'classnames';
import useTOC from 'src/hooks/useTOC';

const { TEXT_GOLDEN } = constants;

export default function TableOfContent({}) {
  const { handleClick, TOC, order } = useTOC();

  const styles = {
    common: {},
    normal: {},
    hover: {
      color: TEXT_GOLDEN,
    },
  };

  const renderDesktopTOCItem = (item) => {
    const { dom, children } = item;
    const { innerText: headerContent } = dom;
    if (children) {
      return (
        <li key={headerContent}>
          <span
            style={order === item.order ? styles.hover : styles.normal}
            onClick={(e) => handleClick(dom, e)}
          >
            {headerContent}
          </span>
          <ul>{children.map((child) => renderDesktopTOCItem(child))}</ul>
        </li>
      );
    }
    return (
      <li key={headerContent}>
        <span
          style={order === item.order ? styles.hover : styles.normal}
          onClick={(e) => handleClick(dom, e)}
        >
          {headerContent}
        </span>
      </li>
    );
  };

  const renderDesktopTOC = () => {
    return (
      <div className="table-of-content-container">
        <div className="table-of-content">
          <ul>{TOC.map((item) => renderDesktopTOCItem(item))}</ul>
        </div>
      </div>
    );
  };

  return renderDesktopTOC();
}
