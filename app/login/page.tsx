import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography
            variant="overline"
            color="primary"
            sx={{ display: "block", mb: 2 }}
          >
            DARCA Asset Intelligence
          </Typography>
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
}
