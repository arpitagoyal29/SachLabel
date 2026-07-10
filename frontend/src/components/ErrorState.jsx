function ErrorState({ onRetry }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-gray-100 px-6 py-10 text-center">
      <p className="text-xl font-bold text-[#1F3A5F]">Couldn't verify this product</p>
      <p className="mt-2 text-base text-[#333333]">Something went wrong on our end. Please try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-[#1F3A5F] px-6 py-2 font-semibold text-white"
      >
        Try again
      </button>
    </div>
  )
}

export default ErrorState
