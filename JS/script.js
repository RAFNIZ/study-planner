// Proteksi dasar: Mencegah klik kanan & shortcut copy dengan teks profesional
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert("Protected Content: Hak cipta dilindungi undang-undang.");
});

document.addEventListener('keydown', function(e) {
    if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
    ) {
        e.preventDefault();
        alert("Akses dibatasi demi keamanan kode sumber.");
        return false;
    }
});

const formTugas = document.getElementById('task-form');
const inputNama = document.getElementById('task-name');
const inputMatkul = document.getElementById('task-matkul');
const selectPrioritas = document.getElementById('task-priority');
const inputDeadline = document.getElementById('task-date');
const inputCatatan = document.getElementById('task-notes');
const listTugas = document.getElementById('task-list');
const inputEditIndex = document.getElementById('task-edit-index');
const btnSubmit = document.getElementById('submit-btn');
const prevTask = document.getElementById('preview-task');
const prevMatkul = document.getElementById('preview-matkul');
const prevPriority = document.getElementById('preview-priority');

const darkModeBtn = document.getElementById('dark-mode-btn');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = '☀️';
}

darkModeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkModeBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        darkModeBtn.textContent = '🌙';
    }
});

// Array buat nampung data tugas sementara
let dataTugas = [];

// Handle submit form (tambah atau update data)
formTugas.addEventListener('submit', function(e) {
    e.preventDefault();

    let nama = inputNama.value.trim();
    let matkul = inputMatkul.value.trim();
    let prioritas = selectPrioritas.value;
    let deadline = inputDeadline.value;
    let catatan = inputCatatan.value.trim();
    let indexEdit = inputEditIndex.value;

    if (indexEdit === "" || indexEdit < 0) {
        dataTugas.push({ nama, matkul, prioritas, deadline, catatan, isCompleted: false });
    } else {
        dataTugas[indexEdit] = { ...dataTugas[indexEdit], nama, matkul, prioritas, deadline, catatan };
        inputEditIndex.value = "";
        btnSubmit.textContent = "Simpan Tugas";
    }

    tampilkanTugas();
    formTugas.reset();
});

window.toggleSelesai = function(idx) {
    if (dataTugas[idx]) {
        dataTugas[idx].isCompleted = !dataTugas[idx].isCompleted;
        tampilkanTugas();
    }
}

// Fungsi buat ngerender list tugas ke DOM
function tampilkanTugas() {
    listTugas.innerHTML = "";

    if (dataTugas.length === 0) {
        listTugas.innerHTML = `<li class="empty-state">Belum ada tugas tercatat. Yuk mulai masukkan tugasmu!</li>`;
        prevTask.textContent = "Belum ada tugas yang dicatat.";
        prevMatkul.textContent = "Matkul: -";
        prevPriority.textContent = "Prioritas: -";
        prevPriority.className = "badge";
        return;
    }

    dataTugas.forEach((item, idx) => {
        let warnaBadge = 'badge-biasa';
        if (item.prioritas === 'Santai') warnaBadge = 'badge-santai';
        if (item.prioritas === 'Mendesak') warnaBadge = 'badge-mendesak';
        
        let statusBadgeText = item.prioritas;
        if (item.isCompleted) {
            warnaBadge = 'badge-completed';
            statusBadgeText = '✅ Selesai';
        }

        let li = document.createElement('li');
        li.className = `task-item ${item.isCompleted ? 'task-completed' : ''}`;
        li.innerHTML = `
            <div class="task-item-header">
                <div>
                    <span class="task-title">${item.nama}</span>
                    <div class="task-matkul">📖 ${item.matkul}</div>
                </div>
                <span class="badge ${warnaBadge}">${statusBadgeText}</span>
            </div>
            ${item.catatan ? `<div class="task-notes">Catatan: "${item.catatan}"</div>` : ''}
            <div class="task-footer-item">
                <span class="task-date">⏰ Deadline: ${item.deadline}</span>
                <div class="task-actions">
                    <button type="button" class="complete-btn" onclick="toggleSelesai(${idx})">${item.isCompleted ? 'Batal' : 'Selesai'}</button>
                    <button type="button" class="edit-btn" onclick="editTugas(${idx})">Edit</button>
                    <button type="button" class="delete-btn" onclick="hapusTugas(${idx})">Hapus</button>
                </div>
            </div>
        `;
        listTugas.appendChild(li);
    });

    let terakhir = dataTugas[dataTugas.length - 1];
    let badgeTerakhir = 'badge-biasa';
    let labelTerakhir = terakhir.prioritas;

    if (terakhir.isCompleted) {
        badgeTerakhir = 'badge-completed';
        labelTerakhir = '✅ Selesai';
    } else {
        if (terakhir.prioritas === 'Santai') badgeTerakhir = 'badge-santai';
        if (terakhir.prioritas === 'Mendesak') badgeTerakhir = 'badge-mendesak';
    }

    prevTask.textContent = terakhir.nama;
    prevMatkul.textContent = `Matkul: ${terakhir.matkul}`;
    prevPriority.textContent = `Status: ${labelTerakhir}`;
    prevPriority.className = `badge ${badgeTerakhir}`;
}

window.editTugas = function(idx) {
    let t = dataTugas[idx];
    if (!t) return;

    inputNama.value = t.nama;
    inputMatkul.value = t.matkul;
    selectPrioritas.value = t.prioritas;
    inputDeadline.value = t.deadline;
    inputCatatan.value = t.catatan || "";
    
    inputEditIndex.value = idx;
    btnSubmit.textContent = "Perbarui Tugas";
    
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

window.hapusTugas = function(idx) {
    dataTugas.splice(idx, 1);
    if (inputEditIndex.value == idx) {
        inputEditIndex.value = "";
        btnSubmit.textContent = "Simpan Tugas";
        formTugas.reset();
    }
    tampilkanTugas();
}

/* TIMER POMODORO */
let defaultDetik = 25 * 60; 
let sisaWaktu = defaultDetik; 
let intervalTimer = null;
let waktuTarget = null; 

const tampilanTimer = document.getElementById('timer-display');
const btnMulai = document.getElementById('start-timer');
const btnJeda = document.getElementById('pause-timer');
const btnReset = document.getElementById('reset-timer');

if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
}

function bunyiAlarm() {
    try {
        let ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        function putarAlarmPanjang(waktuMulai) {
            for (let i = 0; i < 4; i++) {
                let baseTime = waktuMulai + (i * 0.6);

                [0, 0.15, 0.3].forEach((delay, index) => {
                    let osc = ctx.createOscillator();
                    let gain = ctx.createGain();
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(index === 2 ? 880 : 587.33, baseTime + delay); 
                    
                    gain.gain.setValueAtTime(0.2, baseTime + delay);
                    gain.gain.exponentialRampToValueAtTime(0.001, baseTime + delay + 0.12);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc.start(baseTime + delay);
                    osc.stop(baseTime + delay + 0.12);
                });
            }
        }

        let sekarang = ctx.currentTime;
        putarAlarmPanjang(sekarang);
        putarAlarmPanjang(sekarang + 2.8);

    } catch (err) {
        console.log("Audio diblokir browser");
    }
}

function updateTampilanTimer() {
    if (document.activeElement === tampilanTimer) return; 

    let m = Math.floor(sisaWaktu / 60);
    let s = sisaWaktu % 60;
    tampilanTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

tampilanTimer.addEventListener('blur', function() {
    let teks = tampilanTimer.textContent.trim();
    let bagian = teks.split(':');
    
    if (bagian.length === 2) {
        let m = parseInt(bagian[0]);
        let s = parseInt(bagian[1]);

        if (!isNaN(m) && !isNaN(s) && m >= 0 && s >= 0 && s < 60) {
            clearInterval(intervalTimer);
            intervalTimer = null;
            
            defaultDetik = (m * 60) + s;
            sisaWaktu = defaultDetik;
            updateTampilanTimer();
            return;
        }
    }
    
    alert("Format salah bro! Pake format MM:SS (Contoh: 30:00)");
    updateTampilanTimer();
});

tampilanTimer.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        tampilanTimer.blur();
    }
});

btnMulai.addEventListener('click', function() {
    if (intervalTimer) return; 

    tampilanTimer.blur();
    waktuTarget = Date.now() + sisaWaktu * 1000;

    intervalTimer = setInterval(() => {
        let sekarang = Date.now();
        sisaWaktu = Math.round((waktuTarget - sekarang) / 1000);

        if (sisaWaktu <= 0) {
            clearInterval(intervalTimer);
            intervalTimer = null;
            sisaWaktu = 0;
            updateTampilanTimer();
            
            bunyiAlarm();

            if (window.Notification && Notification.permission === "granted") {
                new Notification("Waktu Fokus Selesai! 🎉", {
                    body: "Mantap! Waktunya istirahat sejenak ☕.",
                });
            } else {
                alert("Waktu fokus selesai! Mantap, waktunya istirahat ☕.");
            }
            return;
        }

        updateTampilanTimer();
    }, 1000);
});

btnJeda.addEventListener('click', function() {
    clearInterval(intervalTimer);
    intervalTimer = null;
});

btnReset.addEventListener('click', function() {
    clearInterval(intervalTimer);
    intervalTimer = null;
    sisaWaktu = defaultDetik;
    updateTampilanTimer();
});

updateTampilanTimer();