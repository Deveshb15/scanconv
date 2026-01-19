import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          borderRadius: "6px",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4h16v16H4V4z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M9 9h6v6H9V9z" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
