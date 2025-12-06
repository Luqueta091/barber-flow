import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

const BASE = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const res = http.get(`${BASE}/bff/availability?unitId=u1&serviceId=s1&date=2024-01-02`);
  if (res.status !== 200) {
    console.error("Non-200", res.status);
  }
  sleep(0.5);
}
