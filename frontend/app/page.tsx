"use client";

import { useState } from "react";

type HealthResponse = {
  status: string;
};

export default function Home() {
  const [status, setStatus] = useState("尚未检查");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkBackend() {
    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/health`);

      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`);
      }

      const data: HealthResponse = await response.json();
      setStatus(data.status);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "未知错误";

      setError(message);
      setStatus("连接失败");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-900">My Agent</h1>

        <p className="mt-2 text-zinc-600">
          后端状态：
          <span className="ml-2 font-medium">{status}</span>
        </p>

        <button
          type="button"
          onClick={checkBackend}
          disabled={isLoading}
          className="mt-6 rounded-lg bg-black px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "检查中..." : "检查后端连接"}
        </button>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
