import http from 'k6/http';
import {check, fail, sleep } from 'k6';
import { registerUser, loginUser, getUser } from './helper/user.js';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '10s',
};

export default function() {
  const uniqueId = new Date().getTime();
  const registerRequest = {
    username: `user-${uniqueId}`,
    password: 'rahasia',
    name: 'Programmer Zaman Now',
  };

  // Tidak pakai module
  // const registerResponse = http.post('http://localhost:3000/api/users', JSON.stringify(registerRequest), {
  //   headers: {
  //     'Accept' : 'application/json',
  //     'Content-Type' : 'application/json',
  //   }
  // })

  // const checkRegister = check(registerResponse, {
  //   'register response status must 200' : (response) => response.status === 200,
  //   'register response data must not null' : (response) => response.json().data != null,
  // })

  // if(!checkRegister){
  //   fail(`Failed to register user-${uniqueId}`);
  // }

  // Pakai Module
  const registerResponse = registerUser(registerRequest);

  const loginRequest = {
    username: `user-${uniqueId}`,
    password: 'rahasia',
  };

  // Tidak Pakai Module
  // const loginResponse = http.post('http://localhost:3000/api/users/login', JSON.stringify(loginRequest), {
  //   headers: {
  //     'Accept' : 'application/json',
  //     'Content-Type' : 'application/json',
  //   }
  // });

  // const checkLogin = check(loginResponse, {
  //   'login response status must 200' : (response) => response.status === 200,
  //   'login response token must exist' : (response) => response.json().data.token != null,
  // })

  // if(!checkLogin){
  //   fail(`Failed to login user-${uniqueId}`);
  // }

  // Pakai Module
  const loginResponse = loginUser(loginRequest);

  const loginBodyResponse = loginResponse.json();

  // Tidak Pakai Module
  // const currentResponse = http.get('http://localhost:3000/api/users/current', {
  //   headers: {
  //     'Accept' : 'application/json',
  //     'Authorization' : loginBodyResponse.data.token,
  //   }
  // });

  // const checkCurrent = check(currentResponse, {
  //   'current response status must 200' : (response) => response.status === 200,
  //   'current response data must not null' : (response) => response.json().data != null,
  // })

  // if(!checkCurrent){
  //   fail(`Failed to get user-${uniqueId}`);
  // }

  // pakai module
  const currentResponse = getUser(loginBodyResponse.data.token);
}
