"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import LoadingState from "@/components/common/loading-state";
import { useOrgContext } from "@/lib/context/org-context";
import { orgPath } from "@/lib/routes";

export default function HomeRedirect() {
  const router = useRouter();
  const { orgId, setOrgId, isReady } = useOrgContext();
  const [inputOrgId, setInputOrgId] = useState("");

  useEffect(() => {
    if (isReady && orgId) {
      router.replace(orgPath(orgId));
    }
  }, [isReady, orgId, router]);

  if (!isReady) {
    return <LoadingState label="Starting…" />;
  }

  if (orgId) {
    return <LoadingState label="Redirecting…" />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 480, width: "100%" }}>
        <Typography variant="h5" gutterBottom>
          Set organisation
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No organisation is configured. Enter an organisation ID or set{" "}
          <code>NEXT_PUBLIC_DEFAULT_ORG_ID</code> in your environment.
        </Alert>
        <TextField
          fullWidth
          label="Organisation ID"
          value={inputOrgId}
          onChange={(e) => setInputOrgId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          disabled={!inputOrgId.trim()}
          onClick={() => {
            setOrgId(inputOrgId.trim());
            router.push(orgPath(inputOrgId.trim()));
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
