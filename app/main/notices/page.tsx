"use client";
import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import { useRouter } from "next/navigation";
import NoticeQueryForm from "@/components/notice/NoticeQueryForm";
import NoticeAddModal from "@/components/notice/NoticeAddModal";
import useSWR, { mutate } from "swr";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Notice, NoticeParams } from "@/types/types";
import qs from "qs";
import { handleUpdateNotice } from "@/service/noticeService";

type NoticeItem = {
  id: string;
  [key: string]: any;
};

const columns = [
  { id: "title", label: "제목" },
  { id: "content", label: "공지 내용" },
  { id: "valid", label: "게시 상태" },
  { id: "createdDate", label: "생성일" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

const rowsPerPageOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const ReportPage = () => {
  const router = useRouter();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<NoticeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
  const [isAddNoticeModalOpen, setIsAddNoticeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NoticeItem | null>(null);
  const [noticeSearchParams, setNoticeSearchParams] = useState<NoticeParams>({
    page: page + 1,
    size: rowsPerPage,
  });
  const [totalPages, setTotalPages] = useState(0);
  //  const queryString = qs.stringify(userSearchParams);
  const { data, error } = useSWR(
    `/api/notices?${qs.stringify(noticeSearchParams)}`
  );

  const filterReports = (notices: NoticeItem[]) => {
    return notices.filter((item) =>
      Object.entries(item).some((value) =>
        value[0].toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  useEffect(() => {
    if (data && data.list) {
      setNotices(
        data.list.map((notice: Notice) => {
          return { ...notice, id: notice.noticeId };
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
    setFilteredNotices(filterReports(notices));
  }, [notices, searchQuery]);

  useEffect(() => {
    setNoticeSearchParams((prev) => ({
      ...prev,
      page: page + 1, // Convert to 1-based index for API call
      size: rowsPerPage,
    }));
  }, [page, rowsPerPage]);

  const handleQueryNotices = async (params: NoticeParams) => {
    setPage(0);
    setNoticeSearchParams(() => ({
      ...params,
      page: page + 1, // Convert to 1-based index for API call
      size: rowsPerPage,
    }));
    const queryString = qs.stringify(noticeSearchParams);
    await mutate(`/api/notices?${queryString}`);
  };

  const handleChangeValidValue = async (
    event: ChangeEvent<HTMLSelectElement>,
    item: NoticeItem
  ) => {
    try {
      const response = await handleUpdateNotice({
        noticeId: item.noticeId,
        title: item.title,
        content: item.content,
        valid: event.target.value as "Y" | "N",
      });

      if (response.code === "REQ000")
        await mutate(`/api/notices?${qs.stringify(noticeSearchParams)}`);
    } catch (err) {
      console.error(err);
    }
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
      const newSelected = notices.map((item) => item.id);
      setSelectedNotices(newSelected);
      return;
    }
    setSelectedNotices([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selectedNotices.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedNotices, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedNotices.slice(1));
    } else if (selectedIndex === selectedNotices.length - 1) {
      newSelected = newSelected.concat(selectedNotices.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedNotices.slice(0, selectedIndex),
        selectedNotices.slice(selectedIndex + 1)
      );
    }

    setSelectedNotices(newSelected);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/notices/${itemToDelete?.noticeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",
      });

      if (response.ok) {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        await mutate(`/api/notices?${qs.stringify(noticeSearchParams)}`);
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickNotice = (item: NoticeItem) => {
    console.log("click ", item);
  };

  const handleClickEdit = (item: NoticeItem) => {
    console.log("click edit", item);
    router.push(`/main/notices/${item.noticeId}`);
  };

  const handleClickItemDelete = (item: NoticeItem) => {
    console.log("delete notice item");
    setIsDeleteModalOpen(true);
    setItemToDelete(item);
  };

  const handleCloseModal = async () => {
    await mutate(`/api/notices?${qs.stringify(noticeSearchParams)}`);
    setIsAddNoticeModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <NoticeQueryForm handleQueryNotices={handleQueryNotices} />
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
              className="btn btn-sm  btn-info mt-4"
              onClick={() => setIsAddNoticeModalOpen(true)}
            >
              추가
            </button>
            <button
              className="btn btn-sm  btn-error mt-4 ml-2"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={selectedNotices.length === 0}
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
          data={filteredNotices}
          selectedRows={selectedNotices}
          rowsPerPage={rowsPerPage}
          page={page}
          onSelectAll={handleSelectAllClick}
          onSelectRow={handleClick}
          onEdit={handleClickEdit}
          onDelete={handleClickItemDelete}
          handleChangeTableValue={handleChangeValidValue}
        />

        <div className="flex justify-center items-center p-4">
          <Pagination
            currentPage={page + 1} // Adjusting for one-based index
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </div>

        {isAddNoticeModalOpen && (
          <NoticeAddModal
            isOpen={isAddNoticeModalOpen}
            handleCloseModal={handleCloseModal}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
            message="삭제하시겠습니까?"
          />
        )}
      </div>
    </div>
  );
};

export default ReportPage;
