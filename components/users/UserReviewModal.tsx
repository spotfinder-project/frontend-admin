import React from "react";
import { UserReview } from "@/types/types";

interface UserReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: UserReview;
  onSave: (updatedContent: string) => void;
}

const UserReviewModal: React.FC<UserReviewModalProps> = ({
  isOpen,
  onClose,
  review,
  onSave,
}) => {
  const [updatedContent, setUpdatedContent] = React.useState<string>(
    review.content
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(updatedContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-lg font-semibold mb-4">리뷰 수정</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Review ID</label>
            <input
              type="text"
              value={review.reviewId}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Facility Type</label>
            <input
              type="text"
              value={review.facility.type}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Facility ID</label>
            <input
              type="text"
              value={review.facility.facilityId}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Facility Name</label>
            <input
              type="text"
              value={review.facility.name}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="label">Address</label>
            <input
              type="text"
              value={review.facility.location}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="label">Created Date</label>
            <input
              type="text"
              value={review.facility.createdDate}
              disabled
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="label">Review Content</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button className="btn btn-outline btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReviewModal;
