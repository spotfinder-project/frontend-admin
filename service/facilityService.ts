interface FacilityEditBody {
  facilityId: number;
  type: "T" | "R" | "S";
  name: string;
  location: string;
  detailLocation: string | null;
  latitude: number;
  longitude: number;
  information: string;
  department: string;
  departmentPhoneNumber: string | null;
  approvalStatus: "P" | "A" | "R" | "S";
  imageIds?: number[];
}

interface FacilityAddBody extends Omit<FacilityEditBody, "facilityId"> {}

export const handleUpdateFacility = async ({
  facilityId,
  type,
  name,
  location,
  detailLocation,
  latitude,
  longitude,
  information,
  department,
  departmentPhoneNumber,
  approvalStatus,
  imageIds,
}: FacilityEditBody) => {
  try {
    const response = await fetch("/api/facilities", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        facilityId,
        type,
        name,
        location,
        detailLocation,
        latitude,
        longitude,
        information,
        department,
        departmentPhoneNumber,
        approvalStatus,
        imageIds,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Facility Update Failed");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getImageIds = async (imageData: File[]) => {
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
      return null;
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const handleAddImages = async (images: FormData) => {
  try {
    const response = await fetch("/api/facilities/images", {
      method: "POST",
      credentials: "include",
      body: images,
    });

    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Images Upload Failed");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const addFacility = async ({
  type,
  name,
  location,
  detailLocation,
  latitude,
  longitude,
  information,
  department,
  departmentPhoneNumber,
  approvalStatus,
  imageIds,
}: FacilityAddBody) => {
  try {
    const response = await fetch("/api/facilities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        type,
        name,
        location,
        detailLocation,
        latitude,
        longitude,
        information,
        department,
        departmentPhoneNumber,
        approvalStatus,
        imageIds,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Facility Update Failed");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
