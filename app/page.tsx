import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h4" component="h1">
        DARCA Asset Intelligence
      </Typography>
      <Button variant="contained">
        Test button
      </Button>
    </Box>
  );
}
