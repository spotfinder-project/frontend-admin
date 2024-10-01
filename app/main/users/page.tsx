"use client";
import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import UserQueryForm from "@/components/users/UserQueryForm";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import { useRouter } from "next/navigation";
import { UserParams } from "@/types/types";
import useSWR, { mutate } from "swr";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import qs from "qs";
import { selectTableItems } from "@/utils/util";

type User = {
  id: string;
  [key: string]: any;
};

const columns = [
  { id: "id", label: "Member ID" },
  { id: "gender", label: "Gender" },
  { id: "socialType", label: "Social Login" },
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

  const [users, setUsers] = useState<User[]>([]); //api response
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userSearchParams, setUserSearchParams] = useState<UserParams>({
    page: page + 1,
    size: rowsPerPage,
  });
  const queryString = qs.stringify(userSearchParams);
  const { data, error } = useSWR(`/api/users?${queryString}`, {
    onError: (error, key) => {
      if (error.code === 401) {
        router.push("/");
      }
    },
  });

  const filterUsers = (users: User[]) => {
    return users?.filter(
      (user) =>
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.socialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.memberId.toString().includes(searchQuery) ||
        user.createdDate.includes(searchQuery)
    );
  };

  useEffect(() => {
    if (data && data.list) {
      setUsers(
        data.list.map((user: User) => {
          return { ...user, id: user.memberId };
        })
      );
    }

    if (data && data.page) {
      setTotalPages(data.page.totalPages);
    } else if (data && !data.page) {
      setTotalPages(1);
    }
  }, [data]);

  useEffect(() => {
    setFilteredUsers(filterUsers(users));
  }, [users, searchQuery]);

  useEffect(() => {
    setUserSearchParams((prev) => ({
      ...prev,
      page: page + 1, // Convert to 1-based index for API call
      size: rowsPerPage,
    }));
  }, [page, rowsPerPage]);

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const handleQueryUsers = async (searchParams: UserParams) => {
    setUserSearchParams(() => ({
      ...searchParams,
      page: page + 1,
      size: rowsPerPage,
    }));
    const queryString = qs.stringify(userSearchParams);
    await mutate(`/api/members?${queryString}`);
  };

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
      const newSelected = users.map((user: User) => user.memberId);
      setSelectedUsers(newSelected);
      return;
    }
    setSelectedUsers([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    setSelectedUsers(selectTableItems(id, selectedUsers) as string[]);
  };

  const handleDelete = () => {
    console.log(selectedUsers);
    // call delete api
    // close modal
    setIsDeleteModalOpen(false);
    // fetch users
  };

  const handleClickUser = (user: User) => {
    console.log("click user", user);
  };

  const handleClickEdit = (user: User) => {
    console.log("click edit", user);
    router.push(`/main/users/${user.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <UserQueryForm clickQueryUsers={handleQueryUsers} />
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
              onClick={() => setIsDeleteModalOpen(true)}
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

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          message="삭제하시겠습니까?"
        />
      )}
    </div>
  );
};

export default UserManagementPage;
