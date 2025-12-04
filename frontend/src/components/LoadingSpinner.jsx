export default function LoadingSpinner({ size = 10, color = "blue-500" }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div
        className={`w-${size} h-${size} border-4 border-${color} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
