import { ChangeEvent, useState } from "react";
import AddressSearch from "./AddressSearch";
import Image from "next/image";

// "type": "R",
//   "name": "쌍문역 내 화장실",
//   "location": "쌍문역",
//   "detailLocation": "지하 1층",
//   "latitude": 37.413294,
//   "longitude": 126.764166,
//   "information": "개찰구 내에 존재합니다.",
//   "department": "서울시설공단",
//   "departmentPhoneNumber": "02-2290-7111",
//   "approvalStatus": "A",
//   "imageIds": [
//     1,
//     2
//   ]
type Props = {
  onClose: () => void;
};

export default function AddFacilityModal({ onClose }: Props) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [detailLocation, setDetailLocation] = useState("");
  const [information, setInformation] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentPhoneNumber, setDepartmentPhoneNumber] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prevImages) => [...prevImages, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFacility = () => {
    console.log("add facility");
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
                onChange={(e) => setType(e.target.value)}
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
              updateAddress={setLocation}
              facilityAddress={location}
            />
            <div className="form-control">
              <label className="label">상세 주소</label>
              <input
                type="text"
                className="input input-bordered"
                value={detailLocation}
                onChange={(e) => setLocation(e.target.value)}
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
              <input
                type="text"
                className="input input-bordered"
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">이미지</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div className="relative" key={index}>
                <Image
                  src={image}
                  alt={`Facility Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
                (
                <button
                  className="btn btn-sm btn-error absolute top-2 right-2"
                  onClick={() => handleImageRemove(index)}
                >
                  X
                </button>
                )
              </div>
            ))}

            <div className="flex items-center justify-center border-2 border-dashed border-gray-400 w-[200px] h-[200px]">
              <label className="cursor-pointer">
                <span className="btn btn-sm btn-primary">+</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
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
