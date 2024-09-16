export interface Facility {
  facilityId: number;
  type: "R" | "S" | "T";
  name: string;
  location: string;
  detailLocation: string;
  information: string;
  department: string;
  departmentPhoneNumber: string;
  approvalStatus: string;
  memberId: string;
  createdDate: string;
}

export interface FacilityDetail {
  facilityId: number;
  type: "R" | "S" | "T";
  name: string;
  location: string;
  detailLocation: string;
  information: string;
  department: string;
  departmentPhoneNumber: string;
  approvalStatus: string;
  memberId: string;
  createdDate: string;
  images: string[];
}

export interface FacilityReview {
  reviewId: number;
  content: string;
  createdDate: string;
  memberId: string;
  nickname: string;
}

export interface Review {
  id: string;
  content: string;
  facilityType: string;
  facilityId: string;
  facilityName: string;
  address: string;
  createdDate: string;
}

export interface User {
  memberId: number;
  name: string;
  nickname: string;
  birthday: string;
  gender: "M" | "F";
  socialType: string;
  createdDate: string;
}

export interface UserDetail {
  memberId: number;
  name: string;
  nickname: string;
  birthday: string;
  gender: "M" | "F";
  email: string;
  socialType: string;
  createdDate: string;
  // facilities: Facility[];
  // reviews: Review[];
}

export interface UserFacility {
  facilityId: number;
  type: "R" | "S" | "T";
  name: string;
  location: string;
  detailLocation: string;
  information: string;
  approvalStatus: string;
  approvalDate: string;
}

export interface UserReview {
  reviewId: number;
  content: string;
  createdDate: string;
  facility: {
    facilityId: 1;
    type: string;
    name: string;
    location: string;
    detailLocation: string;
    information: string;
    department: string;
    departmentPhoneNumber: string;
    approvalStatus: string;
    createdDate: string;
    images: string[];
  };
}
