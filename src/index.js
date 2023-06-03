import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchGalleryImages } from './js/fetchGalleryImages';
import { createGalleryMarkup } from './js/createGalleryMarkup';

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});  
let currentPage = 1;
let totalPages = 0;
const IMAGE_PER_PAGE = 40;
let inputValue;

const formEl = document.querySelector('.search-form');
const galleryField = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const infiniteScrollToggle = document.querySelector('.toggle-check');
// const guard = document.querySelector('.js-guard');


formEl.addEventListener('submit', handlerFormSubmit);
loadMoreBtn.addEventListener('click', handlerPagination);

async function handlerFormSubmit(e) {
  e.preventDefault();
  
  if (galleryField.children.length) {
    loadMoreBtn.hidden = true;
    galleryField.innerHTML = "";
    currentPage = 1;
    totalPages = 0;
  }
  
  if (e.currentTarget.elements.searchQuery.value.trim() == '') {
    return;
  }
  
  inputValue = e.currentTarget.elements.searchQuery.value
        .trim()
        .replace(/\s+/g, ' ');
  
  try {
    const { data } = await fetchGalleryImages(
      inputValue,
      IMAGE_PER_PAGE,
      currentPage
    );

    totalPages = Math.ceil(data.totalHits / IMAGE_PER_PAGE);
    if (totalPages > 1) {
      loadMoreBtn.hidden = false;
    } 

    if (data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { clickToClose: true }
      );
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    galleryField.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(data.hits)
    );
    // if (totalPages > currentPage && infiniteScrollToggle.checked) {
    //   addIntersectionObserver();
    // }
    lightbox.refresh();
    smoothScroll();
   
    formEl.reset();
  } catch (e) {
      console.log(e);
      Notify.failure('Sorry, something has gone wrong... Please try again.', {
        clickToClose: true,
      });
    }
};



function handlerPagination() {
  currentPage += 1;
  fetchGalleryImages(inputValue, IMAGE_PER_PAGE, currentPage)
    .then(({ data }) => {
      galleryField.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(data.hits)
      );
      lightbox.refresh();
      smoothScroll();

      if (currentPage >= totalPages) {
        loadMoreBtn.hidden = true;
        Notify.info("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Sorry, something has gone wrong... Please try again.');
    });
}


function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// function addIntersectionObserver() {
//   let observerOptions = {
//     root: null,
//     rootMargin: '100px',
//     threshold: 1.0,
//   };
//   let observer = new IntersectionObserver(onLoadObserver, observerOptions);

//   function onLoadObserver(entries, observer) {
//     console.log(entries);
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         handlerPagination();
//       }
//       if (totalPages <= currentPage) {
//         observer.unobserve(guard);
//       }
//       });
//   }
//   observer.observe(guard);
// }




