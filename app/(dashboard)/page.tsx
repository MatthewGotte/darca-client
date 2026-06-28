import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to DARCA Asset Intelligence.
      </Typography>
    </Box>
  );
}
