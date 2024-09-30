type FacilityEditBody = {
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
  imageIds: string[];
};

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
