export interface Facility {
  facilityType: string;
  id: string;
  name: string;
  address: string;
  detailedLocation: string;
  note: string;
  admin: string;
  approved: string;
  approvedDate: string;
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
  userId: string;
  name: string;
  nickname: string;
  birthdate: string;
  sex: "M" | "F"; // Assuming sex is either 'M' (Male) or 'F' (Female)
  email: string;
  socialLoginType: string;
  createdDate: string;
  facilities: Facility[];
  reviews: Review[];
}
