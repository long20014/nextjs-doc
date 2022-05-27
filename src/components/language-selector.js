import React from 'react';
import classNames from 'classnames';
import useLanguage from 'src/hooks/useLanguage';

export default function LanguageSelector() {
  const {
    getLanguageLabel,
    changeLanguage,
    languageList,
    state,
    hoverRef,
    hoverRef2,
    isHovered,
    isHovered2,
  } = useLanguage();

  const renderDesktopLanguageSelector = () => {
    return (
      <div ref={hoverRef} className="language-selector">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          className="icon-language"
        >
          <path d="M12.1,2.75c-5.11,0-9.25,4.14-9.25,9.25s4.14,9.25,9.25,9.25s9.25-4.14,9.25-9.25C21.34,6.89,17.21,2.76,12.1,2.75z M12.1,19.95c-0.77,0-1.79-1.7-2.27-4.55h4.54c-0.48,2.85-1.5,4.6-2.27,4.6V19.95z M9.66,14.1c-0.06-0.66-0.1-1.36-0.1-2.1 s0-1.44,0.1-2.1h4.88c0.06,0.66,0.1,1.36,0.1,2.1s0,1.44-0.1,2.1H9.66z M4.15,12c0-0.71,0.1-1.42,0.29-2.1h3.92 c-0.07,0.7-0.1,1.4-0.1,2.1c0,0.7,0.03,1.4,0.1,2.1H4.44C4.25,13.42,4.15,12.71,4.15,12z M12.15,4.05c0.77,0,1.79,1.7,2.27,4.55 H9.83c0.48-2.85,1.5-4.55,2.27-4.55H12.15z M15.84,9.9h3.92c0.39,1.37,0.39,2.83,0,4.2h-3.92c0.07-0.7,0.1-1.4,0.1-2.1 C15.94,11.3,15.91,10.6,15.84,9.9z M19.28,8.6h-3.6c-0.19-1.48-0.64-2.91-1.34-4.22C16.51,5.02,18.3,6.56,19.28,8.6z M9.86,4.38 C9.16,5.69,8.71,7.12,8.52,8.6h-3.6C5.9,6.56,7.69,5.02,9.86,4.38z M4.92,15.38h3.6c0.19,1.48,0.64,2.91,1.34,4.22 c-2.17-0.64-3.96-2.17-4.94-4.2L4.92,15.38z M14.34,19.6c0.7-1.31,1.15-2.74,1.34-4.22h3.6c-0.97,2.05-2.77,3.59-4.94,4.24V19.6z"></path>
        </svg>
        <span className="current-language">{getLanguageLabel(state.lang)}</span>
        <ul
          ref={hoverRef2}
          className={classNames('language-dropdown-menu', {
            shown: isHovered || isHovered2,
          })}
        >
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

  return renderDesktopLanguageSelector();
}
