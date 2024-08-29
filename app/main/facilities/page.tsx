"use client";
import React, { useState, ChangeEvent, MouseEvent } from "react";
import UserQueryForm from "@/components/users/UserQueryForm";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CusomTable";
import FacilityQueryForm from "@/components/facilities/FacilityQueryForm";

type Facility = {
  id: string;
  [key: string]: any;
};

const initialFacilities: Facility[] = [
  {
    id: "1",
    name: "강남역",
    address: "강남구 역삼동",
    detailedLocation: "테헤란로",
    note: "Google",
    admin: "fdas",
    approved: "N",
    createdDate: "2020-01-01",
    createdBy: "fda",
  },
  {
    id: "2",
    name: "강남역",
    address: "강남구 역삼동",
    detailedLocation: "테헤란로",
    note: "Google",
    admin: "fdas",
    approved: "N",
    createdDate: "2020-01-01",
    createdBy: "fda",
  },
  {
    id: "3",
    name: "강남역",
    address: "강남구 역삼동",
    detailedLocation: "테헤란로",
    note: "Google",
    admin: "fdas",
    approved: "N",
    createdDate: "2020-01-01",
    createdBy: "fda",
  },
  {
    id: "4",
    name: "강남역",
    address: "강남구 역삼동",
    detailedLocation: "테헤란로",
    note: "Google",
    admin: "fdas",
    approved: "N",
    createdDate: "2020-01-01",
    createdBy: "fda",
  },
  // Add more sample users as needed
];

const columns = [
  { id: "id", label: "시설물 ID" },
  { id: "name", label: "시설물명" },
  { id: "address", label: "주소" },
  { id: "detailedLocation", label: "상세위치" },
  { id: "note", label: "추가 설명" },
  { id: "admin", label: "관리부서" },
  { id: "approved", label: "승인상태" },
  { id: "createdDate", label: "생성일" },
  { id: "createdBy", label: "사용자 ID" },
  { id: "edit", label: "Edit" },
];

const rowsPerPageOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

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
      const newSelected = facilities.map((item) => item.id);
      setSelectedFacilities(newSelected);
      return;
    }
    setSelectedFacilities([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selectedFacilities.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedFacilities, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedFacilities.slice(1));
    } else if (selectedIndex === selectedFacilities.length - 1) {
      newSelected = newSelected.concat(selectedFacilities.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedFacilities.slice(0, selectedIndex),
        selectedFacilities.slice(selectedIndex + 1)
      );
    }

    setSelectedFacilities(newSelected);
  };

  const handleDelete = () => {
    setFacilities(
      facilities.filter((item) => !selectedFacilities.includes(item.id))
    );
    setSelectedFacilities([]);
  };

  const handleClickFacility = (item: Facility) => {
    console.log("click ", item);
  };

  const handleClickEdit = (item: Facility) => {
    console.log("click edit", item);
  };

  const filteredFacilitiies = facilities.filter((item) =>
    Object.entries(item).some((value) =>
      value[0].toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredFacilitiies.length / rowsPerPage);

  return (
    <div className="container mx-auto px-4 py-4">
      <FacilityQueryForm />
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
              disabled={selectedFacilities.length === 0}
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
          data={filteredFacilitiies}
          selectedRows={selectedFacilities}
          rowsPerPage={rowsPerPage}
          page={page}
          onSelectAll={handleSelectAllClick}
          onSelectRow={handleClick}
          onEdit={handleClickEdit}
          onItemClick={handleClickFacility}
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

export default FacilitiesPage;
