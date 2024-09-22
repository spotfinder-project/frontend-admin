// geoService.ts
const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

export const getCoordinatesFromAddress = async (address: string) => {
  if (!address) {
    throw new Error("Address must be provided");
  }

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      address
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data from Kakao API");
  }

  const data = await response.json();
  console.log(data);

  if (data.documents && data.documents.length > 0) {
    return {
      latitude: data.documents[0].y,
      longitude: data.documents[0].x,
    };
  } else {
    throw new Error("No results found");
  }
};
