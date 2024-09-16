import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal";

interface Props {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const NoticeAddModal = ({ isOpen, handleCloseModal }: Props) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const handleAddNotice = () => {
    console.log(noticeContent);
    console.log(noticeTitle);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmAddNotice = (itemId: string | undefined) => {
    console.log(noticeContent);
  };

  return (
    <div>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            {/* Close Button at Top Right Corner */}
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <div className="grid grid-cols-1 ">
              <div className="form-control">
                <label className="label">상태</label>
                <select
                  className="select select-bordered w-full"
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value as "Y" | "N")}
                >
                  <option value="Y">개시 중</option>
                  <option value="N">개시 중지</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">제목</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">내용</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Modal Footer with Action Buttons */}
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleAddNotice}
                disabled={!noticeContent || !noticeTitle}
              >
                추가
              </button>
              <button className="btn" onClick={handleCloseModal}>
                취소
              </button>
            </div>
          </div>
          {isConfirmationModalOpen && (
            <ConfirmationModal
              isOpen={isConfirmationModalOpen}
              onConfirm={handleConfirmAddNotice}
              onCancel={() => setIsConfirmationModalOpen(false)}
              message="추가하시겠습니까?"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NoticeAddModal;
