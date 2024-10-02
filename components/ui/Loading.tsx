import React from "react";
import { SyncLoader } from "react-spinners";

interface LoadingSpinnerProps {
  loading: boolean;
}

export default function LoadingSpinner({ loading }: LoadingSpinnerProps) {
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <SyncLoader color="#6ca7f6" size={30} />
        </div>
      )}
    </>
  );
}
