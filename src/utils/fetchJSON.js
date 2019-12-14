const fetch = require("node-fetch");

const fetchJSON = async (url, { method, body, headers } = {}) => {
  body = body && JSON.stringify(body);

  if (body) {
    headers = headers || {};
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { method: method || "GET", body, headers });
  const json = await res.json();

  return { status: res.status, json };
};

module.exports = {
  fetchJSON
};
