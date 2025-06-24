export default function LoadingBox() {
  return (
    <div
      style={{
        height: "60vh",
      }}
      className="container mt-5 mb-5 d-flex justify-content-center align-items-center"
    >
      <div
        className="spinner-border text-primary"
        style={{
          height: "5rem",
          width: "5rem",
        }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
