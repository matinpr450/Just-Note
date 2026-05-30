const state = {
   notes: [],
   activeNoteId: null,
   settings: {}
};

const app = document.querySelector('.app');

function openNote(noteId) {
   state.activeNoteId = noteId;
   saveState();
   render();
}

function closeNote(note) {
   if (state.notes.find(note0 => note0.id == note.id)) {
      const updatedNote = state.notes.find(note0 => note0.id == note.id)
      updatedNote.title = note.title;
      updatedNote.text = note.text;
   } else {
      state.notes = [...state.notes, note];
   }
   state.activeNoteId = null;
   saveState();
   render();
}

function removeNote(noteId) {
   state.notes = state.notes.filter(note => note.id != noteId);
   saveState();
   render();
}

function render() {
   if (state.activeNoteId == null) {
      app.innerHTML = `
            <header class="app__header">
               <button class="app__header-btn app__add-note-btn">New Note</button>
               <button class="app__header-btn app__settings-btn">Settings</button>
            </header>
            <div class="app__note-list"></div>
         `;

      if (state.notes.length > 0) {
         const noteList = app.querySelector('.app__note-list');
         state.notes.forEach(note => noteList.appendChild(getNoteEl(note)));
      }
   } else {
      renderEditor(state.activeNoteId);
   }

   attachEvents();
}

function renderEditor(noteId) {
   let note = {};
   if (noteId == -1) {
      note = {
         id: -1,
         title: '',
         text: ''
      }
   } else {
      note = state.notes.find(note => note.id == noteId);
   }
   app.innerHTML = `
         <header class="editor__header">
            <button class="editor__close-btn"><i class="fa-solid fa-remove"></i></button>
            <button class="editor__add-note-btn">New Note</button>
            <button class="editor__tools-btn">Tools</button>
         </header>
         <div class="editor__edit-section">
            <input type="text" class="editor__title" value="${note.title}">
            <textarea class="editor__text">${note.text}</textarea>
         </div>
      `;
}

function getNoteEl(note) {
   const noteEl = document.createElement('div');
   noteEl.classList.add('note');
   noteEl.dataset.id = note.id;

   noteEl.innerHTML = `
         <div class="note__head">
            <button class="note__title">${note.title}</button>
            <button class="note__remove-btn"><i class="fa-solid fa-remove"></i></button>
         </div>
         <p class="note__text">${note.text.length < 255 ? note.text : `${note.text.slice(0, 255)}...`}</p>
      `;

   return noteEl;
}

function attachEvents() {
   if (state.activeNoteId == null) {
      const addNoteBtn = app.querySelector('.app__add-note-btn');
      const settingBtn = app.querySelector('.app__settings-btn');
      const noteEls = [...app.querySelectorAll('.app__note-list .note')];

      addNoteBtn.addEventListener('click', () => openNote(-1));
      noteEls.forEach(noteEl => {
         noteEl.querySelector('.note__title').onclick = () => openNote(noteEl.dataset.id);
         noteEl.querySelector('.note__remove-btn').onclick = () => removeNote(noteEl.dataset.id);
      });
   } else {
      const editorTitle = app.querySelector('.editor__title');
      const editorText = app.querySelector('.editor__text');
      const closeBtn = app.querySelector('.editor__close-btn');
      const addNoteBtn = app.querySelector('.editor__add-note-btn');
      const toolsBtn = app.querySelector('.editor__tools-btn');
      let id = '';

      if (state.activeNoteId != -1) {
         const activeNote = state.notes.find(note => note.id == state.activeNoteId);
         editorTitle.value = activeNote.title;
         id = activeNote.id;
         editorText.value = activeNote.text;
      } else {
         id = Date.now();
      }

      closeBtn.onclick = () => closeNote({ id, title: editorTitle.value, text: editorText.value });
      addNoteBtn.onclick = () => {
         closeNote({ id, title: editorTitle.value, text: editorText.value });
         openNote(-1);
      }
   }
}

function saveState() {
   localStorage.setItem('state', JSON.stringify(state));
}

function restoreState() {
   if (localStorage.getItem('state') != null) {
      Object.assign(state, JSON.parse(localStorage.getItem('state')));
      render();
   }
}

window.onload = restoreState;
window.onbeforeunload = () => {
   if (state.activeNoteId != null) {
      closeNote(state.activeNoteId);
   }
};

render();