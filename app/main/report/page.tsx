"use client";
import React, {
  useState,
  ChangeEvent,
  MouseEvent,
  useEffect,
  use,
  useCallback,
} from "react";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import { useRouter } from "next/navigation";
import ReportQueryForm from "@/components/report/ReportQueryForm";
import useSWR from "swr";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Report, ReportParams } from "@/types/types";
import qs from "qs";
import Loading from "@/components/ui/Loading";

//NOTE: 테스트 필요

type ReportItem = {
  id: string;
  [key: string]: any;
};

const initialReports: ReportItem[] = [
  {
    id: "1",
    memberId: "userId",
    content: "위치가 틀립니다",
    facilityId: "fdafd",
    status: "N",
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [reportSearchParams, setReportSearchParams] = useState<ReportParams>({
    page: page + 1,
    size: rowsPerPage,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const queryString = qs.stringify(reportSearchParams);
  const [totalPages, setTotalPages] = useState(0);
  const { data, error, mutate, isLoading } = useSWR(
    `/api/reports?${queryString}`,
    {}
  );
  useEffect(() => {
    console.log(data);
    if (data && data.list) {
      setReports(
        data.list.map((report: Report) => {
          return { ...report, id: report.reportId };
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
    setReportSearchParams((prev) => ({
      ...prev,
      page: page + 1,
      size: rowsPerPage,
    }));
  }, [page, rowsPerPage]);

  const handleQueryReports = async (searchParams: ReportParams) => {
    setReportSearchParams(() => ({
      ...searchParams,
      page: page + 1,
      size: rowsPerPage,
    }));
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

  const handleClickEdit = (item: ReportItem) => {
    router.push(`/main/report/${item.reportId}`);
  };

  const filterReports = useCallback(
    (reports: ReportItem[]) => {
      return reports?.filter(
        (item) =>
          item.reportId.toString().includes(searchQuery) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status.toString().includes(searchQuery) ||
          item.memberId.toString().includes(searchQuery) ||
          item.facilityId.toString().includes(searchQuery) ||
          item.createdDate.includes(searchQuery)
      );
    },
    [searchQuery]
  );

  useEffect(() => {
    const filtered = filterReports(reports);
    setFilteredReports(filtered);
  }, [reports, searchQuery, filterReports]);

  return (
    <div className="container mx-auto px-4 py-4">
      {isLoading && <Loading loading={isLoading} />}
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
          rowsPerPage={rowsPerPage}
          page={page}
          onEdit={handleClickEdit}
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

export default ReportPage;
