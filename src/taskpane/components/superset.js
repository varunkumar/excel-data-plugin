/* eslint-disable no-undef */
const SUPSERSET_URL = "http://localhost:7000/api/proxy/v1";

export const getUsername = () => {
  return localStorage.getItem("username");
};

const tokenManager = () => {};

let token = "";
export const refreshToken = async (username, password) => {
  try {
    const response = await fetch(SUPSERSET_URL + "/security/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        provider: "db",
        refresh: true,
      }),
    });
    const data = await response.json();
    token = data.access_token;
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
  } catch (error) {
    console.error(error);
  }
};
setInterval(() => {
  refreshToken(getUsername(), localStorage.getItem("password"));
}, 1000 * 60 * 10);

export const getToken = () => {
  return token;
};

export const isUserLoggedIn = () => {
  return getUsername() !== "" && getUsername() !== undefined && getUsername() !== null;
};

export const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  token = "";
};

export const getDatabase = async () => {
  try {
    const response = await fetch(SUPSERSET_URL + "/database/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });
    const data = await response.json();
    return data.result.map((db) => {
      return { key: db.id, text: db.database_name, backend: db.backend };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSchema = async (databaseId) => {
  try {
    const response = await fetch(SUPSERSET_URL + "/database/" + databaseId + "/schemas/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });
    const data = await response.json();
    return data.result.map((schema) => {
      return { key: schema, text: schema };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const executeQuery = async (dataSourceId, columns) => {
  try {
    const response = await fetch(SUPSERSET_URL + "/chart/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify({
        custom_cache_timeout: 0,
        datasource: {
          id: dataSourceId,
          type: "table",
        },
        force: false,
        form_data: {},
        queries: [
          {
            columns: columns,
          },
        ],
        result_format: "json",
        result_type: "full",
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createDataset = async (query, databaseId, schema, table) => {
  try {
    const response = await fetch(SUPSERSET_URL + "/dataset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify({
        database: databaseId,
        owners: [1],
        schema: schema,
        sql: query,
        table_name: `${table}_${Date.now()}`,
      }),
    });
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getDataset = async (datasetId) => {
  try {
    const response = await fetch(SUPSERSET_URL + "/dataset/" + datasetId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export default tokenManager;
