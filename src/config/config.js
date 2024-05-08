let enviroment = 'production';

export let localhost;

if (enviroment === 'development') {
  localhost = 'http://localhost:8000';
} else {
  localhost = 'https://bpikd-backend-mariadb-production.up.railway.app';
}
