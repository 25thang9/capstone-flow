// Chạy khi npm run dev đã hoạt động, không cần đăng nhập, không ghi dữ liệu thật.
const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

const checks = [
  { method: "GET", path: "/api/v1/topics", status: 200 },
  { method: "GET", path: "/api/v1/topics/abc", status: 400 },
  { method: "GET", path: "/api/v1/topics?status=UNKNOWN", status: 400 },
  { method: "GET", path: "/api/v1/registrations", status: 401 },
  { method: "GET", path: "/api/v1/lecturer/activity", status: 401 },
  { method: "PATCH", path: "/api/v1/lecturer/notifications", status: 401, body: { all: true } },
  { method: "PATCH", path: "/api/v1/lecturer/messages", status: 401, body: { registrationId: 1 } },
  { method: "GET", path: "/api/v1/auth/me", status: 401 },
  { method: "POST", path: "/api/v1/topics", status: 401 },
  { method: "PATCH", path: "/api/v1/topics/1", status: 401 },
  { method: "POST", path: "/api/v1/auth/login", status: 400, body: { email: "not-an-email", password: "" } },
];

let failed = 0;
for (const test of checks) {
  try {
    const response = await fetch(`${baseUrl}${test.path}`, {
      method: test.method,
      headers: { "Content-Type": "application/json" },
      ...(test.body ? { body: JSON.stringify(test.body) } : {}),
    });
    const passed = response.status === test.status;
    console.log(`${passed ? "PASS" : "FAIL"} ${test.method} ${test.path} → ${response.status} (cần ${test.status})`);
    if (!passed) failed++;
  } catch (error) {
    console.log(`FAIL ${test.method} ${test.path}: ${error.message}`);
    failed++;
  }
}
process.exitCode = failed ? 1 : 0;
