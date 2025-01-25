// components/ApiResponseDisplay.js
export function ApiResponseDisplay({ response, error }) {
  return (
    <div style={{ marginTop: "20px" }}>
      {response && (
        <div style={{ color: "green" }}>
          <h3>All Responses:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
