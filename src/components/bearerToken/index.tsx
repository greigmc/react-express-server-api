import React from "react";
import {
  Alert,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress, // Import the spinner component
} from "@mui/material";
import { useFetchData } from "../../hooks/useBearerData";
import { useLogin } from "../../hooks/useLogin";

const BearerToken: React.FC = () => {
  const { token, error: loginError } = useLogin(); // Get token

  const { data, loading, error: fetchError } = useFetchData(token); // Always call useFetchData

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Optional: Center spinner in the viewport
        }}
      >
        <CircularProgress /> {/* Spinner component */}
      </Container>
    );
  }

  if (loginError || fetchError) {
    return <Alert severity="error">Error: {loginError || fetchError}</Alert>;
  }

  return (
    <Container sx={{ p: 5 }}>
      <div style={{ overflowX: "auto" }}>
        <Typography
          variant="h4"
          sx={{ my: 4, display: "flex", justifyContent: "center" }}
        >
          Axios Fetch API with bearer token authentication
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ border: "1px solid #ddd", p: 5 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <TableCell sx={{ border: "1px solid #ddd" }}>ID</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  First Name
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  Last Name
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Email</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>Phone</TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  Username
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && (
                <TableRow
                  sx={{
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  }}
                >
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {data.id}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {data.firstName}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {data.lastName}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {data.email}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {data.phone}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {data.username}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default BearerToken;
