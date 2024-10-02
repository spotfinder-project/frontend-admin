import { ChangeEvent, useState } from "react";
import AddressSearch from "./AddressSearch";
import Image from "next/image";
import { toast } from "react-toastify";
import { FacilityAdd } from "@/types/types";
import { getCoordinatesFromAddress } from "@/service/geoService";
import { addFacility } from "@/service/facilityService";
import { handleImageUpload } from "@/utils/util";

type Props = {
  onClose: () => void;
  onFinishAdd: () => void;
};

type Images = {
  id: number;
  preview: string;
};
export default function AddFacilityModal({ onClose, onFinishAdd }: Props) {
  const [type, setType] = useState<"R" | "S" | "T">("R");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [detailLocation, setDetailLocation] = useState("");
  const [information, setInformation] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentPhoneNumber, setDepartmentPhoneNumber] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<"R" | "S" | "P" | "A">(
    "A"
  );
  const [images, setImages] = useState<string[]>([]);
  const [imageData, setImageData] = useState<File[]>([]);
  const updateLocation = (location: string) => {
    setLocation(location);
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const getImageIds = async () => {
    try {
      if (!imageData.length) return null;
      const formData = new FormData();
      imageData.forEach((file) => {
        formData.append("images", file);
      });
      const response = await fetch("/api/facilities/images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("이미지 등록에 실패하였습니다.");
        return null;
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddFacility = async () => {
    try {
      const imageResult = await getImageIds();
      const imageIds = imageResult?.data?.imageIds ?? [];

      console.log(location);

      const geoData = await getCoordinatesFromAddress(location);

      const params: FacilityAdd = {
        type,
        name,
        location,
        detailLocation,
        latitude: parseFloat(geoData?.latitude),
        longitude: parseFloat(geoData?.longitude),
        information,
        department,
        departmentPhoneNumber,
        approvalStatus,
        imageIds,
      };

      const response = await addFacility(params);
      console.log("Add facility:", response);
      if (response.code === "REQ000") {
        toast.success("시설물을 등록했습니다.");
        onFinishAdd();
      }
    } catch (err) {
      console.error("Failed to add facility:", err);
      toast.error("시설물 등록에 실패하였습니다. 다시 시도해 주세요.");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="container h-[90%] mx-auto p-4 overflow-y-auto">
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">시설물 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="facilityType">
                <span className="label-text text-base">시설물 구분</span>
              </label>
              <select
                id="facilityType"
                className="select select-bordered"
                value={type}
                onChange={(e) => setType(e.target.value as "R" | "S" | "T")}
              >
                <option value="" disabled>
                  시설물 구분
                </option>
                <option value="T">쓰레기통</option>
                <option value="R">화장실</option>
                <option value="S">흡연구역</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">시설 이름</label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <AddressSearch
              isEditing={true}
              updateAddress={updateLocation}
              facilityAddress={location}
            />
            <div className="form-control">
              <label className="label">상세 주소</label>
              <input
                type="text"
                className="input input-bordered"
                value={detailLocation}
                onChange={(e) => setDetailLocation(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">추가설명</label>
              <input
                type="text"
                className="input input-bordered"
                value={information}
                onChange={(e) => setInformation(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">관리부서</label>
              <input
                type="text"
                className="input input-bordered"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">관리부서 번호</label>
              <input
                type="text"
                className="input input-bordered"
                value={departmentPhoneNumber}
                onChange={(e) => setDepartmentPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">승인 상태</label>
              <select
                id="approved"
                className="select select-bordered"
                value={approvalStatus}
                onChange={(e) =>
                  setApprovalStatus(e.target.value as "P" | "A" | "R" | "S")
                }
              >
                <option value="" disabled>
                  승인 여부
                </option>
                <option value="P">승인 대기</option>
                <option value="A">승인 완료</option>
                <option value="R">승인 거절</option>
                <option value="S">승인 중단</option>
              </select>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">이미지</h2>
          <div className="flex flex-wrap">
            {images.map((image, index) => (
              <div
                className="relative w-[200px] mr-4 border border-gray-300 rounded-md"
                key={index}
              >
                <Image
                  src={image}
                  alt={`Facility Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-[200px] h-auto"
                />

                <button
                  className="btn btn-sm btn-error absolute top-2 right-2"
                  onClick={() => handleImageRemove(index)}
                >
                  X
                </button>
              </div>
            ))}

            <div className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md w-[200px] h-[200px] mr-4">
              <label className="cursor-pointer">
                <span className="btn btn-sm btn-primary">+</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) =>
                    handleImageUpload(event, setImageData, setImages)
                  }
                />
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="btn btn-sm  btn-primary mt-4"
              onClick={handleAddFacility}
            >
              등록
            </button>
            <button
              className="btn btn-sm  btn-secondary mt-4 ml-4"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
