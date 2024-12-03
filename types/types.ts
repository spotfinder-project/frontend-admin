export interface Facility {
  facilityId: number;
  type: "R" | "S" | "T";
  name: string;
  location: string;
  detailLocation: string;
  information: string;
  department: string;
  departmentPhoneNumber: string;
  approvalStatus?: "P" | "A" | "R" | "S";
  memberId: string;
  createdDate: string;
}

export interface FacilityParams {
  facilityId?: string;
  name?: string;
  type?: "R" | "S" | "T";
  location?: string;
  approvalStatus?: "P" | "A" | "R" | "S";
  startDate?: string;
  endDate?: string;
  page?: number | string;
  size?: number | string;
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
  approvalStatus?: "P" | "A" | "R" | "S";
  memberId: string;
  createdDate: string;
  images: string[];
}

export interface FacilityAdd {
  type: "R" | "S" | "T";
  name: string;
  location: string;
  detailLocation: string;
  latitude: number;
  longitude: number;
  information: string;
  department: string;
  departmentPhoneNumber: string;
  approvalStatus: "P" | "A" | "R" | "S";
  imageIds: number[];
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
  approvalStatus?: "P" | "A" | "R" | "S";
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
  page?: string | number;
  size?: string | number;
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
  approvalStatus?: "P" | "A" | "R" | "S";
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

export interface NoticeParams {
  title?: string;
  valid?: "Y" | "N";
  startDate?: string;
  endDate?: string;
  page?: number | string;
  size?: number | string;
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

export interface Report {
  reportId: number;
  content: string;
  status: "Y" | "N";
  memberId: number;
  facilityId: number;
  createdDate: string;
}

export interface ReportParams {
  page?: number | string;
  size?: number | string;
  content?: string;
  status?: string;
  memberId?: string;
  facilityId?: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
}

export interface ReviewParams {
  nickname?: string;
  facilityName?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  page?: number | string;
  size?: number | string;
}

export interface Review {
  reviewId: number;
  nickname: string;
  content: string;
  createdDate: string;
  facility: {
    facilityId: number
    type: "R" | "S" | "T";
    name: string;
    location: string;
  }
}

export interface TableData<T = Record<string, any>> {
  id: string;
  [key: string]: any;
}
