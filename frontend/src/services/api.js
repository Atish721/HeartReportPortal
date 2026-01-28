const BASE_URL_API = import.meta.env.REACT_APP_API_URL || "https://api-heart-bice.vercel.app/api";

export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const generateReportApi = async (data, token) => {
  const res = await fetch(`${BASE_URL_API}/report/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return res.blob();
};
