"use client";
import React, { useState, ChangeEvent, MouseEvent } from "react";
import UserQueryForm from "@/components/users/UserQueryForm";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import { useRouter } from "next/navigation";
import { getUsers } from "@/service/userService";

type User = {
  id: string;
  [key: string]: any;
};

const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    gender: "Male",
    birthDate: "1990-01-01",
    socialLogin: "Google",
    createdDate: "2020-01-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    gender: "Female",
    birthDate: "1985-05-15",
    socialLogin: "Facebook",
    createdDate: "2019-03-22",
  },
  {
    id: "3",
    name: "Jane Smith 2",
    gender: "Female",
    birthDate: "1985-05-15",
    socialLogin: "Facebook",
    createdDate: "2019-03-22",
  },
  {
    id: "4",
    name: "Jane Smith 3",
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
  { id: "edit", label: "Edit" },
];

const rowsPerPageOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const UserManagementPage: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage - 1);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users.map((user) => user.id);
      setSelectedUsers(newSelected);
      return;
    }
    setSelectedUsers([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected: string[] = [];

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

  const handleClickUser = (user: User) => {
    console.log("click user", user);
  };

  const handleClickEdit = (user: User) => {
    console.log("click edit", user);
    router.push(`/main/users/${user.id}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.birthDate.includes(searchQuery) ||
      user.socialLogin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.createdDate.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="container mx-auto px-4 py-4">
      <UserQueryForm />
      <div className="mt-4 bg-base-100 shadow-lg rounded-lg">
        <div className="flex justify-between items-center p-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="input input-bordered w-1/3"
          />
          <div className="flex items-end">
            <button
              className="btn btn-sm  btn-error mt-4"
              onClick={handleDelete}
              disabled={selectedUsers.length === 0}
            >
              Delete
            </button>

            <div className="form-control ml-4">
              <div className="label pb-0">
                <span className="label-text">페이지 당 개수</span>
              </div>
              <select
                className="select select-bordered select-sm"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                {rowsPerPageOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === 0}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={filteredUsers}
          selectedRows={selectedUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onSelectAll={handleSelectAllClick}
          onSelectRow={handleClick}
          onEdit={handleClickEdit}
          onItemClick={handleClickUser}
        />

        <div className="flex justify-center items-center p-4">
          <Pagination
            currentPage={page + 1} // Adjusting for one-based index
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
