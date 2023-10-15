const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
  return+new Date()
}

function generateBookObject(id, titleBook, authorBook, yearBook, isCompleted) {
  return {
    id,
    titleBook,
    authorBook,
    yearBook,
    isCompleted
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.titleBook;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Keterangan: ' + bookObject.authorBook;

  const textYear = document.createElement('p');
  textYear.innerText = 'Deadline: ' + bookObject.yearBook;

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('action');

  const btnRemove = document.createElement('button');
  btnRemove .classList.add('red');
  btnRemove .setAttribute('id', 'btn-remove ');
  btnRemove .innerText = 'Hapus';

  const articleContainer = document.createElement('article');
  articleContainer.classList.add('book_item');
  articleContainer.append(textTitle, textAuthor, textYear, btnContainer);
  articleContainer.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const btnUndo = document.createElement('button');
    btnUndo.classList.add('blue');
    btnUndo.setAttribute('id', 'btn-undo');
    btnUndo.innerText = 'Belum Dikerjakan';

    btnUndo.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
    btnRemove.addEventListener('click', function () {
      removeBookFromShelf(bookObject.id);
    });

    btnContainer.append(btnUndo, btnRemove);
    articleContainer.append(btnContainer);
  } else {
    const btnDone = document.createElement('button');
    btnDone.classList.add('green');
    btnDone.setAttribute('id', 'btn-done');
    btnDone.innerText = ' Selesai Dikerjakan';

    btnDone.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
    btnRemove.addEventListener('click', function () {
      removeBookFromShelf(bookObject.id);
    });

    btnContainer.append(btnDone, btnRemove);
    articleContainer.append(btnContainer);
  }

  return articleContainer;
}

function addBook() {
  const titleBook = document.getElementById('inputBookTitle').value;
  const authorBook = document.getElementById('inputBookAuthor').value;
  const yearBook = document.getElementById('inputBookYear').value;
  const statusCheckBox = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, statusCheckBox);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromShelf(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

const checkbox = document.getElementById('inputBookIsComplete');
let check = false;

checkbox.addEventListener('change', function () {
  if (checkbox.checked) {
    check = true;

    document.querySelector('span').innerText = 'Selesai Dikerjakan';
  } else {
    check = false;

    document.querySelector('span').innerText = 'Belum  Dikerjakan';
  }
});

document.getElementById('searchBook').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
  const bookList = document.querySelectorAll('.book_item > h3');
  for (const book of bookList) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
      book.parentElement.style.display = 'block';
    } else {
      book.parentElement.style.display = 'none';
    }
  }
});