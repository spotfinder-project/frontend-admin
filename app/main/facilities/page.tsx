"use client";
import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import FacilityQueryForm from "@/components/facilities/FacilityQueryForm";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AddFacilityModal from "@/components/facilities/AddFacilityModal";
import useSWR, { mutate } from "swr";
import { FacilityParams } from "@/types/types";
import qs from "qs";

type Facility = {
  id: string;
  [key: string]: any;
};

const columns = [
  { id: "facilityId", label: "시설물 ID" },
  { id: "name", label: "시설물명" },
  { id: "location", label: "주소" },
  { id: "detailedLocation", label: "상세위치" },
  { id: "information", label: "추가 설명" },
  { id: "department", label: "관리부서" },
  { id: "approvalStatus", label: "승인상태" },
  { id: "createdDate", label: "생성일" },
  { id: "memberId", label: "사용자 ID" },
  { id: "edit", label: "Edit" },
];

const rowsPerPageOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const FacilitiesPage: React.FC = () => {
  const router = useRouter();
  const [facilityParams, setFacilityParams] = useState<FacilityParams>({});
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilitiies, setFilteredFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryString = qs.stringify(facilityParams);
  const { data, error } = useSWR(`/api/facilities?${queryString}`, {
    onError: (error, key) => {
      if (error.code === 401) {
        router.push("/");
      }
    },
  });

  useEffect(() => {
    if (data && data.list) {
      setFacilities(
        data.list.map((facility: Facility) => {
          return { ...facility, id: facility.facilityId };
        })
      );
    }
  }, [data]);

  useEffect(() => {
    setFilteredFacilities(filterFacilities(facilities));
  }, [facilities, searchQuery]);

  const handleQueryFacilities = async (searchParams: FacilityParams) => {
    setFacilityParams(searchParams);
    const queryString = qs.stringify(facilityParams);
    await mutate(`/api/facilities?${queryString}`);
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
    console.log(selectedFacilities);

    setSelectedFacilities([]);
    setIsDeleteModalOpen(false);
  };

  const handleClickFacility = (item: Facility) => {
    console.log("click ", item);
  };

  const handleClickEdit = (item: Facility) => {
    router.push(`/main/facilities/${item.id}`);
  };

  const filterFacilities = (facilities: Facility[]) => {
    return facilities?.filter(
      (item) =>
        item.facilityId.toString().includes(searchQuery) ||
        item.createdDate?.includes(searchQuery) ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detailLocation
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.information?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.approvalStatus?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const totalPages = Math.ceil(filteredFacilitiies.length / rowsPerPage);

  return (
    <div className="container mx-auto px-4 py-4">
      <FacilityQueryForm clickQueryFacilities={handleQueryFacilities} />
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
              className="btn btn-sm  btn-secondary mt-4 mr-2"
              onClick={() => setIsAddModalOpen(true)}
            >
              시설물 등록
            </button>
            <button
              className="btn btn-sm  btn-error mt-4"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={selectedFacilities.length === 0}
            >
              삭제
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
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          message="삭제하시겠습니까?"
        />
      )}

      {isAddModalOpen && (
        <AddFacilityModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default FacilitiesPage;
