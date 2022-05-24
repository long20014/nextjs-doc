import React, { useState } from 'react';
import classNames from 'classnames';
import useLanguage from 'src/hooks/useLanguage';

export default function MobileLanguageSelector() {
  const {
    getLanguageLabel,
    changeLanguage,
    languageList,
    state,
    hoverRef,
  } = useLanguage();

  const [expanded, setExpanded] = useState(false);

  const handleClick = (target) => {
    setExpanded((expanded) => !expanded);
    if (!expanded) {
      target.parentNode.classList.add('expanded');
    } else {
      target.parentNode.classList.remove('expanded');
    }
  };

  const renderMobileLanguageSelector = () => {
    return (
      <div className="mobile-language-selector">
        <div
          ref={hoverRef}
          onClick={(e) => handleClick(hoverRef.current)}
          className="sidebar-item light-gray-text dropdown-label"
        >
          <span className="label-text">{getLanguageLabel(state.lang)}</span>
        </div>
        <ul>
          {languageList.map((item) => {
            const { label, value } = item;
            return (
              <li
                key={value}
                className={classNames({ active: state.lang === value })}
                onClick={() => changeLanguage(value)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return renderMobileLanguageSelector();
}
