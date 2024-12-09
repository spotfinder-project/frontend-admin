"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import CustomTable from "@/components/ui/CustomTable";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AddFacilityModal from "@/components/facilities/AddFacilityModal";
import useSWR, { mutate } from "swr";
import { Review, ReviewParams, TableData } from "@/types/types";
import qs from "qs";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import ReviewQueryForm from "@/components/reviews/ReviewQueryForm";

type ReviewItem = TableData & Review;

const columns = [
  { id: "nickname", label: "닉네임" },
  { id: "content", label: "리뷰 내용" },
  { id: "type", label: "시설물구분" },
  { id: "facilityId", label: "시설물 ID" },
  { id: "name", label: "시설물명" },
  { id: "location", label: "주소" },
  { id: "createdDate", label: "생성일" },
  { id: "delete", label: "상태" },
];

const rowsPerPageOptions = [
  { value: 10, label: 10 },
  { value: 20, label: 20 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const ReviewsPage: React.FC = () => {
  const router = useRouter();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(0);
  const [reviewParams, setReviewParams] = useState<ReviewParams>({
    page: page + 1,
    size: rowsPerPage,
  });
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const queryString = qs.stringify(reviewParams);
  const { data, isLoading } = useSWR(`/api/reviews?${queryString}`);

  const filterReviews = useCallback(
    (reviews: ReviewItem[]) => {
      return reviews?.filter(
        (item) =>
          item.reviewId.toString().includes(searchQuery) ||
          item.createdDate?.includes(searchQuery) ||
          item.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.facility.facilityId.toString().includes(searchQuery) ||
          item.facility.type
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.facility.location
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.facility.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    [searchQuery]
  );

  useEffect(() => {
    if (data && data.list) {
      console.log(data);
      setReviews(
        data.list.map((review: ReviewItem) => {
          return {
            ...review,
            id: review.reviewId,
            name: review.facility.name,
            location: review.facility.location,
            facilityId: review.facility.facilityId,
            type: review.facility.type,
          };
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
    setFilteredReviews(filterReviews(reviews));
  }, [reviews, searchQuery, filterReviews]);

  useEffect(() => {
    setReviewParams((prev) => ({
      ...prev,
      page: page + 1, // Convert to 1-based index for API call
      size: rowsPerPage,
    }));
  }, [page, rowsPerPage]);

  const handleQueryReviews = async (searchParams: ReviewParams) => {
    setPage(0);
    setReviewParams(() => ({
      ...searchParams,
      page: 1,
      size: rowsPerPage,
    }));
    const queryString = qs.stringify({
      ...searchParams,
      page: 1,
      size: rowsPerPage,
    });
    await mutate(`/api/reviews?${queryString}`);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = async (newPage: number) => {
    setPage(newPage - 1);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = reviews.map((item) => item.id);
      setSelectedReviews(newSelected);
      return;
    }
    setSelectedReviews([]);
  };

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selectedReviews.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedReviews, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedReviews.slice(1));
    } else if (selectedIndex === selectedReviews.length - 1) {
      newSelected = newSelected.concat(selectedReviews.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedReviews.slice(0, selectedIndex),
        selectedReviews.slice(selectedIndex + 1)
      );
    }

    setSelectedReviews(newSelected);
  };

  const handleDelete = async () => {
    try {
      if (!selectedReviews.length) return;
      setLoading(true);
      const response = await fetch(`/api/reviews`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reviewIds: selectedReviews }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.code === "REQ000") {
        toast.success("리뷰를 삭제하였습니다.");

        const queryString = qs.stringify(reviewParams);
        await mutate(`/api/reviews?${queryString}`);
        setSelectedReviews([]);
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("filated to delete the review:", err);
      toast.error("리뷰 삭제를 할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickDelete = (item: TableData) => {
    setSelectedReviews([item.id]);
    setIsDeleteModalOpen(true);
  };

  const handleAddFacility = async () => {
    setIsAddModalOpen(false);
    const queryString = qs.stringify(reviewParams);
    await mutate(`/api/reviews?${queryString}`);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {isLoading && <Loading loading={isLoading} />}
      <ReviewQueryForm clickQueryReviews={handleQueryReviews} />
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
              disabled={selectedReviews.length === 0}
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
          data={filteredReviews}
          selectedRows={selectedReviews}
          rowsPerPage={rowsPerPage}
          page={page}
          onSelectAll={handleSelectAllClick}
          onSelectRow={handleClick}
          onDelete={handleClickDelete}
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
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedReviews([]);
          }}
          message="삭제하시겠습니까?"
        />
      )}

      {isAddModalOpen && (
        <AddFacilityModal
          onClose={() => setIsAddModalOpen(false)}
          onFinishAdd={handleAddFacility}
        />
      )}
      <Loading loading={loading} />
    </div>
  );
};

export default ReviewsPage;
