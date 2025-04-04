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
  } from "@mui/material";
  import { useFetchData } from "../../hooks/useFetchData";
  
  const FetchTable: React.FC = () => {
    const { data: posts, loading, error } = useFetchData("/api/users");
  
    if (loading) {
      return <Alert severity="info">Loading...</Alert>;
    }
    if (error) {
      return <Alert severity="error">Error: {error.message}</Alert>;
    }
  
    return (
      <Container sx={{ my: 5 }}>
        <Typography
          variant="h4"
          sx={{ display: "flex", justifyContent: "center", mb: 3 }}
        >
          Fetch API
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table sx={{ border: "1px solid #ddd", p: 5 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Avatar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow
                    key={post.id}
                    sx={{ "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{post.id}</TableCell>
                    <TableCell>{post.first_name}</TableCell>
                    <TableCell>{post.last_name}</TableCell>
                    <TableCell>{post.email}</TableCell>
                    <TableCell>
                      <img
                        src={post.avatar}
                        alt={`${post.first_name} ${post.last_name}`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  };
  
  export default FetchTable;
  