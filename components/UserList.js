// components/UserListComponent.js
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Menu,
  MenuItem as ActionMenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataContext } from "../context/DataContext";

const UserListComponent = () => {
  const { getData } = useContext(DataContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/list-forms`;

  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json(); // Parse the JSON response
        console.log("API Response:", data); // Log the entire response to debug

        if (data && Array.isArray(data.data)) {
          setUsers(data.data); // Expecting `data.data` to be an array of users
        } else {
          console.error("Invalid data format received from the API:", data);
        }
      } catch (error) {
        console.error("Error fetching data from the database:", error);
      }
    };

    fetchDataFromDB();
  }, []); // Run once on component mount

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleActionClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleActionSelect = (action) => {
    console.log(`Action: ${action} for user:`, selectedUser);
    handleActionClose();
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <TextField
          placeholder="Search by name..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Select
            value={status}
            onChange={handleStatusChange}
            displayEmpty
            size="small"
            sx={{ width: "150px" }}
          >
            <MenuItem value="">Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          <Button variant="contained" color="success">
            Add New
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Web ID</TableCell>
              <TableCell>Phone</TableCell>

              <TableCell>Visa Type</TableCell>
              <TableCell>OTP</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Link</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.sl}>
                  <TableCell>{user.sl}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.web_id}</TableCell>
                  <TableCell>{user.phone}</TableCell>

                  <TableCell>{user.visa_type.type_name}</TableCell>
                  <TableCell>{"waiting"}</TableCell>
                  <TableCell>{"waiting"}</TableCell>
                  <TableCell>
                    {user.payment_link === "Waiting" ? (
                      "Waiting"
                    ) : (
                      <a
                        href={user.payment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        waiting
                      </a>
                    )}
                  </TableCell>
                  <TableCell>{user.is_open ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleActionClick(event, user)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleActionClose}
                    >
                      <ActionMenuItem
                        onClick={() => handleActionSelect("view")}
                      >
                        View
                      </ActionMenuItem>
                      <ActionMenuItem
                        onClick={() => handleActionSelect("start")}
                      >
                        Start
                      </ActionMenuItem>
                      <ActionMenuItem
                        onClick={() => handleActionSelect("delete")}
                      >
                        Delete
                      </ActionMenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Typography variant="body2">Total {users.length} users</Typography>
        <Box>
          <Typography
            variant="body2"
            component="span"
            sx={{ marginRight: "10px" }}
          >
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
            size="small"
            sx={{ width: "80px" }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default UserListComponent;
