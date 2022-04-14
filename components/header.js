import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import navbarData from '../built-data/navbar.json';
import ActiveLink from './active-link';
import constants from '../utils/constants';
const { NAVBAR } = constants;
const { navbarItems } = navbarData;

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
      <a>{children}</a>
    </Link>
  );
}

export default function Header() {
  return (
    <div style={styles.headerStyle}>
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
