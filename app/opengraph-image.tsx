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
          backgroundColor: "#fafafa",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #e5e5e5 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e5e5e5 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        {/* Main Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "60px 80px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e5e5e5",
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              backgroundColor: "#171717",
              borderRadius: "20px",
              marginBottom: "30px",
            }}
          >
            <svg
              width="60"
              height="60"
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
              <path
                d="M9 9h6v6H9V9z"
                fill="white"
              />
              <path
                d="M4 12h2M18 12h2M12 4v2M12 18v2"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#171717",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            ScanConv
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#525252",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            Free Online Document Scanner
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: 20,
                color: "#737373",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                }}
              />
              Edge Detection
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: 20,
                color: "#737373",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                }}
              />
              PDF Export
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: 20,
                color: "#737373",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#22c55e",
                  borderRadius: "50%",
                }}
              />
              100% Private
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: 20,
            color: "#a3a3a3",
          }}
        >
          Convert images to scanned PDFs instantly - No sign-up required
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
