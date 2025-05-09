// โหลดไฟล์ local candidates_PG18.json
fetch('candidates_PG18.json')
  .then(r => r.json())
  .then(data => { candidateData = data; })
  .catch(e => alert("โหลดข้อมูล candidates_PG18.json ไม่สำเร็จ!"));

function showSection(section) {
  const pages = ["section-home", "section-check", "section-wheel"];
  pages.forEach(id => document.getElementById(id).classList.remove("active"));
  document.getElementById(section).classList.add("active");

  document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
  document.getElementById("nav-" + section.replace('section-', '')).classList.add('active');

  if (section === "section-check") {
    setTimeout(() => { document.getElementById("input-fname").focus(); }, 400);
  }
}

// เมนู
document.getElementById("nav-home").onclick = e => { e.preventDefault(); showSection('section-home'); }
document.getElementById("nav-check").onclick = e => { e.preventDefault(); showSection('section-check'); }
document.getElementById("nav-wheel").onclick = e => { e.preventDefault(); showSection('section-wheel'); }
document.getElementById("sec-check").onclick = e => { e.preventDefault(); showSection('section-check'); }

// Modal
function showModal(html) {
  document.getElementById("modal-content").innerHTML = html;
  document.getElementById("modal-bg").classList.add("active");
}
function closeModal() {
  document.getElementById("modal-bg").classList.remove("active");
}
document.getElementById("modal-close").onclick = closeModal;
document.getElementById("modal-bg").onclick = function(e) {
  if (e.target === this) closeModal();
}
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});

// ------ ฟังก์ชันค้นหา ------
function findCandidateById(idInput) {
  for (const section in candidateData) {
    for (const candidate of candidateData[section]) {
      if (candidate.interviewRefNo && candidate.interviewRefNo.toUpperCase() === idInput) {
        return candidate;
      }
    }
  }
  return null;
}
function findCandidateByName(firstName, lastName) {
  for (const section in candidateData) {
    for (const candidate of candidateData[section]) {
      if (
        candidate.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
        candidate.lastName.trim().toLowerCase() === lastName.trim().toLowerCase()
      ) {
        return candidate;
      }
    }
  }
  return null;
}

// ตรวจสอบผล
document.getElementById("checkForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("input-fname").value.trim();
  const lastName = document.getElementById("input-lname").value.trim();
  const idInput = document.getElementById("input-id").value.trim().toUpperCase();

  // ถ้ากรอกเลขประจำตัว -> ค้นโดย interviewRefNo
if (idInput) {
    const person = findCandidateById(idInput);
    if (person) {
      const majorDisplay = person.major.replace(/_/g, ' ');
      showModal(`🎉 ยินดีด้วย<br>
        <b>คุณ ${person.firstName} ${person.lastName}</b><br>
        เลขประจำตัว: <b>${person.interviewRefNo}</b><br>
        ผ่านเข้ารอบสัมภาษณ์ในสาขา<br>
        <b>${majorDisplay}</b>`);
    } else {
      showModal(`❌ ไม่พบข้อมูลของคุณในระบบ<br>>โปรดติดต่อ <a href="https://www.facebook.com/ywcth" target="_blank">Facebook YWC</a>`);
    }
    return;
  }
  

  // ถ้าไม่มีเลข, ต้องกรอกชื่อ-สกุลให้ครบ
  if (!firstName || !lastName) {
    if (!firstName && lastName) {
      showModal(`<div class="modal-warning">❗กรุณากรอกชื่อให้ครบ❗</div>`);
    } else if (!lastName && firstName) {
      showModal(`<div class="modal-warning">❗กรุณากรอกนามสกุลให้ครบ❗</div>`);
    } else {
      showModal("❗ กรุณากรอกชื่อ-นามสกุล หรือเลขประจำตัว<br>");
    }
    return;
  }

  /// ค้นหาชื่อ-สกุล
const person = findCandidateByName(firstName, lastName);
if (person) {
  const majorDisplay = person.major.replace(/_/g, ' ');
  showModal(`🎉 ยินดีด้วย<br>
    <b>คุณ ${person.firstName} ${person.lastName}</b><br>
    เลขประจำตัว: <b>${person.interviewRefNo}</b><br>
    ผ่านการคัดเลือกในสาขา<br>
    <b>${majorDisplay}</b>`);
} else {
  showModal(`❌ ไม่พบข้อมูลของคุณในระบบ<br><br>โปรดติดต่อ <a href="https://www.facebook.com/YWC.in.th" target="_blank">Facebook YWC</a>`);
}
});

// ตั้งพื้นหลัง 8 ชิ้น (45° ต่อชิ้น)
const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spin-button");
let currentRotation = 0;

spinButton.addEventListener("click", () => {
  // 1) สุ่มมุมหมุน (อยากได้กี่รอบก็ปรับ +360°×n)
  const spinAmount = Math.floor(Math.random() * 360) + 3600; 
  const start = currentRotation;
  const end = currentRotation + spinAmount;

  // 2) สร้าง animation ใหม่ทุกครั้ง (1s ease-out)
  const anim = wheel.animate(
    [
      { transform: `rotate(${start}deg)` },
      { transform: `rotate(${end}deg)` },
    ],
    {
      duration: 1000,    // เวลา 1 วินาที เหมือนเดิมทุกรอบ
      easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    }
  );

  // 3) เมื่อ animation จบ ให้ตั้ง transform ไว้ที่มุมสุดท้าย
  anim.onfinish = () => {
    currentRotation = end % 360;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    // แล้วคำนวณผล
    const letters = ["ติด","ติด","ติด","ไม่ติด","ติด","ไม่ติด","ติด","ไม่ติด"];
    const normalized = currentRotation;
    let segment = Math.floor((360 - normalized) / 45);
    if (segment === 8) segment = 1;
    else segment += 1;
    alert(`ผลลัพธ์ที่ได้คือ ${letters[segment-1]} !`);
  };
});
