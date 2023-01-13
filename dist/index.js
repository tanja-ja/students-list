
class Student {
  constructor(name, surname, patronymic, faculty, dateOfBirth, startDate) {
    this.name = name
    this.surname = surname
    this.patronymic = patronymic
    this.faculty = faculty
    this.dateOfBirth = dateOfBirth
    this.startDate = startDate
  }

  //Получаем ФИО
  get fullName() {
    return this.surname + ' ' + this.name + ' ' + this.patronymic
  }

  //Исправляем формат даты рождения
  getBirthDay() {
    let yyyy = this.dateOfBirth.getFullYear();
    let mm = this.dateOfBirth.getMonth() + 1;
    let dd = this.dateOfBirth.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy
  }

  //Считаем сколько лет
  getAge() {
    const date = new Date();
    let age = date.getFullYear() - this.dateOfBirth.getFullYear();
    let m = date.getMonth() - this.dateOfBirth.getMonth();

    if (m < 0 || (m === 0 && date.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
  //считаем код окончания
  get finishDate() {
    return Number(this.startDate) + 4
  }

  //Считаем на каком курсе
  getStudyPeriod() {
    const date = new Date();
    let res = date.getFullYear() - this.startDate;
    let end = Number(this.startDate) + 4;

    if (res == 0) {
      return `${this.startDate} - ${end} (1 курс)`

    } if (res < 4) {
      return `${this.startDate} - ${end} (${res} курс)`
    }
    if (date.getMonth() + 1 >= 9 && res >= 4 || res >= 4) {
      return `${this.startDate} - ${end} (Закончил(a))`;;
    }
  }
}

const students = [
  new Student('Иван', 'Иванов', 'Иванович', 'Экономический', new Date(2000, 10, 25), 2020),
  new Student('Елена', 'Петрова', 'Андреевна', 'Филологический', new Date(1992, 12, 02), 2022),
  new Student('Василий', 'Зайцев', 'Петрович', 'Энергетический', new Date(1988, 05, 12), 2006)
]
// //собираем таблицу
const studentList = document.getElementById('studentsList'),
  studentListThAll = document.querySelectorAll('.studentsTable th')

let column = 'fullName',
  direction = true;

function newStudentTR(student) {
  const studentTR = document.createElement('tr'),
    fioTD = document.createElement('td'),
    facultyTD = document.createElement('td'),
    dateOfBirthTD = document.createElement('td'),
    startDateTD = document.createElement('td')

  fioTD.textContent = student.fullName;
  facultyTD.textContent = student.faculty;
  dateOfBirthTD.textContent = `${student.getBirthDay()}` + ` (${student.getAge()}лет/год)`;
  startDateTD.textContent = student.getStudyPeriod();

  studentTR.append(fioTD);
  studentTR.append(facultyTD);
  studentTR.append(dateOfBirthTD);
  studentTR.append(startDateTD);

  return studentTR;

}
//сортировка массива
function getSortStudents(prop, dir) {
  const studentsCopy = [...students];
  return studentsCopy.sort(function (studentA, studentB) {
    if ((!dir == false ? studentA[prop] < studentB[prop] : studentA[prop] > studentB[prop]))
      return -1;
  })
}

//фильтрация
function getFilterStudent(arr, prop, value) {
  let res = [];
  copy = [...arr];
  for (const item of arr) {
    if (String(item[prop]).includes(value) == true) res.push(item);
  }
  return res;
}

//Отрисовать
function render() {
  let studentsCopy = [...students];
  studentsCopy = getSortStudents(column, direction)
  studentList.innerHTML = '';

  let filterFullName = document.getElementById('filter-fullName').value,
    filterFaculty = document.getElementById('filter-faculty').value,
    filterStartDate = document.getElementById('filter-startDate').value,
    filterFinishDate = document.getElementById('filter-finishDate').value;

  if (filterFullName != '') {
    studentsCopy = getFilterStudent(students, 'fullName', filterFullName);
  } if (filterFaculty != '') {
    studentsCopy = getFilterStudent(students, 'faculty', filterFaculty);
  } if (filterStartDate != '') {
    studentsCopy = getFilterStudent(students, 'startDate', filterStartDate);
  } if (filterFinishDate != '') {
    studentsCopy = getFilterStudent(students, 'finishDate', filterFinishDate)
  }

  for (const student of studentsCopy) {
    studentList.append(newStudentTR(student))
  }
}

//клик на заголовочную строку
studentListThAll.forEach(element => {
  element.addEventListener('click', function () {
    column = this.dataset.column;
    console.log(column);
    direction = !direction
    render();
  })
});

// фильтр при value в инпуте
let formSearch = document.querySelector('.searchForm');
let inputAll = formSearch.querySelectorAll('input');
for (let inp of inputAll) {
  inp.addEventListener('input', function () {
    render()
  })
}

// очищаем инпуты
function clearInputValue() {
  addForm.querySelectorAll('input').forEach(element => {
    element.value = '';
    textInvalid.textContent = ''
  })
}

let addForm = document.getElementById('addForm');
let inputElements = addForm.querySelectorAll('input');
let textInvalid = document.getElementById('text');


// проверка на русские буквы и удаление пробелов
function LetterCheck(inputElements) {
  let correctName = true;
  const reg = new RegExp(/[^А-яЁё ]/);
  if (reg.test(inputElements.value)) {
    showError(inputElements, 'Допустимы только русские буквы')
    console.log(reg.test(inputElements.value))
    correctName = false;

  }
  if (inputElements.value !== '') {
    let correct = inputElements.value[0].toUpperCase() + inputElements.value.slice(1).replace(/\s/g, '');
    inputElements.value = correct;

  }

  return correctName;
}
//Проверка на минимальный год обучения
function StudyStart(inputElements, min, max) {
  let correctStart = true;
  if (inputElements.value < min) {
    showError(inputElements, 'Дата начала обучения не может быть раньше 2000 года');
    correctStart = false;
  } else if (inputElements.value > max) {
    showError(inputElements, 'Дата начала обучения не может быть больше текущего года');
    correctStart = false;
  }
  return correctStart;
}

//Проверка на минимальный год
function BirthDateStart(inputElements, min, max) {
  let correctDate = true;

  if (new Date(inputElements.value) < min) {
    showError(inputElements, 'Дата рождения не может быть меньше 1900 года');
    correctDate = false;
  } else if (new Date(inputElements.value) > max) {
    showError(inputElements, 'Дата рождения не может быть больше текущей даты');
    correctDate = false;
  }
  console.log(correctDate);
  return correctDate;
}

// Показываем ошибку
function showError(input, message) {
  input.style = 'border-color: red';
  textInvalid.textContent = message;
  textInvalid.style.color = 'red'
}

//проверка на заполнение полей
function valid(inputElements) {
  let valid = false;
  inputElements.forEach(function (input) {
    if (input.value.trim() === '') {
      showError(input, 'Заполните все поля');
      valid = true;
    }
    if (valid !== true) {
      input.style = "border-color: #ced4da";
    } else {
    }
  })
  return valid
}

// Добавление

addForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const inpSurname = document.getElementById('inpSurname');
  const inpName = document.getElementById('inpName');
  const inpPatronymic = document.getElementById('inpPatronymic');
  const inpFaculty = document.getElementById('inpFaculty');
  const inpDateOfBirth = document.getElementById('inpDateOfBirth');
  const inpStartDate = document.getElementById('inpStartDate');
  let arr = [
    inpSurname,
    inpName,
    inpPatronymic,
    inpFaculty,
    inpDateOfBirth,
    inpStartDate,
  ];

  if (valid(arr) === false) {
    if (StudyStart(inpStartDate, 2000, Number(new Date().getFullYear())) === true) {
      if (BirthDateStart(inpDateOfBirth, new Date(1900, 1, 1), new Date()) === true) {
        if (LetterCheck(inpSurname) === true) {
          if (LetterCheck(inpName) === true) {
            if (LetterCheck(inpPatronymic) === true) {
              if (LetterCheck(inpFaculty) === true) {
                students.push(new Student(
                  document.getElementById('inpSurname').value,
                  document.getElementById('inpName').value,
                  document.getElementById('inpPatronymic').value,
                  document.getElementById('inpFaculty').value,
                  new Date(document.getElementById('inpDateOfBirth').value),
                  Number(document.getElementById('inpStartDate').value)
                ))
                clearInputValue()
                render();
              }
            }
          }
        }
      }
    }
  }
});

render();

