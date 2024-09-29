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

export interface FacilityAsItem {
  facilityId: number;
  type: "R" | "S" | "T";
  name: string;
  location: string;
  detailLocation: string;
  information: string;
  department: string;
  departmentPhoneNumber: string;
  approvalStatus: string;
  createdDate: string;
  images: string[];
}

/** Member 관련 */

export interface UserParams {
  memberId?: string;
  name?: string;
  nickname?: string;
  gender?: string;
  socialType?: string;
  startDate?: string;
  endDate?: string;
}

export interface User {
  memberId: number;
  nickname: string;
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
  facility: FacilityAsItem;
}

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  valid: "Y" | "N";
  createdAt: string;
}
export interface ReportDetail {
  reportId: number;
  content: string;
  answer: string;
  status: "Y" | "N";
  createdDate: string;
  memberId: number;
  nickname: string;
  facility: FacilityAsItem;
}
