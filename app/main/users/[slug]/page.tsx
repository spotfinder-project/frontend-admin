"use client";
import React, { cache, useEffect, useState } from "react";
import { getUserBySlug } from "@/service/userService";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import UserDetail from "@/components/users/UserDetail";
import { User, Review } from "@/types/types";
import UserReviewModal from "@/components/users/UserReviewModal";

interface Props {
  params: {
    slug: string;
  };
}

const getCacheUserBySlug = cache(
  async (slug: string) => await getUserBySlug({ slug })
);

const UserDetailPage = ({ params: { slug } }: Props) => {
  // useEffect(() => {
  //   getCacheUserBySlug(slug);
  // }, []);

  const userData: User = {
    userId: "userId",
    name: "name",
    nickname: "abcd",
    birthdate: "1991-08-08",
    sex: "F",
    email: "abcd@naver.com",
    socialLoginType: "Naver",
    createdDate: "2024-08-01",
    facilities: [
      {
        facilityType: "쓰레기통",
        id: "1",
        name: "Facility 1",
        address: "123 Main St",
        detailedLocation: "Room 101",
        note: "Near the entrance",
        admin: "Maintenance",
        approved: "Yes",
        approvedDate: "2023-02-01",
      },
      // Add more facility data as needed
    ],
    reviews: [
      {
        id: "1",
        content: "Great place!",
        facilityType: "Gym",
        facilityId: "1",
        facilityName: "Gym 1",
        address: "123 Main St",
        createdDate: "2023-03-01",
      },
      // Add more review data as needed
    ],
  };

  const { facilities, reviews } = userData;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const handleDeleteReview = (id: string) => {
    setIsDeleteModalOpen(true);
    setSelectedReviewId(id);
  };

  const handleConfirmDelete = (id: string) => {
    // request delete review

    handleCloseDelete();
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedReviewId(null);
  };

  const handleEditReview = (review: Review) => {
    setIsEditModalOpen(true);
    setSelectedReview(review);
  };

  const handleCloseEdit = () => {
    setIsDeleteModalOpen(false);
    setSelectedReview(null);
  };
  const handleSaveEdit = (updatedContent: string) => {
    console.log("save edit", updatedContent);
    // request update review
  };
  return (
    <div className="container mx-auto p-6">
      {/* User Details */}
      <UserDetail user={userData} />

      {/* Facilities Table */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">등록한 시설물</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>구분</th>
                <th>시설물 ID</th>
                <th>시설물명</th>
                <th>주소</th>
                <th>상세위치</th>
                <th>추가 설명</th>
                <th>관리부서</th>
                <th>승인상태</th>
                <th>승인일자</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.id}>
                  <td>{facility.facilityType}</td>
                  <td>{facility.id}</td>
                  <td>{facility.name}</td>
                  <td>{facility.address}</td>
                  <td>{facility.detailedLocation}</td>
                  <td>{facility.note}</td>
                  <td>{facility.admin}</td>
                  <td>{facility.approved}</td>
                  <td>{facility.approvedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">등록한 리뷰</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Review Content</th>
                <th>Facility Type</th>
                <th>Facility ID</th>
                <th>Facility Name</th>
                <th>Address</th>
                <th>Created Date</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.content}</td>
                  <td>{review.facilityType}</td>
                  <td>{review.facilityId}</td>
                  <td>{review.facilityName}</td>
                  <td>{review.address}</td>
                  <td>{review.createdDate}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isDeleteModalOpen && selectedReviewId && (
            <ConfirmationModal
              itemId={selectedReviewId}
              isOpen={isDeleteModalOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCloseDelete}
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
