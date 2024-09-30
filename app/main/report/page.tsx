"use client";
import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import { useRouter } from "next/navigation";
import ReportQueryForm from "@/components/report/ReportQueryForm";
import useSWR from "swr";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Report, ReportParams } from "@/types/types";
import qs from "qs";

type ReportItem = {
  id: string;
  [key: string]: any;
};

const initialReports: ReportItem[] = [
  {
    id: "1",
    userId: "userId",
    reportContent: "위치가 틀립니다",
    facilityId: "fdafd",
    resolved: "N",
    createdDate: "2024-01-01",
  },
];

const columns = [
  { id: "memberId", label: "신고자 ID" },
  { id: "content", label: "신고 내용" },
  { id: "facilityId", label: "시설물 ID" },
  { id: "status", label: "상태" },
  { id: "createdDate", label: "생성일" },
  { id: "edit", label: "Edit" },
];

const rowsPerPageOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const ReportPage: React.FC = () => {
  const router = useRouter();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportItem[]>([]);
  const [reportSearchParams, setReportSearchParams] = useState<ReportParams>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryString = qs.stringify(reportSearchParams);
  const { data, error, mutate } = useSWR(`/api/reports?${queryString}`, {
    onError: (error, key) => {
      if (error.code === 401) {
        console.log(error);
        // router.push("/");
      }
    },
  });
  useEffect(() => {
    if (data && data.list) {
      setReports(
        data.list.map((report: Report) => {
          return { ...report, id: report.reportId };
        })
      );
    }
  }, [data]);
  console.log(data);

  useEffect(() => {
    setFilteredReports(filterReports(reports));
  }, [reports, searchQuery]);

  // const handleChangeResolvedType = (event: ChangeEvent<HTMLSelectElement>) => {
  //   console.log(event.target.value);

  //   // setResolvedType(event.target.value);
  // };
  const handleQueryReports = async (searchParams: ReportParams) => {
    setReportSearchParams(searchParams);
    const queryString = qs.stringify(reportSearchParams);
    await mutate(`/api/reports?${queryString}`);
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
      const newSelected = reports.map((item) => item.id);
      setSelectedReports(newSelected);
      return;
    }
    setSelectedReports([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selectedReports.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedReports, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedReports.slice(1));
    } else if (selectedIndex === selectedReports.length - 1) {
      newSelected = newSelected.concat(selectedReports.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedReports.slice(0, selectedIndex),
        selectedReports.slice(selectedIndex + 1)
      );
    }

    setSelectedReports(newSelected);
  };

  const handleDelete = () => {
    console.log(selectedReports);
    // setReports(reports.filter((item) => !selectedReports.includes(item.id)));
    // setSelectedReports([]);
  };

  const handleClickFacility = (item: ReportItem) => {
    console.log("click ", item);
  };

  const handleClickEdit = (item: ReportItem) => {
    console.log("click edit", item);
    router.push(`/main/report/${item.reportId}`);
  };

  const filterReports = (reports: ReportItem[]) => {
    return reports?.filter((item) => {
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.facilityId.toString().includes(searchQuery) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.memberId.toString().includes(searchQuery) ||
        item.createdDate.includes(searchQuery);
    });
  };

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  return (
    <div className="container mx-auto px-4 py-4">
      <ReportQueryForm clickQueryReports={handleQueryReports} />
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
              disabled={selectedReports.length === 0}
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
          data={filteredReports}
          selectedRows={selectedReports}
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
    </div>
  );
};

export default ReportPage;
