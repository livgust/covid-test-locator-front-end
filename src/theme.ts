import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc4c1b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#455589',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          elevation: 3,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
  },
});

export default theme;
