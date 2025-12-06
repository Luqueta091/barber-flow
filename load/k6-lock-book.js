import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "1m",
};

const BASE = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const slotPayload = {
    unitId: "u1",
    serviceId: "s1",
    startAt: "2024-01-02T10:00:00Z",
    endAt: "2024-01-02T10:30:00Z",
  };

  const lockRes = http.post(`${BASE}/slots/lock`, JSON.stringify(slotPayload), {
    headers: { "Content-Type": "application/json" },
  });
  check(lockRes, { "lock status 200|409": (r) => [200, 409].includes(r.status) });

  if (lockRes.status === 200) {
    const token = lockRes.json("reservationToken");
    const bookRes = http.post(
      `${BASE}/appointments`,
      JSON.stringify({
        ...slotPayload,
        userId: `user-${__VU}-${__ITER}`,
        reservationToken: token,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
    check(bookRes, { "book status 201|409": (r) => [201, 409].includes(r.status) });
  }

  sleep(0.2);
}
