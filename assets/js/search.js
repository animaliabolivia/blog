// assets/js/search.js
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
  
    if (!searchInput || !resultsContainer) return;
  
    let lunrIndex;
    let docs = [];
  
    // Cargar el índice de búsqueda
    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        docs = data.docs;
        lunrIndex = lunr(function() {
          this.ref('url');
          this.field('title', { boost: 10 });
          this.field('content');
  
          docs.forEach(doc => this.add(doc));
        });
      });
  
    // Manejar la búsqueda en tiempo real
    searchInput.addEventListener('keyup', function() {
      const query = this.value.trim();
      resultsContainer.innerHTML = '';
  
      if (query.length < 2) return;
  
      const results = lunrIndex.search(query);
      displayResults(results);
    });
  
    function displayResults(results) {
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
      }
  
      results.forEach(result => {
        const doc = docs.find(d => d.url === result.ref);
        resultsContainer.innerHTML += `
          <div class="search-result">
            <a href="${doc.url}">${doc.title}</a>
            <p>${doc.content.substring(0, 150)}...</p>
          </div>
        `;
      });
    }
  });