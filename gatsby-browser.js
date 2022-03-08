const React = require('react');
const { createMuiTheme, ThemeProvider } = require('@material-ui/core');
const { StoreProvider } = require('./src/context/store');

const defaultTheme = createMuiTheme({
  shape: {
    borderRadius: 12, // global radius
  },
  palette: { primary: { main: '#428A13' } },
  typography: {
    fontFamily: [
      'IBM Plex Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// This lint rule is generally useful but not in gatsby-browser's node context
// eslint-disable-next-line react/prop-types
const RootLayout = ({ children }) => (
  <ThemeProvider theme={defaultTheme}>
    <StoreProvider>{children}</StoreProvider>
  </ThemeProvider>
);

// This lint rule is generally useful but not in gatsby-browser's node context
// eslint-disable-next-line react/prop-types
exports.wrapRootElement = ({ element }) => <RootLayout>{element}</RootLayout>;
