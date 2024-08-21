"use client";
import { FormEvent, useState } from "react";

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    console.log("submit");
  };
  return (
    <div className="">
      <div className="max-w-md m-auto">
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="form-control w-full">
            <input
              className="input input-bordered w-full"
              placeholder="Username"
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-control w-full">
            <input
              className="input input-bordered w-full"
              placeholder="Password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-control w-full">
            <input
              className="input input-bordered w-full"
              placeholder="Password"
              id="rePassword"
              type="password"
              required
              value={rePassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="btn btn-block bg-black text-white py-2 rounded mt-4"
            type="submit"
          >
            수정
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
