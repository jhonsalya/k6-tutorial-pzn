=== Pengenalan K6 ===
- aplikasi open source untuk load testing yang membuat performance testing jadi lebih mudah
- dibuat oleh Grafana Labs
- menggunakan code / script, beda dengan Jmeter yang menggunakan UI

=== Fitur K6 ===
- basisnya adalah terminal, jadi bisa dijalankan di semua sistem operasi
    - tidak terpaku pada UI tertentu
- menggunakan kode javascript

=== Hal yang tidak dilakukan K6 ===
- tidak jalan di browser seperti automation testing (selenium), murni performance test
- Tidak berjalan di NodeJS
    - dibuat dengan NodeJS tetapi pengujiannya tidak jalan di dalam node js. (tidak semua fitur nodejs jalan di K6)
    - bakal jalan di aplikasi K6 yang menggunakan golang
- Tidak mendukung Node Modules.
    - kalau pakai library NPM harus sebutkan file secara langsung (import module tidak didukung)

=== Keterbatasan K6 ===
- semua fitur javascript didukung oleh K6
    - Javascriptnya akan di compile dengan kode Golang dan jalan di K6nya
    - library bernama Goja untuk eksekusi kode JS di Golang
    - library goja ada di github.com/dop251/goja

=== Menginstall K6 ===
- dipakai dengan golang, jadi bisa dipakai di semua sistem operasi
- grafanca.com installation

=== Example application ===
- pakai punyanya PZN belajar restful api
- jalanin aplikasinya pakai
    - node src/main.js

=== Membuat Project ===
- sama seperti membuat project NodeJS
- ubah type menjadi module di package.json

== Menambah K6 Library ==
- tidak berisi kode javascript sama sekali
- install K6 library
    - npm install k6
    - npm install --save-dev @types/k6 (ini metadata untuk autocompletenya)

=== Script ===
- file javascript yg berisikan kode untuk performance test
- lebih mudah dengan command
    - k6 new lokasi/file.js
    - contoh: k6 new src/ping.js

- menjalankan script
    - k6 run lokasi/file.js
    - contoh: k6 run src/ping.js

- Options
    - ada 2 bagian
        - options   
            - sebuah variable yg digunakan untuk melakukan pengaturan
                - VU (virtual users)
                - durasi melakukan pengujian
        - default options
            - function yg dijalankan dengan K6
            - isi kode untuk scenario testingnya
            - hal apa yg akan dilakukan oleh virtual usernya
            - contohnya akses localhost/ping

=== Bagaimana K6 Bekerja ===
- membaca pengatuiran di options
    - contoh sebelumnya pakai 10 virtual user dan durasi 30 detik
- setelah itu akan menjalankan function di default options
- jadi akan memanggil default function secara paralel 10 proses (sesuai virtual user) selama terus menerus selama total 30 detik
- yang di bagian contoh karena default function nya ada sleep(1)
    - sebelum selesai akan berhenti satu detik, jadi 1 detik 1 proses
    - kalau tidak ada sleep maka proses akan terus berlanjut
        - jadi dalam 1 detik akan di eksekusi sebanyak-banyaknya

=== Summary output === 
- setelah testing maka akan memberikan output summary
- secara default tampil dalam terminal
- bisa output dengan json denga perintah
    - k6 run file/script.js --summary-export lokasi-output.json
- metricsnya ada disini
    https://grafana.com/docs/k6/latest/using-k6/metrics/reference/

=== summary statistics ===
- default statistik yang digunakan adalah avg,min,med,max,p(90),p(95)
    - p = percentile
    - sekitar 90% requestnya segitu
- bisa diubah di options dengan key summaryTrendStats: []
    - https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/#summary-trend-stats

=== Realtime output ===
- summary output hanya muncul ketika proses testingnya selesai
- K6 bisa memberikan realtime output
    - defaultnya bisa ke file json / csv
    CSV
        - k6 run --out json=realtime-report.json file/script.js
        - https://grafana.com/docs/k6/latest/results-output/real-time/csv/

    JSON
        - https://grafana.com/docs/k6/latest/results-output/real-time/json/
- biasanya bakal pakai third party kalau mau mantau realtime outputnya
- harus bikin ulang aplikasi K6 dengan menambahkan library third party tersebut
    - contoh jika ingin dikirim ke promotheus, maka aplikasinya harus di bundle ke promotheusnya
    https://grafana.com/docs/k6/latest/results-output/real-time/

=== Web dashboard ===
- fitur lihat realtime output dan summary output
- harus mengaktifkannya menggunakan environment variable
https://grafana.com/docs/k6/latest/results-output/web-dashboard/


- kalau windows
    - set K6_WEB_DASHBOARD=true
    - langsung pas ngerun (kalau bisa jalanin pakai terminal selain powershell, pakai powershell agak beda commandnya)
        K6_WEB_DASHBOARD=true k6 run src/ping.js
- kalau unix
    - export K6_WEB_DASHBOARD=true

=== Stages ===
- memiliki fitur untuk meningkatkan atau menurunkan virtual user ketika melakukan pengujian
- meningkatkan user tertentu / menurunkan dalam durasi tertentu
    - untuk menyamakan sesuai dengan traffic user (simulasi)
https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/#stages

- tidak pakai vus dan juga duration lagi

=== HTTP Request ===
- ada library bawaan melakukan http test k6/http
- bukan untuk melakukan web browser
    - kayak pakai postman, untuk memanggil suatu endpoint
- hampir semua http method didukung
- kenapa gak pakai library node module lain seperti axios?
    - k6/http sudah ada builtin matrixnya
    - kalau pakai axios matrix2nya ga ada, harus buat matrix sendiri

https://grafana.com/docs/k6/latest/javascript-api/k6-http/

- setiap memanggil http request maka akan menghasilkan http respnse
- bisa mengambil informasi http response untuk request selanjutnya

https://grafana.com/docs/k6/latest/javascript-api/k6-http/response/

=== Fail Test ===
- kita perlu tahu apakah testnya itu sukses apa gagal
- bisa gunakan fail() function di library k6 untuk memberi tahu kita bahwa testnya gagal
- jika pakai function fail(), otomatis iterasi tersebut dihentikan
    - tidak dilanjutkannya di iterasi "tersebut" bukan di semua prosesnya dihentikan
    - contoh di register.js
        - jika registrasi saja sudah gagal, kita sistem tidak perlu untuk melanjutkan ke proses login dan juga manggil endpoint current

- ingat import fail dari k6
    contoh code, jika gagal register maka akan fail
  if(registerResponse.status !== 200){
    fail(`Failed to register user-${uniqueId}`);
  }

=== Checks ===
- fitur pengecekan k6 menggunakan function check()
- mirip seperti assertion pada unit test
    - jika ada yg gagal, maka tidak terjadi error dan kode akan tetap dijalankan
- check() mengembalikan return boolean, berisi pengecekan suskses atau gagal
- k6 memberi informasi persentase sukses dan gagal
    - kalau fail cuma secara keseluruhan
    - kalau check dikasi tau di pengecekan yang mana yg gagal
- check jangan lupa di import

=== Execution Context Variables ===
- saat pengujian jalan, kita ingin tahu informasi tentang eksekusi yg dijalankan
    - id iterasi, id virtual user dll
https://grafana.com/docs/k6/latest/javascript-api/k6-execution/

- performance test biasanya disiapkan dulu datanya
    - jadi kalau eksekusi bisa dapetin id dari virtual usernya
    - nanti tinggal query di database dan disamakan ini pakai user yang mana
    - berguna untuk melakukan pengecekan lebih lanjut

=== Test Life Cycle ===
- K6 menjalankan script yang kita buat melakukannya dalam beberapa tahapan (life cycle)
- tahapannya
    - init
        - membaca semua file script, dilakukan sekali saja, wajib dilakukan
    - function setup
        - dipanggil sekali di awal
        - untuk menyiapkan data, return valuenya adalah data
        - datanya akan digunakan oleh default function
    - default funciton
        - dipanggil terus menerus sampai waktu pengetesan selesai
        - jika setup function return data, maka default function bisa terima parameter data tersebut
        - wajib dibuat
    - function tearDown
        - dieksekusi setelah pengujian selesai


=== Modules ===
- dipakai jika script dan scenarionya sudah banyak, untuk memisahkan codenya di dalam module
- hal yang sama berulang2 dijadikan modules, lalu bisa di import codenya dari modules tersebut
- contoh module user.js
    - isinya register dll yg berhubungan dengan user
        - nanti module ini di import untuk memanggil function register


=== Environment Variables ===
- ada pengaturan yang tidak bisa di hardcode di script
    - biasanya disimpan di environment
    - bisa membaca environment variable pada script yang dibuat

- bentuknya adalah string kalau mau dijadikan number harus diconvert dulu
    - ex : Number(__ENV.TOTAL_CONTACT)


=== Scenario ===
== Masalah dengan default function
    - jika skenario test banyak, kode default function semakin banyak dan akan susah untuk di maintain

    - cara agar mudah bisa buat beberapa script file K6
        - masalahnya harus dilakukan satu per satu
        - K6 ada fitur namanya scenario
            - kita bisa buat banyak function dengan option yang berbeda
            - kita bisa buat banyak skenario dalam function yang berbeda dalam satu file script

== How
    - bisa gunakan atribut scenarios di options
    - isinya key dan value

== Scenario Executors
- ketika ingin menggunakan scenario kita harus memilih executor
- terdapat banyak eksekutor yang bisa digunakan, secara garis besar ada tiga bagian
    - berdasarkan jumlah iterasi (number of iteration)
        - shared iteration => total iterasi akan disharing ke semua virtual user yang ada
            - misal : ada 1000 iterasi dan jumlah vu 10, maka 1000 iterasi akan di sharing ke 10 virtual user
            - https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/shared-iterations/

        - per-vu-iteration => setiap VU ditentukan jumlah iterasinya
            - misal : ada 10 VU, dan tiap VU melakukan 100 iterasi, jadi total ada 1000 iterasi
            - https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/per-vu-iterations/

        - Bedanya yg 2 diatas : 
            - yang shared iteration ada kemungkinan pembagian iterasi untuk tiap usernya tidak rata karena ada VU yang lambat dan cepat
                - ada 1000 pekerjaan dikerjakan oleh 10 orang, jadi ada kemungkinan ada yg ngambil kerjaan lebih banyak
            - per-vu-iteration pokoknya setiap user harus dapat 100 iterasi, mau lambat mau cepat pokoknya 1 orang 100

    - berdasarkan jumlah virtual user (number of VU)
        - constant-vus => ditentukan jumlah VU dan durasi yang ditentukan, tidak peduli berapa jumlah iterasinya maka akan dijalankan terus sampai durasi habis
            - https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-vus/

        - ramping-vus => membuat VU yang ditentukan di tiap stage, akan naik turun mengikuti settingan tiap stage sampai selesai
            - https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/
        
    - berdasarkan kapasitas iterasi (iteration rate)
        - constant-arrival-rate => melakukan iterasi secara konstant selama yg kita tentukan
            - misal : 100 iterasi per 1 detik selama 30 detik
                - tiap 1 detik melakukan 100 iterasi tidak peduli response aplikasinya cepat / lambat
                - walau iterasi sebelumnya belum selesai maka akan tetap di gas
            - https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/

        - ramping-arrival-rate => sama seperti constant tapi masih bisa di set naik turun di setiap stagenya
            - https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/

== Execution Function
    - keunggulan scenario adalah bisa menentukan function mana yang akan berjalan di tiap iterasi
    - tiap scenario bisa pakai function yang sama / beda
    - bisa menyebut function dengan "exec"

== Setup dan Teardown
    - scenario tidak bisa membedakan setup dan teardown function per scenario
    - jika menggunakan setup dan teardown function maka akan digunakan untuk semua scenario
    - belum bisa dibuat terpisah
        - sudah ada github issuenya
        - github.com/grafana/k6/issues/1638

== Konfigurasi lainnya scenario
    - https://grafana.com/docs/k6/latest/using-k6/scenarios/

=== Metrics ===
- result pengujian K6 adalah data metric
- metric ada beberapa kategori 
    - Counters, menghitung jumlah
    - Gauges, melacak smalles, largest dan latest
    - Rates, melacak seberapa sering nilai bukan nol muncul
    - Trends, menghitung statistik seperti rata2, persen dll

- ada builtin metrics yaitu bawan k6
    - https://grafana.com/docs/k6/latest/using-k6/metrics/reference/

== Custom Metric ==
    - ada library untuk membuat semua jenis metric
    - perlu menambahkan data ke metric secara manual
        https://grafana.com/docs/k6/latest/using-k6/metrics/
    - bikin variable, tambahkan data secara manual
    - harus import metrics nya

=== Thresholds ===
- secara default hasil pengujian akan selalu dianggap sukses meskipun ada error
- bisa memberikan setting thresholds untuk kasi batasan apakah pengujian itu sukses atau gagal
- https://grafana.com/docs/k6/latest/using-k6/thresholds/
        export const options = {
            thresholds: {
                http_req_failed: ['rate<0.01'], // http errors should be less than 1%
                http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
            },
        };
== Metric thresholds
    - dikenakan pada metric builtin atau buatan kita sendiri
    - aturannya harus menggunakan jenis metric yang digunakan
        https://grafana.com/docs/k6/latest/using-k6/metrics/
    - contoh : counters itu ouputnya angka, jadi ga bisa dipakein yang percent

=== Javascript library
- Remote modules
    - library yang dibuat terpisah dari K6 nya
    - jslib.k6.io
        - ada orang yang bikin script untuk kebutuhan K6nya

    - contoh pake uuidv4 bawaan jslib
        - https://grafana.com/docs/k6/latest/javascript-api/jslib/utils/uuidv4/