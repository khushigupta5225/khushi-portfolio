export default function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-6xl min-w-0 ${className}`}>{children}</div>
  )
}
