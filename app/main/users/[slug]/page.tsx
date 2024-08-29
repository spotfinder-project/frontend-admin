"use client";
import React, { cache, useEffect, useState } from "react";
import { getUserBySlug } from "@/service/userService";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import UserDetail from "@/components/users/UserDetail";
import { User, Review, Facility } from "@/types/types";
import UserReviewModal from "@/components/users/UserReviewModal";
import CustomTable from "@/components/ui/CusomTable";
import Link from "next/link";

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

  const facilityColumns = [
    { id: "id", label: "시설물 ID" },
    { id: "name", label: "시설물명" },
    { id: "address", label: "주소" },
    { id: "detailedLocation", label: "상세위치" },
    { id: "note", label: "추가 설명" },
    { id: "admin", label: "관리부서" },
    { id: "approved", label: "승인상태" },
    { id: "createdDate", label: "생성일" },
    { id: "createdBy", label: "사용자 ID" },
    { id: "view", label: "View" },
  ];

  const reviewColumns = [
    { id: "content", label: "내용" },
    { id: "facilityType", label: "시설물 구분" },
    { id: "facilityName", label: "시설물명" },
    { id: "facilityId", label: "시설명 ID" },
    { id: "address", label: "주소" },
    { id: "createdDate", label: "생성일" },
    { id: "edit", label: "Edit" },
    { id: "delete", label: "Delete" },
  ];

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

  const handleViewFacility = (item: Facility) => {
    console.log(item);
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
                {facilityColumns.map((column) => (
                  <th>{column.label}</th>
                ))}
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
                  <td>
                    <Link href={`/main/facilities/${facility.id}`}>
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
        <h2 className="text-xl font-semibold mb-4">등록한 리뷰</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {reviewColumns.map((column) => (
                  <th>{column.label}</th>
                ))}
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
