import { ReactElement } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { makeStyles, Box, Typography } from '@material-ui/core';
import Logo from '../images/logo.svg';

interface HeaderProps {
  siteTitle?: string;
}

const useStyles = makeStyles({
  container: {
    background: 'white',
    marginBottom: '1.45rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2.25rem',
    lineHeight: '1.1',
  },
  link: {
    textDecoration: 'none',
  },
});

function Header({ siteTitle }: HeaderProps): ReactElement {
  const classes = useStyles();
  return (
    <Box paddingX="1.0875rem" paddingY="1.45rem" marginX="auto" marginY="0">
      <Typography variant="h3" component="h3" className={classes.title}>
        <Link className={classes.link} to="/">
          <img src={Logo} alt={siteTitle} />
        </Link>
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
