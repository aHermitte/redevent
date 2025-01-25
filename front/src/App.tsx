import { Button, Container, Typography, Box, keyframes } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(-45deg, #fff5f5, #f8f9fa, #f1f3f5, #f8f9fa)",
  backgroundSize: "400% 400%",
  animation: `${gradient} 15s ease infinite`,
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  padding: "16px 48px",
  fontSize: "1.5rem",
  fontWeight: 700,
  borderRadius: "50px",
  transition: "all 0.3s ease",
  background: "linear-gradient(45deg, #ff4757 0%, #ff6b81 100%)",
  color: "white",
  boxShadow: "0 4px 6px rgba(255, 71, 87, 0.2)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 8px rgba(255, 71, 87, 0.3)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

function App() {
  const navigate = useNavigate();

  return (
    <StyledContainer maxWidth={false}>
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: "linear-gradient(45deg, #ff4757 0%, #ff6b81 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.05em",
          }}
        >
          REDEVENT
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
        >
          Système intelligent de prédiction des risques routiers
        </Typography>
      </Box>

      <AnimatedButton
        variant="contained"
        onClick={() => navigate("/location")}
        size="large"
      >
        ENTRER
      </AnimatedButton>

      <Box sx={{ position: "absolute", bottom: 40 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ opacity: 0.7, fontStyle: "italic" }}
        >
          Une solution innovante pour la sécurité routière
        </Typography>
      </Box>
    </StyledContainer>
  );
}

export default App;
