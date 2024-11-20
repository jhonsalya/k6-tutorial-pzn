import http from 'k6/http';
import { sleep } from 'k6';

// The following config would have k6 ramping up from 1 to 20 VUs for 10 seconds,
// then ramping down from 20 to 10 VUs
// over the next 10 seconds before finally ramping down to 0 VUs for another
// 10 seconds.

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '10s', target: 10 },
    { duration: '10s', target: 0 },
  ],
};
export default function() {
  // http.get('http://localhost:3000/ping');
  http.get('https://miyako.co.id/');
  // sleep(1);
}
