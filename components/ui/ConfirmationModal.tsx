import React from "react";

interface ConfirmationModalProps {
  itemId: string;
  isOpen: boolean;
  onConfirm: (id: string) => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  itemId,
  isOpen,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">확인</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button className="btn btn-outline btn-secondary" onClick={onCancel}>
            취소
          </button>
          <button className="btn btn-primary" onClick={() => onConfirm(itemId)}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
