// --- FITUR PUSH NOTIFICATION & TOAST REMINDER ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast`;
    toast.innerHTML = `<span>${type === 'warning' ? '⚠️' : '🔔'}</span> <div>${message}</div>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

function triggerPushNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: body, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' });
    }
}

function checkDeadlineReminders() {
    let tasks = JSON.parse(localStorage.getItem('study_planner_tasks')) || [];
    let today = new Date();
    today.setHours(0,0,0,0);

    tasks.forEach(t => {
        if (!t.isCompleted && t.deadline) {
            let deadlineDate = new Date(t.deadline + "T00:00:00");
            let diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                let msg = `Deadline tugas "${t.nama}" (${t.matkul}) tinggal BESOK!`;
                showToast(msg, 'warning');
                triggerPushNotification("Pengingat Tugas", msg);
            } else if (diffDays === 0) {
                let msg = `Deadline tugas "${t.nama}" (${t.matkul}) HARI INI!`;
                showToast(msg, 'warning');
                triggerPushNotification("Pengingat Tugas Mendesak", msg);
            }
        }
    });
}
setTimeout(checkDeadlineReminders, 1500);

// --- PROTEKSI KLIK KANAN ---
function showSecurityModal(msg) {
    document.getElementById('security-message').textContent = msg;
    document.getElementById('security-modal').classList.add('active');
}

document.getElementById('close-security-modal').addEventListener('click', () => {
    document.getElementById('security-modal').classList.remove('active');
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showSecurityModal("Akses klik kanan dibatasi demi keamanan kode sumber aplikasi.");
});

document.addEventListener('keydown', function(e) {
    if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
    ) {
        e.preventDefault();
        showSecurityModal("Akses inspeksi elemen dan shortcut dibatasi demi keamanan kode sumber.");
        return false;
    }
});

// --- ELEMEN UTAMA ---
const formTugas = document.getElementById('task-form');
const inputNama = document.getElementById('task-name');
const inputMatkul = document.getElementById('task-matkul');
const selectPrioritas = document.getElementById('task-priority');
const inputDeadline = document.getElementById('task-date');
const inputCatatan = document.getElementById('task-notes');
const inputFile = document.getElementById('task-file');
const listTugas = document.getElementById('task-list');
const inputEditIndex = document.getElementById('task-edit-index');
const btnSubmit = document.getElementById('submit-btn');
const previewActiveList = document.getElementById('preview-active-list');
const filterMatkulSelect = document.getElementById('filter-matkul');

// --- DARK MODE ---
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

let dataTugas = JSON.parse(localStorage.getItem('study_planner_tasks')) || [];

// --- TARGET UJIAN COUNTDOWN ---
let targetUtsDate = localStorage.getItem('uts_target_date') || "2026-10-25";
const utsModal = document.getElementById('uts-modal');
const modalUtsDateInput = document.getElementById('modal-uts-date');

document.getElementById('open-uts-modal').addEventListener('click', () => {
    modalUtsDateInput.value = targetUtsDate;
    utsModal.classList.add('active');
});

document.getElementById('close-uts-modal').addEventListener('click', () => {
    utsModal.classList.remove('active');
});

document.getElementById('save-uts-date').addEventListener('click', () => {
    let selectedDate = modalUtsDateInput.value;
    if (selectedDate) {
        targetUtsDate = selectedDate;
        localStorage.setItem('uts_target_date', targetUtsDate);
        updateCountdown();
        utsModal.classList.remove('active');
    } else {
        alert("Silakan pilih tanggal yang valid.");
    }
});

function updateCountdown() {
    const targetDate = new Date(targetUtsDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    if (diffDays > 0) {
        timerElement.textContent = `H - ${diffDays} (${diffDays} Hari Lagi)`;
    } else if (diffDays === 0) {
        timerElement.textContent = `🔥 Ujian Berlangsung Hari Ini!`;
    } else {
        timerElement.textContent = `⚠️ Ujian Telah Lewat (${Math.abs(diffDays)} Hari)`;
    }
}
updateCountdown();

// --- LOGIKA KALENDER BULANAN ---
let currentCalendarDate = new Date();

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearTitle = document.getElementById('calendar-month-year');
    if (!calendarGrid || !monthYearTitle) return;

    calendarGrid.innerHTML = "";

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthYearTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= totalDays; day++) {
        let dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let dayCell = document.createElement('div');
        dayCell.className = `calendar-day ${dateStr === todayStr ? 'today' : ''}`;
        
        let dayNum = document.createElement('div');
        dayNum.className = 'calendar-day-number';
        dayNum.textContent = day;
        dayCell.appendChild(dayNum);

        let dayTasks = dataTugas.filter(t => t.deadline === dateStr && !t.isCompleted);
        if (dayTasks.length > 0) {
            let dotsContainer = document.createElement('div');
            dotsContainer.className = 'calendar-dots';
            dayTasks.forEach(t => {
                let dot = document.createElement('span');
                dot.className = `task-dot ${t.prioritas === 'Mendesak' ? 'mendesak' : ''}`;
                dotsContainer.appendChild(dot);
            });
            dayCell.appendChild(dotsContainer);
        }

        dayCell.addEventListener('click', () => showCalendarDayTasks(dateStr, day, monthNames[month], year));
        calendarGrid.appendChild(dayCell);
    }
}

function showCalendarDayTasks(dateStr, day, monthName, year) {
    const title = document.getElementById('selected-date-title');
    const taskList = document.getElementById('selected-date-tasks');
    if (!title || !taskList) return;

    title.textContent = `Tugas pada ${day} ${monthName} ${year}`;
    taskList.innerHTML = "";

    let dayTasks = dataTugas.filter(t => t.deadline === dateStr);
    if (dayTasks.length === 0) {
        taskList.innerHTML = `<li class="empty-state">Tidak ada deadline tugas di tanggal ini.</li>`;
        return;
    }

    dayTasks.forEach(t => {
        let li = document.createElement('li');
        li.className = 'preview-item';
        li.innerHTML = `
            <div>
                <div class="preview-item-title">${t.nama} ${t.isCompleted ? '✅' : ''}</div>
                <div class="preview-item-sub">📖 ${t.matkul} (${t.prioritas})</div>
            </div>
            <div class="preview-item-date">⏰ ${t.deadline}</div>
        `;
        taskList.appendChild(li);
    });
}

document.getElementById('prev-month-btn').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month-btn').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
});

// --- MANAJEMEN TUGAS ---
function updateMatkulFilterOptions() {
    let currentVal = filterMatkulSelect.value;
    let matkulList = [...new Set(dataTugas.map(t => t.matkul))];
    
    filterMatkulSelect.innerHTML = `<option value="all">Semua Matkul</option>`;
    matkulList.forEach(m => {
        let opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        filterMatkulSelect.appendChild(opt);
    });
    filterMatkulSelect.value = matkulList.includes(currentVal) ? currentVal : 'all';
}

filterMatkulSelect.addEventListener('change', () => tampilkanTugas());

formTugas.addEventListener('submit', function(e) {
    e.preventDefault();

    let nama = inputNama.value.trim();
    let matkul = inputMatkul.value.trim();
    let prioritas = selectPrioritas.value;
    let deadline = inputDeadline.value;
    let catatan = inputCatatan.value.trim();
    let indexEdit = inputEditIndex.value;

    let processTaskData = (fileName = null, fileData = null) => {
        let taskObj = {
            nama,
            matkul,
            prioritas,
            deadline,
            catatan,
            fileName: fileName || (indexEdit !== "" ? dataTugas[indexEdit].fileName : null),
            fileData: fileData || (indexEdit !== "" ? dataTugas[indexEdit].fileData : null),
            isCompleted: indexEdit !== "" ? dataTugas[indexEdit].isCompleted : false
        };

        if (indexEdit === "" || indexEdit < 0) {
            dataTugas.push(taskObj);
            showToast(`Tugas "${nama}" berhasil disimpan!`);
        } else {
            dataTugas[indexEdit] = taskObj;
            inputEditIndex.value = "";
            btnSubmit.textContent = "Simpan Tugas";
            showToast(`Tugas "${nama}" diperbarui!`);
        }

        simpanDanTampilkan();
        formTugas.reset();
    };

    if (inputFile.files && inputFile.files[0]) {
        let reader = new FileReader();
        let uploadedFile = inputFile.files[0];
        reader.onload = function (uploadEvent) {
            processTaskData(uploadedFile.name, uploadEvent.target.result);
        };
        reader.readAsDataURL(uploadedFile);
    } else {
        processTaskData();
    }
});

function simpanDanTampilkan() {
    localStorage.setItem('study_planner_tasks', JSON.stringify(dataTugas));
    updateMatkulFilterOptions();
    tampilkanTugas();
    renderCalendar();
}

window.toggleSelesai = function(idx) {
    if (dataTugas[idx]) {
        dataTugas[idx].isCompleted = !dataTugas[idx].isCompleted;
        simpanDanTampilkan();
    }
}

function tampilkanTugas() {
    listTugas.innerHTML = "";
    let selectedMatkul = filterMatkulSelect.value;

    let filteredData = dataTugas.filter(item => {
        if (selectedMatkul === 'all') return true;
        return item.matkul === selectedMatkul;
    });

    if (filteredData.length === 0) {
        listTugas.innerHTML = `<li class="empty-state">Tidak ada tugas untuk kategori ini.</li>`;
    }

    filteredData.forEach((item) => {
        let realIdx = dataTugas.indexOf(item);
        let statusBadgeText = item.prioritas;
        if (item.isCompleted) {
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
                <span style="font-size: 0.8rem; font-weight: 600; color: #6366f1;">${statusBadgeText}</span>
            </div>
            ${item.catatan ? `<div class="task-notes">Catatan: "${item.catatan}"</div>` : ''}
            ${item.fileName ? `<div style="margin-top: 4px;"><a href="${item.fileData}" download="${item.fileName}" class="task-file-link">📎 Lampiran: ${item.fileName}</a></div>` : ''}
            <div class="task-footer-item">
                <span class="task-date">⏰ Deadline: ${item.deadline}</span>
                <div class="task-actions">
                    <button type="button" class="complete-btn" onclick="toggleSelesai(${realIdx})">${item.isCompleted ? 'Batal' : 'Selesai'}</button>
                    <button type="button" class="edit-btn" onclick="editTugas(${realIdx})">Edit</button>
                    <button type="button" class="delete-btn" onclick="hapusTugas(${realIdx})">Hapus</button>
                </div>
            </div>
        `;
        listTugas.appendChild(li);
    });

    previewActiveList.innerHTML = "";
    let tugasKuliahAktif = dataTugas.filter(t => !t.isCompleted);

    if (tugasKuliahAktif.length > 0) {
        tugasKuliahAktif.forEach(t => {
            let itemDiv = document.createElement('div');
            itemDiv.className = 'preview-item';
            itemDiv.innerHTML = `
                <div>
                    <div class="preview-item-title">${t.nama}</div>
                    <div class="preview-item-sub">📖 ${t.matkul}</div>
                </div>
                <div class="preview-item-date">⏳ ${t.deadline}</div>
            `;
            previewActiveList.appendChild(itemDiv);
        });
    } else {
        previewActiveList.innerHTML = `<p class="preview-empty">Semua tugas kuliah aman! Belum ada deadline mendesak.</p>`;
    }
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
    simpanDanTampilkan();
}

document.getElementById('export-btn').addEventListener('click', () => {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataTugas, null, 2));
    let downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "study_planner_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

document.getElementById('import-file').addEventListener('change', (e) => {
    let fileReader = new FileReader();
    if (e.target.files[0]) {
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = (event) => {
            try {
                let imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    dataTugas = imported;
                    simpanDanTampilkan();
                    alert("Data tugas berhasil diimpor!");
                } else {
                    alert("Format file JSON tidak valid.");
                }
            } catch (err) {
                alert("Gagal membaca file JSON.");
            }
        };
    }
});

/* TIMER POMODORO & LOFI AUDIO */
let defaultDetik = 25 * 60; 
let sisaWaktu = defaultDetik; 
let intervalTimer = null;
let waktuTarget = null; 

const tampilanTimer = document.getElementById('timer-display');
const btnMulai = document.getElementById('start-timer');
const btnJeda = document.getElementById('pause-timer');
const btnReset = document.getElementById('reset-timer');

let audioCtx = null;
let lofiInterval = null;
let isRainActive = false;
let isCafeActive = false;

function stopLofiMusic() {
    if (lofiInterval) {
        clearInterval(lofiInterval);
        lofiInterval = null;
    }
    if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
        audioCtx = null;
    }
    document.getElementById('ambient-rain').classList.remove('active');
    document.getElementById('ambient-cafe').classList.remove('active');
    isRainActive = false;
    isCafeActive = false;
}

function playLofiChill(type) {
    stopLofiMusic();
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const chords = [
        [220.00, 261.63, 329.63, 392.00], 
        [174.61, 220.00, 261.63, 329.63], 
        [130.81, 164.81, 196.00, 246.94], 
        [196.00, 246.94, 293.66, 349.23]  
    ];
    
    let chordIndex = 0;

    function playChord(chordFreqs) {
        if (!audioCtx) return;
        chordFreqs.forEach((freq) => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            let filter = audioCtx.createBiquadFilter();

            osc.type = type === 'rain' ? 'sine' : 'triangle'; 
            osc.frequency.setValueAtTime(freq / (type === 'rain' ? 1 : 2), audioCtx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(350, audioCtx.currentTime); 

            gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 1.2); 
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.0); 

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 4.0);
        });
    }

    playChord(chords[0]);
    lofiInterval = setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        playChord(chords[chordIndex]);
    }, 4000);

    if (type === 'rain') {
        isRainActive = true;
        document.getElementById('ambient-rain').classList.add('active');
    } else {
        isCafeActive = true;
        document.getElementById('ambient-cafe').classList.add('active');
    }
}

document.getElementById('ambient-rain').addEventListener('click', () => {
    if (isRainActive) stopLofiMusic(); else playLofiChill('rain');
});

document.getElementById('ambient-cafe').addEventListener('click', () => {
    if (isCafeActive) stopLofiMusic(); else playLofiChill('cafe');
});

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
    alert("Format salah! Pake format MM:SS (Contoh: 30:00)");
    updateTampilanTimer();
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
            stopLofiMusic();
            alert("Waktu fokus selesai! Mantap, waktunya istirahat ☕.");
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

// Inisialisasi awal
updateMatkulFilterOptions();
tampilkanTugas();
renderCalendar();
updateTampilanTimer();