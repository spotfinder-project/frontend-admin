"use client";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/service/authService";
import SyncLoader from "react-spinners/SyncLoader";
import Loading from "@/components/ui/Loading";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const data = await login(id, password);

      if (data.code === "REQ000") router.push("/main");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Login Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Centered container using Tailwind CSS */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-center text-2xl font-bold mb-8">Login</h2>
            <div className="space-y-4">
              <div className="form-control w-full">
                <input
                  className="input input-bordered w-full"
                  placeholder="Username"
                  id="username"
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
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
              <button
                className="btn btn-block bg-black text-white py-2 rounded mt-4"
                type="submit"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <Loading loading={loading} />
      </div>
    </div>
  );
}
