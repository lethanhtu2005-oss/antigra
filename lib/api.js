// Helper gọi API từ phía client.
async function req(url, opts) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${url} lỗi ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const api = {
  // Bookings
  listBookings: () => req("/api/bookings"),
  createBooking: (data) => req("/api/bookings", { method: "POST", body: JSON.stringify(data) }),
  updateBooking: (id, status) => req("/api/bookings", { method: "PATCH", body: JSON.stringify({ id, status }) }),

  // Saved
  listSaved: () => req("/api/saved"),
  savePlace: (data) => req("/api/saved", { method: "POST", body: JSON.stringify(data) }),
  unsavePlace: (refId) => req(`/api/saved?refId=${encodeURIComponent(refId)}`, { method: "DELETE" }),

  // Trip planner
  listTrip: () => req("/api/trip"),
  addToTrip: (data) => req("/api/trip", { method: "POST", body: JSON.stringify(data) }),
  removeFromTrip: (refId) => req(`/api/trip?refId=${encodeURIComponent(refId)}`, { method: "DELETE" }),

  // Reviews & Reports
  listReviews: (place, { all = false } = {}) => {
    const qs = new URLSearchParams();
    if (place) qs.set("place", place);
    if (all) qs.set("all", "1");
    const q = qs.toString();
    return req(`/api/reviews${q ? `?${q}` : ""}`);
  },
  setReviewHidden: (id, hidden) => req("/api/reviews", { method: "PATCH", body: JSON.stringify({ id, hidden }) }),
  updateReport: (id, status) => req("/api/reports", { method: "PATCH", body: JSON.stringify({ id, status }) }),
  createReview: (data) => req("/api/reviews", { method: "POST", body: JSON.stringify(data) }),
  listReports: (place) => req(`/api/reports${place ? `?place=${encodeURIComponent(place)}` : ""}`),
  createReport: (data) => req("/api/reports", { method: "POST", body: JSON.stringify(data) }),

  // Business-scoped
  listBusinessBookings: (bizId) => req(`/api/bookings?business=${encodeURIComponent(bizId)}`),
  listRequests: (bizId) => req(`/api/requests${bizId ? `?business=${encodeURIComponent(bizId)}` : ""}`),
  updateRequest: (id, status, note) => req("/api/requests", { method: "PATCH", body: JSON.stringify({ id, status, note }) }),

  // Notifications
  listNotifications: ({ role, business } = {}) => {
    const qs = new URLSearchParams();
    if (role) qs.set("role", role);
    if (business) qs.set("business", business);
    const s = qs.toString();
    return req(`/api/notifications${s ? `?${s}` : ""}`);
  },
};
