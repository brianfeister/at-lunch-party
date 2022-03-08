import { ReactElement } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { makeStyles, Box, Typography } from '@material-ui/core';
import SearchBox from './searchBox';
import Logo from '../images/logo.svg';

interface HeaderProps {
  siteTitle?: string;
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1.45rem 1.0875rem',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      padding: '3vw 3vw',
    },
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2.25rem',
    lineHeight: '1.1',
  },
  link: {
    textDecoration: 'none',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
      margin: '0 auto 20px',
      display: 'block',
    },
  },
}));

function Header({ siteTitle }: HeaderProps): ReactElement {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Typography variant="h3" component="h3" className={classes.title}>
        <Link className={classes.link} to="/">
          <img src={Logo} alt={siteTitle} />
        </Link>
        <SearchBox />
      </Typography>
    </Box>
  );
}

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
