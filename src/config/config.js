let enviroment = "development";

export let localhost;

if (enviroment === "development") {
  localhost = "http://localhost:8000";
} else {
  localhost = "https://bpikd-backend-test.up.railway.app";
}
