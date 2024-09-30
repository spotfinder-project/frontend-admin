type NoticeEditBody = {
  noticeId: string;
  title?: string;
  valid?: "Y" | "N";
  content: string;
};

export const handleUpdateNotice = async ({
  noticeId,
  title,
  content,
  valid,
}: NoticeEditBody) => {
  try {
    const response = await fetch("/api/notices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noticeId,
        title,
        content,
        valid,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
