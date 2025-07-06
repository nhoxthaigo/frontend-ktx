//src\services\api\endpoints.js
import { Bed } from "lucide-react";

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    PROFILE: "/auth/profile",
    LOGOUT: "/auth/logout",
  },

  // Student Registration
  STUDENT_REGISTRATION: {
    REGISTER: "/auth/register/student",
    SETUP_PASSWORD: "/students/setup-password",
  },

  REGISTRATION: {
    GET_ALL: "/registrations/", // Corrected: Path becomes /api/registrations/
    CREATE: "/registrations/", // Corrected: Path becomes /api/registrations/
    GET_BY_ID: (id) => `/${id}`, // Corrected: Path becomes /api/registrations/:id
    APPROVE: (id) => `/registrations/${id}/approve`, // Corrected: Path becomes /api/registrations/:id/approve
    REJECT: (id) => `/registrations/${id}/reject`, // Corrected: Path becomes /api/registrations/:id/reject
    CANCEL: (id) => `/${id}/cancel`, // Added: Path becomes /api/registrations/:id/cancel
    GET_MY_REGISTRATIONS: "/my-registrations", // Added: Path becomes /api/registrations/my-registrations

    // If you add these to your controller later, they'd look like this:
    // UPDATE: (id) => `/${id}`,
    // DELETE: (id) => `/${id}`,
  },
  // Login
  STUDENT: {
    LOGIN: "/auth/login/student",
    GET_ALL: "/students/",
    CREATE: "/students/",
    UPDATE: (id) => `/students/${id}`,
    DELETE: (id) => `/students/${id}`,

  },
  STAFF: {
    GET_ALL: "/staff/",
    CREATE: "/staff/",
    UPDATE: (id) => `/staff/${id}`,
    DELETE: (id) => `/staff/${id}`,
    LOGIN: "/auth/login/staff",
  },

  // Room & RoomType
  ROOM: {
    GET_ALL: "/rooms/rooms",
    CREATE: "/rooms/rooms",
    UPDATE: (id) => `/rooms/rooms/${id}`,
    DELETE: (id) => `/rooms/rooms/${id}`,
    GET_BEDS: (roomId) => `/rooms/rooms/${roomId}/beds`,
    GET_AVAILABLE: "/rooms/rooms/available",
  },
  ROOM_TYPE: {
    GET_ALL: "/rooms/room-types",
    CREATE: "/rooms/room-types",
    UPDATE: (id) => `/rooms/room-types/${id}`,
    DELETE: (id) => `/rooms/room-types/${id}`,
  },

  BED: {
    GET_ALL_BEDS_BY_ROOM_ID: (roomId) => `/rooms/rooms/${roomId}/beds`,
    CREATE: (roomId) => `/rooms/rooms/${roomId}/beds`,
    UPDATE: (roomId, bedId) => `/rooms/rooms/${roomId}/beds/${bedId}`, // <-- FIX: Add roomId parameter
    DELETE: (roomId, bedId) => `/rooms/rooms/${roomId}/beds/${bedId}`, // <-- FIX: Add roomId parameter and use bedId for consistency
  },
  TOPIC: {
    GET_ALL: "/topics/topics",
    CREATE: "/topics/topics",
    UPDATE: (id) => `/topics/topics/${id}`,
    DELETE: (id) => `/topics/topics/${id}`,
  },
  NEWS: {
    GET_ALL: "/topics/news",
    CREATE: "/topics/news",
    UPDATE: (id) => `/topics/news/${id}`,
    DELETE: (id) => `/topics/news/${id}`,
  },
  NEWS_TOPIC_LINK: {
    GET_ALL: "/news-topic-links",
    CREATE: "/news-topic-links",
    UPDATE: (id) => `/news-topic-links/${id}`,
    DELETE: (id) => `/news-topic-links/${id}`,
  },
  ROOM_ALLOCATION: {
    GET_ALL: "/room-allocations/",
    CREATE: "/room-allocations/",
    UPDATE: (id) => `/room-allocations/${id}`,
    DELETE: (id) => `/room-allocations/${id}`,
    GET_BY_ID: (id) => `/room-allocations/${id}`,
  },

  INVOICE: {
  GET_ALL: "/invoices",
  GET_MY: "/invoices/my",
  GET_ONE: id => `/invoices/${id}`,
  CHECKOUT: id => `/invoices/${id}/checkout`,
},
  ACTIVE_ALLOCATION: "/room-allocations/active", // trả về { id_allocation }
};


