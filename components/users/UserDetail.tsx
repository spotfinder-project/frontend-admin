import { UserDetail } from "@/types/types";

interface Props {
  user: UserDetail;
}

const UserDetailForm = ({ user }: Props) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">사용자 상세 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-medium">User ID:</span> {user?.email}
        </div>
        <div>
          <span className="font-medium">Nickname:</span> {user?.nickname}
        </div>
        <div>
          <span className="font-medium">Gender:</span> {user?.gender}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user?.email}
        </div>
        <div>
          <span className="font-medium">Social Login: </span>
          {user?.socialType}
        </div>
        <div>
          <span className="font-medium">Created Date: </span>
          {user?.createdDate}
        </div>
      </div>
    </div>
  );
};

export default UserDetailForm;
