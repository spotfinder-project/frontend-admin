"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import UserDetailForm from "@/components/users/UserDetail";
import { UserDetail, UserReview, UserFacility } from "@/types/types";
import UserReviewModal from "@/components/users/UserReviewModal";
import Link from "next/link";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { selectTableItems } from "@/utils/util";
import { toast } from "react-toastify";

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

  // const reviews: UserReview[] = [
  //   {
  //     reviewId: 1,
  //     content: "시설물이 청결합니다~",
  //     createdDate: "2024-09-01",
  //     facility: {
  //       facilityId: 1,
  //       type: "R",
  //       name: "쌍문역 내 화장실",
  //       location: "쌍문역",
  //       detailLocation: "지하 1층",
  //       information: "개찰구 내에 존재합니다.",
  //       department: "서울시설공단",
  //       departmentPhoneNumber: "02-2290-7111",
  //       approvalStatus: "A",
  //       createdDate: "2024-09-01",
  //       images: ["string"],
  //     },
  //   },
  // ];
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [selectedReviewIds, setSelectedReviewIds] = useState<number[]>([]);
  const [userData, setUserData] = useState<UserDetail | null>(null);
  const [reviewPage, setReviewPage] = useState(0);
  const [facilityPage, setFacilityPage] = useState(0);
  const [facilities, setFacilities] = useState<UserFacility[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const { id } = useParams();
  const router = useRouter();

  const { data: user, error: userError } = useSWR(`/api/users/${id}`, {
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
  }, [facilityData]);

  useEffect(() => {
    if (reviewData && reviewData.list) {
      // setReviews(reviewData.list);
    }
  }, [reviewData]);

  const handleConfirmDeleteReview = async () => {
    try {
      if (!selectedReviewIds.length) return;

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
  const handleSaveEdit = (updatedContent: string) => {
    console.log("save edit", updatedContent);
    // request update review
    // close modal
    setIsEditModalOpen(false);
    //fetch user review
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
    </div>
  );
};

export default UserDetailPage;
