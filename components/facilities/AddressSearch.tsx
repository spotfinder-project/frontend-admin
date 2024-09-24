import { useState, useEffect } from "react";

interface Props {
  facilityAddress: string;
  isEditing?: boolean;
  updateAddress: (address: string) => void;
}

export default function AddressSearch({
  facilityAddress,
  isEditing,
  updateAddress,
}: Props) {
  const [address, setAddress] = useState<string>(facilityAddress);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isPostcodeOpen) {
      new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
          setAddress(data.address);
          updateAddress(data.address);
          setIsPostcodeOpen(false); // Close the postcode layer
        },
        width: "100%",
        height: "100%",
      }).embed(document.getElementById("postcode-container"));
    }
  }, [isPostcodeOpen]);

  return (
    <div className="form-control">
      <label className="label">주소</label>
      <div className="flex">
        <input
          type="text"
          className="input input-bordered flex-grow"
          value={address}
          placeholder="주소를 입력해주세요"
          readOnly
          disabled={!isEditing}
        />
        <button
          className="btn btn-primary ml-2"
          onClick={() => setIsPostcodeOpen(true)}
          disabled={!isEditing}
        >
          주소 검색
        </button>
      </div>

      {isPostcodeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <div className="relative">
              <button
                className="absolute top-[-30px] right-0 mt-2 mr-2 z-10"
                onClick={() => setIsPostcodeOpen(false)}
              >
                닫기
              </button>
              <div
                id="postcode-container"
                className="mt-6 w-full h-[400px]"
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
