import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36843872-65902b25927b03564c5702eca';

export const fetchGalleryImages = async (name, imagePerPage, currentPage) => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: imagePerPage,
    page: currentPage,
  });

  return await axios.get(`${URL}?${params}`);
};


