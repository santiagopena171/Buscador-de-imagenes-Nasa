document.addEventListener('DOMContentLoaded', function() {

    const searchInputElement = document.getElementById('inputBuscar');
    
            const searchButtonElement = document.getElementById('btnBuscar');
            
            const resultsContainer = document.getElementById('contenedor');

    if (!searchInputElement || !searchButtonElement || !resultsContainer) {
        console.error('Uno o más elementos del DOM (inputBuscar, btnBuscar o contenedor) no fueron encontrados. Revisa los IDs en tu HTML.');
        return; 
    }


    async function searchImages() {
        const searchInput = searchInputElement.value.trim();

        resultsContainer.innerHTML = ''; 

        if (!searchInput) {
            resultsContainer.innerHTML = '<p class="text-danger">Por favor, ingresa un término de búsqueda.</p>';
            return;
        }

        resultsContainer.innerHTML = '<p>Cargando imágenes...</p>';

                                    const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchInput)}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                const data = await response.json();

                if (!data.collection.items || data.collection.items.length === 0) {
                    resultsContainer.innerHTML = '<p>No se encontraron resultados para tu búsqueda.</p>';
                    return;
                }

            resultsContainer.innerHTML = ''; 

            const rowContainer = document.createElement('div');
            rowContainer.className = 'row row-cols-1 row-cols-md-3 g-4'; // Clases de Bootstrap para cuadrícula

            data.collection.items.forEach(item => {
                if (item.data && item.data[0].media_type === 'image' && item.links) {
                    const imageData = item.data[0];
                    const imageLink = item.links.find(link => link.rel === 'preview')?.href || '';
                    
                                if (imageLink) {
                                    const colDiv = document.createElement('div');
                                    colDiv.className = 'col';

                                    const resultItem = document.createElement('div');
                                    resultItem.className = 'card shadow-sm h-100'; // Clases de Bootstrap para tarjeta
                                    resultItem.innerHTML = `
                                        <img src="${imageLink}" class="card-img-top" alt="${imageData.title}" style="height: 200px; object-fit: cover;">
                                        <div class="card-body">
                                            <h5 class="card-title">${imageData.title}</h5>
                                            <p class="card-text">${imageData.description.substring(0, 100)}...</p>
                                            <p class="card-text"><small class="text-muted">Fecha: ${new Date(imageData.date_created).toLocaleDateString()}</small></p>
                                        </div>
                                    `;
                        colDiv.appendChild(resultItem);
                        rowContainer.appendChild(colDiv);
                    }
                }
            });
            resultsContainer.appendChild(rowContainer);


                                                        } catch (error) {
                                                            console.error('Error fetching data:', error);
                                                            resultsContainer.innerHTML = '<p class="text-danger">Ocurrió un error al obtener las imágenes. Intenta nuevamente.</p>';
                                                        }
                                                    }


    searchButtonElement.addEventListener('click', searchImages);

    searchInputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchImages();
        }
    });
});