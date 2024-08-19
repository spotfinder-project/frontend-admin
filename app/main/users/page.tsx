"use client";
import React, { useState, ChangeEvent, MouseEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Toolbar,
  SelectChangeEvent,
} from "@mui/material";

type User = {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  socialLogin: string;
  createdDate: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    gender: "Male",
    birthDate: "1990-01-01",
    socialLogin: "Google",
    createdDate: "2020-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    gender: "Female",
    birthDate: "1985-05-15",
    socialLogin: "Facebook",
    createdDate: "2019-03-22",
  },
  // Add more sample users as needed
];

const columns = [
  { id: "id", label: "User ID" },
  { id: "name", label: "Name" },
  { id: "gender", label: "Gender" },
  { id: "birthDate", label: "Birth Date" },
  { id: "socialLogin", label: "Social Login" },
  { id: "createdDate", label: "Created Date" },
];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users.map((user) => user.id);
      setSelectedUsers(newSelected);
      return;
    }
    setSelectedUsers([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelected);
  };

  const handleDelete = () => {
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.birthDate.includes(searchQuery) ||
      user.socialLogin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.createdDate.includes(searchQuery)
  );

  return (
    <div className="container mx-auto px-4 py-4">
      <Paper>
        <Toolbar className="flex justify-between">
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-1/3"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            disabled={selectedUsers.length === 0}
          >
            Delete
          </Button>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedUsers.length > 0 &&
                      selectedUsers.length < users.length
                    }
                    checked={
                      users.length > 0 && selectedUsers.length === users.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    role="checkbox"
                    aria-checked={selectedUsers.indexOf(user.id) !== -1}
                    selected={selectedUsers.indexOf(user.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.indexOf(user.id) !== -1}
                        onChange={(event) => handleClick(event, user.id)}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {(user as any)[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-between items-center p-4">
          <FormControl variant="outlined" className="w-1/4">
            <InputLabel>Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={(e) => handleChangeRowsPerPage(e as any)}
              label="Rows per page"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </div>
  );
};

export default UserManagementPage;
