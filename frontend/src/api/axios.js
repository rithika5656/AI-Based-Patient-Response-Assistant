import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
});

// ── Patient APIs ────────────────────────────────────────────────────────

export const submitPatientQuery = (data) =>
  API.post("/api/patient/query", data);

export const getPatientQueries = (patientId) =>
  API.get(`/api/patient/query/${patientId}`);

// ── Doctor APIs ─────────────────────────────────────────────────────────

export const getDoctorQueries = (status) =>
  API.get("/api/doctor/queries", { params: status ? { status } : {} });

export const getDoctorQueryById = (queryId) =>
  API.get(`/api/doctor/query/${queryId}`);

export const reviewQuery = (queryId, data) =>
  API.put(`/api/doctor/query/${queryId}`, data);

// ── Department Config APIs ───────────────────────────────────────────

export const getDepartmentConfig = () =>
  API.get("/api/doctor/config/department");

export const updateDepartmentConfig = (department) =>
  API.put("/api/doctor/config/department", { department });

export default API;
