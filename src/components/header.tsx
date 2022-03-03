import { ReactElement } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import {
  makeStyles, Container, Box, Typography,
} from '@material-ui/core';

interface HeaderProps {
  siteTitle?: string;
}

const useStyles = makeStyles({
  container: {
    background: 'rebeccapurple',
    marginBottom: '1.45rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2.25rem',
    lineHeight: '1.1',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
});

function Header({ siteTitle }: HeaderProps): ReactElement {
  const classes = useStyles();
  return (
    <Container className={classes.container} maxWidth="xl">
      <Box
        maxWidth="960px"
        paddingX="1.0875rem"
        paddingY="1.45rem"
        marginX="auto"
        marginY="0"
      >
        <Typography variant="h3" component="h3" className={classes.title}>
          <Link className={classes.link} to="/">
            {siteTitle}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
