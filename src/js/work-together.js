import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const emailInput = document.querySelector('#work-together-input-email');
const commentsInput = document.querySelector('#work-together-input-comments');
const emailSucces = document.querySelector('.email-succes');
const emailInvalid = document.querySelector('.email-invalid');
const formFooter = document.querySelector('.footer-form');
const modalBackdropFooter = document.querySelector('.modal-backdrop-footer');
const modalFooter = document.querySelector('.modal-footer');
const localStorageKey = 'work-together';
let formDataFooter = {
  email: '',
  comments: '',
};
axios.defaults.baseURL = 'https://portfolio-js.b.goit.study';

if (Boolean(localStorage.getItem(localStorageKey))) {
  const savedData = localStorage.getItem(localStorageKey);
  formDataFooter = JSON.parse(savedData);
  commentsInput.value = formDataFooter.comments;
  emailInput.value = formDataFooter.email;
}

emailInput.addEventListener('input', emailEvent);
emailInput.addEventListener('focus', emailEvent);
formFooter.addEventListener('input', inputFormEvent);
formFooter.addEventListener('submit', submitFooterEvent);

emailInput.addEventListener('blur', event => {
  event.preventDefault();
  emailSucces.classList.add('visually-hidden');
  emailInvalid.classList.add('visually-hidden');
  emailInput.classList.remove('input-succes-js');
  emailInput.classList.remove('input-invalid-js');
});

function emailEvent(event) {
  event.preventDefault();
  emailSucces.classList.add('visually-hidden');
  emailInvalid.classList.add('visually-hidden');
  emailInput.classList.remove('input-succes-js');
  emailInput.classList.remove('input-invalid-js');
  if (
    event.target.value
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/
      )
  ) {
    emailSucces.classList.remove('visually-hidden');
    emailInput.classList.add('input-succes-js');
  } else {
    emailInvalid.classList.remove('visually-hidden');
    emailInput.classList.add('input-invalid-js');
  }
}

function inputFormEvent(event) {
  event.preventDefault();
  if (event.target.name === 'client-email') {
    formDataFooter.email = event.target.value.trim();
  } else if (event.target.name === 'client-comments') {
    formDataFooter.comments = event.target.value.trim();
  }

  localStorage.setItem(localStorageKey, JSON.stringify(formDataFooter));
}

async function submitFooterEvent(event) {
  event.preventDefault();
  await axios
    .post('/api/requests', {
      email: formDataFooter.email,
      comment: formDataFooter.comments,
    })
    .then(function (response) {
      localStorage.removeItem(localStorageKey);
      formFooter.reset();
      formDataFooter = { email: '', comments: '' };
      const titleModalFooter = document.querySelector('.modal-footer-title');
      const messageModalFooter = document.querySelector('.modal-footer-text');
      titleModalFooter.remove();
      messageModalFooter.remove();
      const markup = `
        <p class="modal-footer-title">${response.data.title}</p>
            <p class="modal-footer-text">${response.data.message}</p>
        `;
      modalFooter.insertAdjacentHTML('beforeend', markup);
      modalBackdropFooter.classList.remove('modal-backdrop-footer-closed');
      modalBackdropFooter.addEventListener('click', closeModal);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          modalBackdropFooter.classList.add('modal-backdrop-footer-closed');
        }
      });
    })
    .catch(function (error) {
      console.log(error);
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong',
        position: 'center',
      });
    });
}

function closeModal(event) {
  event.preventDefault();
  modalBackdropFooter.classList.add('modal-backdrop-footer-closed');
}
