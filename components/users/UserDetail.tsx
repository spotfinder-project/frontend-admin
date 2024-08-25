import { User } from "@/types/types";

interface Props {
  user: User;
}

const UserDetail = ({ user }: Props) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">사용자 상세 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="font-medium">User ID:</span> {user.userId}
        </div>
        <div>
          <span className="font-medium">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-medium">Nickname:</span> {user.nickname}
        </div>
        <div>
          <span className="font-medium">Birthdate:</span> {user.birthdate}
        </div>
        <div>
          <span className="font-medium">Sex:</span> {user.sex}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">Social Login:</span>
          {user.socialLoginType}
        </div>
        <div>
          <span className="font-medium">Created Date:</span>
          {user.createdDate}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
