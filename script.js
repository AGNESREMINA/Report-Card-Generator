
const subjectRows = document.getElementById('subjectRows');
const addSubjectBtn = document.getElementById('addSubject');
const entryForm = document.getElementById('entryForm');
const reportSection = document.getElementById('report');
const statusLine = document.getElementById('statusLine');

let subjectCount = 0;

function addSubjectRow(name = '', marks = '') {
  subjectCount++;
  const row = document.createElement('div');
  row.className = 'subject-row';
  row.innerHTML = `
    <input type="text" class="subject-name" placeholder="Subject" value="${name}" required>
    <input type="number" class="subject-marks" placeholder="Marks /100" min="0" max="100" value="${marks}" required>
    <button type="button" class="subject-row__remove" title="Remove subject">&times;</button>
  `;
  row.querySelector('.subject-row__remove').addEventListener('click', () => {
    row.remove();
  });
  subjectRows.appendChild(row);
}

addSubjectBtn.addEventListener('click', () => addSubjectRow());

addSubjectRow('Mathematics', 88);
addSubjectRow('Science', 74);
addSubjectRow('English', 91);


function getGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  if (marks >= 35) return 'E';
  return 'F';
}

function buildStudent() {
  const name = document.getElementById('nameInput').value.trim();
  const roll = document.getElementById('rollInput').value.trim();

  const subjects = Array.from(document.querySelectorAll('.subject-row')).map(row => {
    const subjectName = row.querySelector('.subject-name').value.trim();
    const marks = parseFloat(row.querySelector('.subject-marks').value);
    return { subject: subjectName, marks };
  });

  // The student object: groups related data together
  return { name, roll, subjects };
}

function evaluateStudent(student) {
  const total = student.subjects.reduce((sum, s) => sum + s.marks, 0);
  const percentage = total / student.subjects.length;
  const overallGrade = getGrade(percentage);
  const hasFailed = student.subjects.some(s => s.marks < 35);

  return { total, percentage, overallGrade, hasFailed };
}

function getRemark(result) {
  if (result.hasFailed) return 'Needs improvement in one or more subjects.';
  if (result.percentage >= 90) return 'Outstanding performance — keep it up!';
  if (result.percentage >= 75) return 'Strong performance across subjects.';
  if (result.percentage >= 60) return 'Good effort, room to grow.';
  return 'Satisfactory — more practice recommended.';
}

function renderReport(student, result) {
  document.getElementById('outName').textContent = student.name;
  document.getElementById('outRoll').textContent = `Roll No: ${student.roll}`;

  const outBody = document.getElementById('outBody');
  outBody.innerHTML = '';
  student.subjects.forEach(s => {
    const grade = getGrade(s.marks);
    const isPass = s.marks >= 35;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.subject}</td>
      <td>${s.marks}</td>
      <td class="${isPass ? 'grade-pass' : 'grade-fail'}">${grade}</td>
    `;
    outBody.appendChild(tr);
  });

  document.getElementById('outTotal').textContent = `${result.total} / ${student.subjects.length * 100}`;
  document.getElementById('outPercent').textContent = `${result.percentage.toFixed(2)}%`;
  document.getElementById('outGrade').textContent = result.overallGrade;
  document.getElementById('outRemark').textContent = getRemark(result);

  reportSection.hidden = false;
  statusLine.textContent = `Report generated for ${student.name}.`;
}

entryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const student = buildStudent();

  if (!student.name || !student.roll || student.subjects.length === 0) {
    statusLine.textContent = 'Fill in name, roll number, and at least one subject.';
    return;
  }
  if (student.subjects.some(s => Number.isNaN(s.marks))) {
    statusLine.textContent = 'Every subject needs a valid mark.';
    return;
  }

  const result = evaluateStudent(student);
  renderReport(student, result);
});
