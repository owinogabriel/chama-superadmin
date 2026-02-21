export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">403</h1>
        <p className="text-gray-600 mt-2">You are not authorized to access this portal.</p>
        <a href="/login" className="mt-4 inline-block text-blue-500 underline">
          Back to Login
        </a>
      </div>
    </div>
  )
}