const API_KEY = "8uH3Q8aTwATVRvdEDCmzYWZwt8lero7rznmTnJG4OJNKZthUMJZVmaNT4IeQ31Wc";
const API_URL = "https://api.klipy.com/api/v1";

export async function searchGifs(query, perPage = 10) {
    const url = `${API_URL}/${API_KEY}/gifs/search?per_page=${perPage}&q=${query}&content_filter=low&format_filter=gif`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('API Error:', response.status);
            return [];
        }
        
        const result = await response.json();
        return result.data?.data || [];
    } catch (error) {
        console.error('Error fetching GIFs:', error);
        return [];
    }
}

// Function to display GIF search results
export function displayGifResults(gifs, containerId) {
    const container = document.querySelector(containerId);
    
    if (gifs.length === 0) {
        container.innerHTML = '<p>No GIFs found</p>';
        return;
    }
    
    container.innerHTML = '';
    gifs.forEach(gif => {
        const imageUrl = gif.file.md.gif.url;
        const gifElement = document.createElement('div');
        gifElement.classList.add('gif-result');
        gifElement.innerHTML = `<img src="${imageUrl}" alt="${gif.title}">`;
        gifElement.addEventListener('click', () => selectGif(gif, imageUrl));
        container.appendChild(gifElement);
    });
}

let selectedGifUrl = null;

export function selectGif(text, imageUrl) {
    selectedGifUrl = imageUrl;
    
    const gifResults = document.querySelector('#gifResults');
    if (gifResults) {
        gifResults.style.display = 'none';
    }
    const preview = document.querySelector('#selectedGifPreview');
    if (preview) {
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Selected GIF';
        preview.appendChild(img);
    }
}

export function getSelectedGif() {
    return selectedGifUrl;
}

// Clear preview
export function clearSelectedGif() {
    selectedGifUrl = null;
    
    const gifResults = document.querySelector('#gifResults');
    if (gifResults) {
        gifResults.style.display = 'grid';
    }
    
    const preview = document.querySelector('#selectedGifPreview');
    if (preview) {
        preview.innerHTML = '';
    }
}