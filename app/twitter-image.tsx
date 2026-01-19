import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ScanConv - Free Online Document Scanner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              backgroundColor: "#fafafa",
              borderRadius: "24px",
              marginBottom: "40px",
            }}
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4h16v16H4V4z"
                stroke="#171717"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9 9h6v6H9V9z"
                fill="#171717"
              />
              <path
                d="M4 12h2M18 12h2M12 4v2M12 18v2"
                stroke="#171717"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#fafafa",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            ScanConv
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: "#a3a3a3",
              marginBottom: "50px",
            }}
          >
            Free Online Document Scanner
          </div>

          {/* Features row */}
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#262626",
                borderRadius: "12px",
                padding: "16px 28px",
                fontSize: 22,
                color: "#e5e5e5",
              }}
            >
              Edge Detection
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#262626",
                borderRadius: "12px",
                padding: "16px 28px",
                fontSize: 22,
                color: "#e5e5e5",
              }}
            >
              PDF Export
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#262626",
                borderRadius: "12px",
                padding: "16px 28px",
                fontSize: 22,
                color: "#e5e5e5",
              }}
            >
              100% Private
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
