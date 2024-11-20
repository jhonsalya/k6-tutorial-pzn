import { createContact } from './helper/contact';
import { loginUser, registerUser } from './helper/user.js';
import execution from 'k6/execution';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';


export const options = {
    thresholds: {
        user_registration_counter_success: ['count>190'], //jumlah yang error harus diatas 190, jika kurang dari itu maka error
        user_registration_counter_error: ['count<10'], //jumlah yang error harus dibawah 10, jika lebih dari itu maka error
    },
    scenarios: {
        userRegistration: {
            exec        : "userRegistration", //manggil function userRegistration
            executor    : "shared-iterations",
            vus         : 10,
            iterations  : 200,
            maxDuration : "30s"
        },
        userRegistration: {
            exec     : "contactCreation",
            executor : "constant-vus",
            vus      : 10,
            duration : "30s"
        },

    }
}

const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

export function userRegistration() {
    const uniqueId = uuidv4();
    const registerRequest = {
      username: `user-${uniqueId}`,
      password: 'rahasia',
      name: 'Programmer Zaman Now',
    };

    const response = registerUser(registerRequest);
    if (response.status === 200) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }
}

export function contactCreation() {
    /**
     * dibuat menjadi number = (execution.vu.idInInstance % 9) + 1; karena pada contoh diatas, kita punya 2 skenario
     * skenario yang diatas menggunakan 10 VU, kemudian dilanjutkan dengan skenario kedua lagi 10 VU
     * problemnya adalah ketika menggunakan execution.vu.idInInstance di skenario kedua akan gagal, 
     * karena id VU yang digunakan akan dilanjutkan dari skenario sebelumnya yaitu 11 - 20, sedangkan execution.vu.idInInstance itu ngambil dari eksekusi instancenya
     * dibuat dengan % 9 + 1 agar contoh numbernya tetap ada di rentang 1 - 10 (karena di function register kita hanya prepare 10 data user)
     */
    const number = (execution.vu.idInInstance % 9) + 1;
    const username = `contoh${number}`;
    const loginRequest = {
        username: username,
        password: 'rahasia',
    }

  const loginResponse = loginUser(loginRequest);
  const token = loginResponse.json().data.token;

    const contact = {
        "first_name" : "Kontak",
        "last_name" : `Contoh`,
        "email" : `contact@example.com`,
    };

    createContact(token, contact);
}