function LoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Checking ingredients"
      className="mx-auto max-w-xl animate-pulse rounded-2xl bg-gray-200 px-6 py-10"
    >
      <div className="mx-auto h-9 w-48 rounded bg-gray-300" />
      <div className="mx-auto mt-3 h-4 w-64 rounded bg-gray-300" />
    </div>
  )
}

export default LoadingSkeleton
