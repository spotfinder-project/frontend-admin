"use client";
import { updatePassword } from "@/service/authService";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";

const AdminPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await updatePassword(password);

      if (response.code === "REQ000") {
        setPassword("");
        toast.success("비밀번호가 수정되었습니다.");
      } else if (response.message === "REQ003") {
        toast.error("권한이 없습니다. 다시 로그인 해주세요.");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else if (response.message === "REQ002") {
        toast.error("비밀번호를 확인해 주세요.");
      }
    } catch (err) {
      console.log(err);
      toast.error("비밀번호 수정을 할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <div className="max-w-md m-auto">
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="form-control w-full">
            <input
              className="input input-bordered w-full"
              placeholder="Password"
              id="rePassword"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="btn btn-block bg-black text-white py-2 rounded mt-4"
            type="submit"
            onClick={handleSubmit}
          >
            수정
          </button>
        </form>
      </div>
      <Loading loading={loading} />
    </div>
  );
};

export default AdminPage;
