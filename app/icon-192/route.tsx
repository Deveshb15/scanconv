import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          borderRadius: "38px",
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4h16v16H4V4z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M9 9h6v6H9V9z" fill="white" />
          <path
            d="M4 12h2M18 12h2M12 4v2M12 18v2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
