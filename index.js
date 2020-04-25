const ADD_NEW_NOTE = "Add new note";
const ADD_NEW_SUBTASK = "Create subtask";
const GIVE_NOTE_TITLE = "Give your note a title";
const WRITE_NOTE_TEXT = "Please write your note here";
const GIVE_SUBTASK_TITLE = "Give your subtask a title";
const WRITE_SUBTASK_TEXT = "Please write your subtask here";
const NOTE_ADD_MSG = "Note added successfully";
const SUBTASK_ADD_MSG = "Subtask added successfully";
const NO_NOTES_TO_DISPLAY = "No notes to display";
const EMPTY_STRING = "";

let notesStorage = JSON.parse(localStorage.getItem("notes"));
let notesData = (notesStorage && notesStorage.notesData) || {};
let isNewlyAdded = false;

const searchNotes = (event) => {
  const notesToSearch = { ...notesData };
  const filtered = Object.keys(notesToSearch)
    .filter((key) =>
      JSON.stringify(notesToSearch[key])
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    )
    .reduce((obj, key) => {
      obj[key] = notesToSearch[key];
      return obj;
    }, {});
  isNewlyAdded = false;
  let notesNode = document.getElementById("notes");
  notesNode.innerHTML = EMPTY_STRING;
  notesNode.appendChild(renderNotes(filtered, EMPTY_STRING, "notes"));
};

function sortKeys(obj_1) {
  var key = Object.keys(obj_1).sort(function order(key1, key2) {
    if (key2 < key1) return -1;
    else if (key2 > key1) return +1;
    else return 0;
  });

  // Taking the object in 'temp' object
  // and deleting the original object.
  var temp = {};

  for (var i = 0; i < key.length; i++) {
    temp[key[i]] = obj_1[key[i]];
    delete obj_1[key[i]];
  }

  // Copying the object from 'temp' to
  // 'original object'.
  for (var i = 0; i < key.length; i++) {
    obj_1[key[i]] = temp[key[i]];
  }
  return obj_1;
}

function setSubTask(path, value) {
  let currentTime = new Date();
  let way = path.slice();
  let last = way.pop();
  way.reduce(function (r, a) {
    return (r[a] = r[a] || {});
  }, notesData)[last][currentTime.getTime()] = value;
  localStorage.setItem("notes", JSON.stringify({ notesData }));
}

const createNote = (event, noteTitle, noteText, path) => {
  event.preventDefault();
  let currentTime = new Date();
  if (path === EMPTY_STRING) {
    notesData[currentTime.getTime()] = {
      noteTitle: noteTitle.value,
      noteText: noteText.value,
      subTask: {},
    };
  } else {
    subTask = {
      noteTitle: noteTitle.value,
      noteText: noteText.value,
      subTask: {},
    };
    let valuePath = path.split(".");
    setSubTask(valuePath, subTask);
  }
  noteTitle.value = EMPTY_STRING;
  noteText.value = EMPTY_STRING;
  sortedData = sortKeys(notesData);
  localStorage.setItem("notes", JSON.stringify({ notesData: sortedData }));
  let notes = document.getElementById("notes");
  notes.innerHTML = EMPTY_STRING;
  isNewlyAdded = true;
  notes.appendChild(renderNotes(notesData, EMPTY_STRING, "notes"));
};

const createForm = (
  buttonext,
  id,
  path = EMPTY_STRING,
  titlePlace,
  textPlace
) => {
  let submit = document.createElement("input");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", buttonext);
  submit.setAttribute("class", "btn btn-success");

  let inputTitle = document.createElement("input");
  inputTitle.setAttribute("placeholder", titlePlace);
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("class", "card");
  inputTitle.setAttribute("required", "true");

  let textArea = document.createElement("textarea");
  textArea.setAttribute("placeholder", textPlace);
  textArea.setAttribute("class", "card");
  textArea.setAttribute("required", "true");

  let form = document.createElement("form");
  form.setAttribute("class", "add-note-form");
  form.setAttribute("id", id);

  form.appendChild(inputTitle);
  form.appendChild(textArea);
  form.appendChild(submit);

  form.addEventListener("submit", (e) =>
    createNote(event, inputTitle, textArea, path)
  );
  return form;
};

const deleteValue = (path) => {
  let way = path.slice();
  let last = way.pop();

  delete way.reduce(function (r, a) {
    return (r[a] = r[a] || {});
  }, notesData)[last];
  localStorage.setItem("notes", JSON.stringify({ notesData }));
  let notes = document.getElementById("notes");
  notes.innerHTML = EMPTY_STRING;
  isNewlyAdded = false;
  notes.appendChild(renderNotes(notesData, EMPTY_STRING, "notes"));
};

const deleteNote = (event, key) => {
  event.stopPropagation();
  let valuePath = key.split(".");
  deleteValue(valuePath);
};

const enableField = (e) => {
  e.target.readOnly = false;
};

const disableField = (e) => {
  e.target.readOnly = true;
};

function setValue(path, value) {
  let way = path.slice();
  let last = way.pop();

  way.reduce(function (r, a) {
    return (r[a] = r[a] || {});
  }, notesData)[last] = value;
  localStorage.setItem("notes", JSON.stringify({ notesData }));
}

const disablePropagation = (event) => {
  event.stopPropagation();
};

const updateField = (event) => {
  let valuePath = event.target.dataset.path.split(".");
  setValue(valuePath, event.target.value);
};

const subTaskForm = (element, event) => {
  event.stopPropagation();
  let subTaskForm = document.getElementsByClassName("subTaskForm");
  if (subTaskForm) {
    [].slice.call(subTaskForm).forEach(function (div) {
      div.innerHTML = EMPTY_STRING;
    });
  }
  element.appendChild(
    createForm(
      ADD_NEW_SUBTASK,
      "sub-task",
      event.target.dataset.path,
      GIVE_SUBTASK_TITLE,
      WRITE_SUBTASK_TEXT
    )
  );
};

resetElement = (element) => {
  element.innerHTML = EMPTY_STRING;
  element.setAttribute("class", EMPTY_STRING);
  element.setAttribute("id", EMPTY_STRING);
};

const renderNotes = (notes, currentPath, noteType) => {
  let ul = document.createElement("ul");
  ul.setAttribute("class", `${noteType}-list p-0 m-0`);
  let emptyli = document.createElement("li");
  emptyli.classList.add("empty-section");
  isNewlyAdded && ul.appendChild(emptyli);
  if (notes && Object.keys(notes).length) {
    let index = 0;
    for (key in notes) {
      let li = document.createElement("li");
      li.setAttribute("class", `${noteType}-card card py-2 px-3 mt-2`);
      !index && isNewlyAdded && li.classList.add("note-added-animation");
      isNewlyAdded = false;
      const valuePath =
        !currentPath || currentPath === EMPTY_STRING
          ? EMPTY_STRING + key
          : currentPath + "." + key;
      let div = document.createElement("div");
      let button = document.createElement("button");
      let span = document.createElement("span");

      div.setAttribute("class", "d-flex justify-content-end mb-2");
      button.onclick = (event) => deleteNote(event, valuePath);
      button.classList.add("close");

      span.innerHTML = "&times";

      button.appendChild(span);
      div.appendChild(button);

      li.appendChild(div);

      let h4 = document.createElement("h4");
      let inputTitleEl = document.createElement("input");
      inputTitleEl.setAttribute("data-currentValue", notes[key].noteTitle);
      inputTitleEl.setAttribute("data-path", `${valuePath}.noteTitle`);
      inputTitleEl.onchange = (event) => updateField(event);
      inputTitleEl.onclick = (event) => enableField(event);
      inputTitleEl.addEventListener("focusout", (event) => disableField(event));
      inputTitleEl.setAttribute("readonly", "true");
      inputTitleEl.setAttribute("class", "card w-100 px-2");
      inputTitleEl.setAttribute("value", notes[key].noteTitle);

      h4.appendChild(inputTitleEl);

      li.appendChild(h4);

      let p = document.createElement("p");
      let textarea = document.createElement("textarea");
      textarea.setAttribute("data-currentValue", notes[key].noteText);
      textarea.setAttribute("data-path", `${valuePath}.noteText`);
      textarea.onchange = (event) => updateField(event);
      textarea.onclick = (event) => enableField(event);
      textarea.addEventListener("focusout", (event) => disableField(event));
      textarea.setAttribute("readonly", "true");
      textarea.setAttribute("class", "card w-100 px-2");
      textarea.innerHTML = notes[key].noteText;

      p.classList.add("mr-0");
      p.appendChild(textarea);

      li.appendChild(p);
      if (notes[key].subTask && Object.keys(notes[key].subTask).length) {
        li.appendChild(
          renderNotes(notes[key].subTask, `${valuePath}.subTask`, "subtask")
        );
      }

      let subTaskFormEl = document.createElement("div");
      subTaskFormEl.setAttribute("class", `subTaskForm mt-3`);
      subTaskFormEl.onclick = (event) => disablePropagation(event);

      li.appendChild(subTaskFormEl);

      let subTaskButtonEl = document.createElement("div");
      let subTaskButton = document.createElement("button");

      subTaskButtonEl.setAttribute("class", "subtask mt-2");

      subTaskButton.setAttribute("class", "btn btn-outline-info");
      subTaskButton.setAttribute("data-path", `${valuePath}.subTask`);
      subTaskButton.onclick = (event) => subTaskForm(subTaskFormEl, event);

      subTaskButtonEl.appendChild(subTaskButton);
      subTaskButton.innerHTML = `subtask<sup>+</sup>`;

      li.appendChild(subTaskButtonEl);

      ul.appendChild(li);
      index++;
    }
    return ul;
  }

  let span = document.createElement("span");
  span.setAttribute("class", "card p-2 my-2");
  span.innerHTML = NO_NOTES_TO_DISPLAY;
  return span;
};

function renderSections() {
  let form = document.getElementById("createForm");
  form.appendChild(
    createForm(
      ADD_NEW_NOTE,
      "note",
      EMPTY_STRING,
      GIVE_NOTE_TITLE,
      WRITE_NOTE_TEXT
    )
  );

  let notes = document.getElementById("notes");
  notes.appendChild(renderNotes(notesData, EMPTY_STRING, "notes"));
}

renderSections();

document.onclick = () => {
  let subTaskForm = document.getElementsByClassName("subTaskForm");
  if (subTaskForm) {
    [].slice.call(subTaskForm).forEach(function (div) {
      div.innerHTML = EMPTY_STRING;
    });
  }
};
