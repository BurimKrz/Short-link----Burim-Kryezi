function addLink(link, autoDeletionTimeout) {
  const listItem = createListItem(link);
  linkList.appendChild(listItem);

  if (autoDeletionTimeout) {
    listItem.dataset.timeoutId = setTimeout(() => {
      if (listItem.parentElement) {
        listItem.remove();
        saveLinksToStorage();
      }
    }, autoDeletionTimeout * 1000);
    listItem.dataset.autoDeletionTimeout = autoDeletionTimeout;
  }
}

function createListItem(link) {
  const baseLink = link.slice(0, link.indexOf(".com/") + 5);
  const shortenedLinkSuffix = Array(5)
    .fill('')
    .map(() => link.charAt(Math.floor(Math.random() * link.length)))
    .join('');
  const shortenedLink = baseLink + shortenedLinkSuffix;

  const listItem = document.createElement('li');
  listItem.className = 'link-item';

  const linkElement = document.createElement('a');
  linkElement.href = link;
  linkElement.textContent = shortenedLink;
  linkElement.target = '_blank';

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.className = 'btn btn-danger delete-button';
  deleteButton.onclick = () => {
    listItem.remove();
    saveLinksToStorage();
  };

  listItem.appendChild(linkElement);
  listItem.appendChild(deleteButton);

  return listItem;
}

function saveLinksToStorage() {
  try {
    const linkItems = linkList.querySelectorAll('.link-item');
    const savedLinks = Array.from(linkItems).map(item => {
      return {
        link: item.querySelector('a').href,
        autoDeletionTimeout: parseInt(item.dataset.autoDeletionTimeout, 10),
      };
    });
    localStorage.setItem('savedLinks', JSON.stringify(savedLinks));
  } catch (e) {
    console.error('Error saving links:', e);
  }
}


function loadSavedLinks() {
  try {
    const savedLinksJson = localStorage.getItem('savedLinks');
    if (savedLinksJson) {
      const savedLinks = JSON.parse(savedLinksJson);
      savedLinks.forEach(linkData => {
        addLink(linkData.link, linkData.autoDeletionTimeout);
      });
    }
  } catch (e) {
    console.error('Error loading links:', e);
  }
}

function handleDeleteClick(event) {
  if (event.target.classList.contains('delete-button')) {
    const listItem = event.target.parentElement;
    listItem.remove();
    saveLinksToStorage();
  }
}

function isValidLink(link) {
  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+\/?(.*)?$/;
  return urlRegex.test(link);
}

document.addEventListener('DOMContentLoaded', function () {
  const linkList = document.getElementById('linkList');
  const linkInput = document.getElementById('linkInput');
  const saveButton = document.getElementById('saveButton');
  const timeSelect = document.getElementById('timeSelect');
  const clearButton = document.getElementById('clearButton');

  loadSavedLinks();

  linkList.addEventListener('click', handleDeleteClick);

  saveButton.addEventListener('click', function () {
    const link = linkInput.value.trim();
    const autoDeletionTimeout = parseInt(timeSelect.value, 10);

    if (link !== '' && isValidLink(link)) {
      addLink(link, autoDeletionTimeout);
      linkInput.value = '';
      saveLinksToStorage();
    } else {
      alert('Please enter a valid link.');
    }
  });

  clearButton.addEventListener('click', function () {
    linkInput.value = '';
  });
});
