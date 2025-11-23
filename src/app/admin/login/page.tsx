import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params?.next || "/admin/ads";
  const error = params?.error;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm border border-gray-200 bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="text-xs text-gray-600">
          Enter the admin password to access the dashboard.
        </p>
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}
        <AdminLoginForm nextPath={next} />
      </div>
    </main>
  );
}
