"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import UserDetailForm from "@/components/users/UserDetail";
import { UserDetail, UserReview, UserFacility } from "@/types/types";
import UserReviewModal from "@/components/users/UserReviewModal";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
import { selectTableItems } from "@/utils/util";
import { toast } from "react-toastify";
import Pagination from "@/components/ui/Pagination";
import Loading from "@/components/ui/Loading";

const UserDetailPage = () => {
  const facilityColumns = [
    { id: "facilityId", label: "시설물 ID" },
    { id: "type", label: "시설물 구분" },
    { id: "name", label: "시설물명" },
    { id: "location", label: "주소" },
    { id: "detailLocation", label: "상세위치" },
    { id: "information", label: "추가 설명" },
    { id: "approvalStatus", label: "승인상태" },
    { id: "approvalDate", label: "승인날짜" },
    { id: "view", label: "View" },
  ];

  const reviewColumns = [
    { id: "content", label: "내용" },
    { id: "type", label: "시설물 구분" },
    { id: "facilityId", label: "시설명 ID" },
    { id: "name", label: "시설물명" },
    { id: "location", label: "주소" },
    { id: "createdDate", label: "생성일" },
    { id: "edit", label: "Edit" },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [selectedReviewIds, setSelectedReviewIds] = useState<number[]>([]);
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<UserFacility[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const { id } = useParams();
  const router = useRouter();

  /** 페이지 관련 */
  const [reviewPage, setReviewPage] = useState(0);
  const [facilityPage, setFacilityPage] = useState(0);
  const [totalReviewPages, setTotalReviewPages] = useState(0);
  const [totalFacilityPages, setTotalFacilityPages] = useState(0);

  const {
    data: user,
    error: userError,
    isLoading,
  } = useSWR(`/api/users/${id}`, {
    onError: (error, key) => {
      if (error.code === 401) {
        router.push("/");
      }
    },
  });

  const { data: facilityData, error: facilityError } = useSWR(
    `/api/users/facilities?memberId=${id}&page=${facilityPage}&size=10`
  );

  const { data: reviewData, error: reviewError } = useSWR(
    `/api/users/reviews?memberId=${id}&page=${reviewPage}&size=10`
  );

  useEffect(() => {
    if (user) {
      setUserData(user.data);
    }
  }, [user]);

  useEffect(() => {
    if (facilityData && facilityData.list) {
      setFacilities(facilityData.list);
    }

    if (facilityData && facilityData.page) {
      setTotalFacilityPages(facilityData.page.totalPages);
    } else if (facilityData && !facilityData.page) {
      setTotalFacilityPages(1);
    }
  }, [facilityData]);

  useEffect(() => {
    if (reviewData && reviewData.list) {
      setReviews(reviewData.list);
    }

    if (reviewData && reviewData.page) {
      setTotalReviewPages(reviewData.page.totalPages);
    } else if (reviewData && !reviewData.page) {
      setTotalReviewPages(1);
    }
  }, [reviewData]);

  const handleConfirmDeleteReview = async () => {
    try {
      if (!selectedReviewIds.length) return;
      setLoading(true);
      const response = await fetch(`/api/users/reviews`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reviewIds: selectedReviewIds }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.code === "REQ000") {
        toast.success("리뷰를 삭제하였습니다.");
        handleCloseDeleteReview();
      }
    } catch (err) {
      console.error("filated to delete the review:", err);
      toast.error("리뷰 삭제를 할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteReview = () => {
    setIsDeleteModalOpen(false);
    setSelectedReviewIds([]);
  };

  const handleEditReview = (review: UserReview) => {
    setIsEditModalOpen(true);
    setSelectedReview(review);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedReview(null);
  };
  const handleSaveEdit = async (updatedContent: string) => {
    try {
      if (!selectedReview || !updatedContent) {
        toast.error("선택된 리뷰나 내용이 존재하지 않습니다.");
        return;
      }
      setLoading(true);
      const response = await fetch(`/api/users/reviews`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reviewId: selectedReview?.reviewId,
          content: updatedContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.code === "REQ000") {
        toast.success("리뷰를 삭제하였습니다.");
        handleCloseEdit();
        await mutate(
          `/api/users/reviews?memberId=${id}&page=${reviewPage}&size=10`
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("리뷰를 수정할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
    //NOTE: test 필요
  };

  const handleSelectAllReviews = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = reviews.map((item: UserReview) => item.reviewId);
      setSelectedReviewIds(newSelected);
      return;
    }
    setSelectedReviewIds([]);
  };

  const handleSelectReview = (
    event: ChangeEvent<HTMLInputElement>,
    reviewId: number
  ) => {
    setSelectedReviewIds(
      selectTableItems(reviewId, selectedReviewIds) as number[]
    );
  };

  if (isLoading) return <Loading loading={isLoading} />;

  return (
    <div className="container mx-auto p-6">
      {/* User Details */}
      <UserDetailForm user={userData as UserDetail} />

      {/* Facilities Table */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">등록한 시설물</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {facilityColumns.map((column) => (
                  <th key={column.id}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilities?.map((facility: UserFacility) => (
                <tr key={facility.facilityId}>
                  <td>{facility.type}</td>
                  <td>{facility.facilityId}</td>
                  <td>{facility.name}</td>
                  <td>{facility.location}</td>
                  <td>{facility.detailLocation}</td>
                  <td>{facility.information}</td>
                  <td>{facility.approvalStatus}</td>
                  <td>{facility.approvalDate}</td>
                  <td>
                    <Link href={`/main/facilities/${facility.facilityId}`}>
                      <button className="btn btn-sm btn-primary">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center p-4">
            <Pagination
              currentPage={facilityPage + 1} // Adjusting for one-based index
              totalPages={totalFacilityPages}
              onPageChange={(newPage: number) => setFacilityPage(newPage - 1)}
            />
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">등록한 리뷰</h2>
          <button
            className="btn btn-sm  btn-error mt-4"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedReviewIds.length === 0}
          >
            Delete
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={
                      reviews.length > 0 &&
                      selectedReviewIds.length === reviews.length
                    }
                    // Optionally, handle indeterminate state
                    onChange={handleSelectAllReviews}
                  />
                </th>
                {reviewColumns.map((column) => (
                  <th key={column.id}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={
                        selectedReviewIds.indexOf(review.reviewId) !== -1
                      }
                      onChange={(event) =>
                        handleSelectReview(event, review.reviewId)
                      }
                    />
                  </td>
                  <td>{review.content}</td>
                  <td>{review.facility.type}</td>
                  <td>{review.facility.facilityId}</td>
                  <td>{review.facility.name}</td>
                  <td>{review.facility.location}</td>
                  <td>{review.createdDate}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center p-4">
            <Pagination
              currentPage={reviewPage + 1} // Adjusting for one-based index
              totalPages={totalReviewPages}
              onPageChange={(newPage: number) => setReviewPage(newPage - 1)}
            />
          </div>
          {isDeleteModalOpen && selectedReviewIds.length > 0 && (
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onConfirm={handleConfirmDeleteReview}
              onCancel={() => setIsDeleteModalOpen(false)}
              message="정말 삭제하시겠습니까?"
            />
          )}

          {isEditModalOpen && selectedReview && (
            <UserReviewModal
              isOpen={isEditModalOpen}
              review={selectedReview}
              onClose={handleCloseEdit}
              onSave={handleSaveEdit}
            />
          )}
        </div>
      </div>
      <Loading loading={loading} />
    </div>
  );
};

export default UserDetailPage;
