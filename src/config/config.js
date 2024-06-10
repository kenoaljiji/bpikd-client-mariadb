let enviroment = 'development';

export let localhost;

if (enviroment === 'development') {
  localhost = 'http://localhost:8000/api';
} else if (enviroment === 'production') {
  localhost = 'https://bpikd.vizitke.ba/api';
} else {
  localhost = '/api';
}
