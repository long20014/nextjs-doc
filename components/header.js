import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import navbarData from '../built-data/navbar.json';
import headerData from '../fetched-data/navbar-data.json';
import ActiveLink from './active-link';
import constants from '../utils/constants';
const { NAVBAR } = constants;
const { navbarItems } = navbarData;
const { config: navbarConfig } = headerData;

const styles = {
  headerStyle: {
    padding: '0 1.5em',
    borderBottom: '1px solid black',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
  },
};

function NormalLink({ children, href }) {
  return (
    <Link href={href}>
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'black',
        }}
      >
        {children}
      </a>
    </Link>
  );
}

function Logo({ src }) {
  if (src.startsWith('img')) {
    const localSrc = src.replace('img', '/images');
    return <img src={localSrc} height="42" style={{ marginRight: '5px' }} />;
  }
  return <img src={src} height="42" style={{ marginRight: '5px' }} />;
}

function Title({ title }) {
  return <div style={{ marginRight: '2rem' }}>{title}</div>;
}

export default function Header() {
  return (
    <div style={styles.headerStyle}>
      <NormalLink href="/">
        <Logo src={navbarConfig.logo.src} />
        <Title title={navbarConfig.title} />
      </NormalLink>

      {navbarItems.map((item) => {
        return (
          <ActiveLink
            key={item.to}
            href={item.to}
            path={item.path}
            type={NAVBAR}
          >
            {item.label}
          </ActiveLink>
        );
      })}
    </div>
  );
}
