// MENU https://dev.to/rajshreevats/create-landing-page-with-3-d-effect-4136

const hamburger_menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".container");

hamburger_menu.addEventListener("click", () => {
  container.classList.toggle("active");
});

hamburger_menu.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    container.classList.toggle("active");
  }
});

document.getElementById('myBtn').addEventListener('click', function()
 {
  document.getElementById('myModal').style.display = 'block';
  document.getElementById('name').focus();
});

// FILTERABLE GALLERY https://www.bijanrai.com.np/2023/10/filterable-image-gallery.html

function handleFiltering() {
  var filterContainer = document.querySelector(".gallery-filter");
  var galleryItems = document.querySelectorAll(".gallery-item");
  var isFirstClick = true;
  var activeFilterItem = null;

  function removeAllActiveClasses() {
      filterContainer.querySelectorAll(".filter-item").forEach(function (item) {
          item.classList.remove("active");
      });
  }

  function filterGalleryItems(filterValue) {
      galleryItems.forEach(function (item) {
          if (filterValue === 'all' || item.id === filterValue) {
              item.classList.remove("hide");
              item.classList.add("show");
          } else {
              item.classList.remove("show");
              item.classList.add("hide");
          }
      });
  }

  filterContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("filter-item")) {
          var filterValue = event.target.getAttribute("data-filter");

          if (isFirstClick) {
              removeAllActiveClasses();
              event.target.classList.add("active");
              activeFilterItem = event.target;
              filterGalleryItems(filterValue);
              isFirstClick = false;
          } else {
              if (event.target === activeFilterItem) {
                  removeAllActiveClasses();
                  allFilterItem.classList.add("active");
                  filterValue = 'all';
                  filterGalleryItems(filterValue);
                  isFirstClick = true;
              } else {
                  removeAllActiveClasses();
                  event.target.classList.add("active");
                  activeFilterItem = event.target;
                  filterGalleryItems(filterValue);
                  isFirstClick = false;
              }
          }
      }
  });

  var allFilterItem = filterContainer.querySelector("[data-filter='all']");
  allFilterItem.classList.add("active");
}

handleFiltering();

// SORTING FUNCTION

async function sortYears() {
  
  var filterContainer = document.querySelector(".gallery-filter");

  const apiUrl = 'https://webtech.labs.vu.nl/api24/45bc18aa';

  var serverYears = await fetch(apiUrl)
    .then(response => response.json())
    .then(data => Array.from(new Set(data.map(author => parseInt(author.year, 10)))))
    .catch(error => {
      console.error('Error fetching data:', error);
      return [];
    });
  console.log('Server Years:' + serverYears);

  var htmlYears = [];
  document.querySelector('.row-got').querySelectorAll('.gallery-item').forEach(function(item) {
    var idValue = item.getAttribute('id');
    if (idValue) {
      htmlYears.push(parseInt(idValue, 10));
    }
  });
  console.log('HTML Years:' + htmlYears);

  serverYears = serverYears.filter(year => !htmlYears.includes(year));
  console.log('Filtered Server Years:', serverYears);

  var mergedYears = [...htmlYears, ...serverYears];
  console.log('All Years:' + mergedYears);

  var uniqueAndSorted = [...new Set(mergedYears)].sort((a, b) => a - b);
  console.log('Unique Years:' + uniqueAndSorted);

  var allFilterItem = filterContainer.querySelector("[data-filter='all']");
  allFilterItem.classList.add("active");
  filterContainer.insertBefore(allFilterItem, filterContainer.firstChild);

  var filterItemsToRemove = document.querySelectorAll('.filter-item:not(:first-child)');

  filterItemsToRemove.forEach(function(item) {
    filterContainer.removeChild(item);
  });

  uniqueAndSorted.forEach(function (year) {
    console.log(year);
    let gallerySpan = document.createElement('span');
    gallerySpan.className = 'filter-item';
    gallerySpan.setAttribute('data-filter', year);
    gallerySpan.innerHTML = year;
  
    filterContainer.appendChild(gallerySpan);
  });
}

// SEARCH FUNCTION

function searchFunction() {
  var input, filter, gallery, items, i, name;
  input = document.getElementById('searchInput');
  filter = input.value.replace(/\s/g, '').toUpperCase();
  
  gallery = document.querySelector('.container-gallery');
  items = gallery.getElementsByClassName('gallery-item');

  for (i = 0; i < items.length; i++) {
    name = items[i].querySelector('.search').innerText.replace(/\s/g, '').toUpperCase();
    genre = items[i].querySelector('.search').innerText.replace(/\s/g, '').toUpperCase();
    if (name.includes(filter) || genre.includes(filter)) {
      items[i].style.display = "";
    } 
    else {
      items[i].style.display = "none";
    }
  }
}

document.getElementById("searchInput").addEventListener("input", searchFunction);

// MODAL https://www.w3schools.com/howto/howto_css_modals.asp

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function openModal() {
modal.style.display = "block";
}

function closeModal() {
modal.style.display = "none";
}

document.getElementById("myBtn").addEventListener("click", openModal);
span.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
if (event.target == modal) {
  closeModal();
}
});

// POST NEW ITEM TO SERVER

async function addItem(event) {
  event.preventDefault();

  var formData = {
    name: document.getElementById("name").value,
    year: document.getElementById("year").value,
    poster: document.getElementById("poster").value,
    genre: document.getElementById("genre").value,
    description: document.getElementById("description").value
  };

  const url = 'https://webtech.labs.vu.nl/api24/45bc18aa';

  try {
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

    if (response.ok) {
      console.log('Item added successfully');
      document.getElementById("add-item-form").reset();
      closeModal();
      console.log('Model successfully');
      await fetchDataAndPopulateGallery(url);
      console.log('Gallery populted successfully');
    } else {
      console.error('Error adding item');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  let form = document.querySelector("#add-item-form");
  form.addEventListener("submit", addItem);
});

// UPLOAD ITEM FROM SERVER TO PAGE

async function fetchDataAndPopulateGallery(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let galleryContainer = document.querySelector('.row');
    if (!galleryContainer) {
      galleryContainer = document.createElement('div');
      galleryContainer.className = 'row';
      document.querySelector('.container-gallery').appendChild(galleryContainer);
    }

    let galleryDefaultContainer = document.querySelector('.row-default');
    if (!galleryDefaultContainer) {
      galleryDefaultContainer = document.createElement('div');
      galleryDefaultContainer.className = 'row-default';
      document.querySelector('.container-gallery').appendChild(galleryDefaultContainer); 
    }

    galleryContainer.innerHTML = '';
    galleryDefaultContainer.innerHTML = '';

    if (data.length > 0) {
      data.forEach((author, index) => {

        let galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.id = `${author.year}`;

        let galleryItemInner = document.createElement('div');
        galleryItemInner.className = 'gallery-item-inner';

        let search = document.createElement('div');
        search.className = 'search';

        let name = document.createElement('div');
        name.innerHTML = `${author.name}`;

        let year = document.createElement('div');
        year.innerHTML = `${author.year}`;

        let genre = document.createElement('div');
        genre.innerHTML = `${author.genre}`;

        let poster = document.createElement('img');
        poster.src = `${author.poster}`;
        poster.setAttribute('alt', `${author.name}`);

        let description = document.createElement('p');
        description.innerHTML = `${author.description}`;

        search.appendChild(name);
        search.appendChild(year);
        search.appendChild(genre);

        galleryItemInner.appendChild(search);
        galleryItemInner.appendChild(poster);
        galleryItemInner.appendChild(description);

        galleryItem.appendChild(galleryItemInner);

        let updateButton = document.createElement('button');
        updateButton.innerHTML = 'Update';
        updateButton.id = `updateButton_${author.id}`;
        updateButton.className = 'button';
        updateButton.addEventListener('click', function() {
          updateItem(author.id); 
        });

        galleryItemInner.appendChild(updateButton);

        if (index < 9) {
          document.querySelector('.row-default').appendChild(galleryItem);
        } else {
          document.querySelector('.row').appendChild(galleryItem);
        }
      });
    } else {
      console.log('No authors found in the response.');
    }
    handleFiltering();
    sortYears();
    setTimeout(() => {
      document.querySelectorAll('.gallery-item').forEach(element => {
        element.classList.remove("hide"); 
        element.classList.add("show");   
      });
    }, 0);
  } catch (error) {
    console.log(error);
  }
} 

// RESET FUNCTION

async function resetData() {
  const resetUrl = 'https://webtech.labs.vu.nl/api24/45bc18aa/reset';

  try {
    const response = await fetch(resetUrl, {
      method: 'GET',
    });

    if (response.ok) {
      console.log('Data reset successfully');
      var userUploadedDataElements = document.querySelectorAll('.row');
      userUploadedDataElements.forEach(element => {
        element.remove();
      });

      await fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/45bc18aa');
    } else {
      console.error('Error resetting data:', response.status, response.statusText);
    }
    sortYears();
    handleFiltering();
    setTimeout(() => {
      document.querySelectorAll('.gallery-item').forEach(element => {
        element.classList.remove("hide"); 
        element.classList.add("show");   
      });
    }, 0);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

document.getElementById("resetBtn").addEventListener("click", resetData);

// UPDATE FUNCTION

async function updateItem(authorId) {
  const updateUrl = `https://webtech.labs.vu.nl/api24/45bc18aa/item/${authorId}`;
  
  try {
      const response = await fetch(updateUrl);
      const existingItemData = await response.json();

      var updatedName = prompt('Enter updated name:', existingItemData.name);
      var updatedYear;
      while (true) {
          updatedYear = prompt('Enter updated year:', existingItemData.year);
          if (!isNaN(updatedYear) && parseInt(updatedYear) === parseFloat(updatedYear)) {
              break;
          } else {
              alert("Please enter a valid integer for the year");
          }
      }
      var updatedPoster;
      while (true) {
          updatedPoster = prompt('Enter updated poster URL:', existingItemData.poster);
          if (!updatedPoster || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(updatedPoster)) {
              break;
          } else {
              alert('Please enter a valid URL');
          }
      }
      var updatedGenre = prompt('Enter updated genre:', existingItemData.genre);
      var updatedDescription = prompt('Enter updated description:', existingItemData.description);

      const updatedFormData = {
          name: updatedName,
          year: updatedYear,
          poster: updatedPoster,
          genre: updatedGenre,
          description: updatedDescription
      };

      try {
          const updateResponse = await fetch(updateUrl, {
              method: 'PUT',
              body: JSON.stringify(updatedFormData),
              headers: {
                  'Content-Type': 'application/json; charset=UTF-8'
              }
          });

          if (updateResponse.ok) {
              console.log('Item updated successfully');

              await fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/45bc18aa');
          } else {
              console.error('Error updating item:', updateResponse.status, updateResponse.statusText);
          }
      } catch (updateError) {
          console.error('Update fetch error:', updateError);
      }

  } catch (fetchError) {
      console.error('Fetch error:', fetchError);
  }
  handleFiltering();
  sortYears();
}

// UPLOAD DATA ON PAGE

document.addEventListener('DOMContentLoaded', () => {
  fetchDataAndPopulateGallery('https://webtech.labs.vu.nl/api24/45bc18aa');
});