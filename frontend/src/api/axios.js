import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
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

export default API;
