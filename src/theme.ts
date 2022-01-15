import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#37474f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff7043',
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
