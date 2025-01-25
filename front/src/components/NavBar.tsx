// components/Navbar.tsx
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { Map, Analytics } from "@mui/icons-material";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4757",
    },
    text: {
      primary: "#2d3436",
    },
    background: {
      default: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(8px)",
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "1.5rem",
  background: "linear-gradient(45deg, #ff4757 0%, #ff6b81 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
  transition: "0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #ff6b81 0%, #ff4757 100%)",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  color: theme.palette.text.primary,
  transition: "0.2s ease",
  "&.active": {
    color: theme.palette.primary.main,
    "&:before": {
      content: '""',
      position: "absolute",
      bottom: 4,
      left: 0,
      right: 0,
      height: "2px",
      backgroundColor: theme.palette.primary.main,
    },
  },
  "&:hover": {
    background: "rgba(255, 71, 87, 0.05)",
  },
}));

const Navbar = () => {
  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="sticky">
        <Toolbar
          sx={{
            px: { xs: 2, md: 6 },
            justifyContent: "space-between",
            minHeight: "64px !important",
          }}
        >
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Logo variant="h1">RedEvent</Logo>
          </NavLink>

          <Box sx={{ display: "flex", gap: 1 }}>
            <NavButton
              component={NavLink}
              to="/location"
              startIcon={<Map sx={{ color: "inherit", fontSize: "1.2rem" }} />}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Risk Analysis
              </Box>
            </NavButton>

            <NavButton
              component={NavLink}
              to="/heatmap"
              startIcon={
                <Analytics sx={{ color: "inherit", fontSize: "1.2rem" }} />
              }
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Heatmap
              </Box>
            </NavButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  );
};

export default Navbar;
