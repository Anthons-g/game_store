document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("filter-form");
    const gamesList = document.getElementById("games-list");
    const modal = document.getElementById("game-details-modal");
    const closeModal = modal.querySelector(".close");

    // Función para adjuntar eventos de clic a los enlaces de detalles de los juegos
    function attachGameDetailLinks() {
        const gameLinks = document.querySelectorAll(".game-detail-link");

        gameLinks.forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const gameId = this.getAttribute("data-game-id");

                fetch(`/game/${gameId}/`, {
                    method: "GET",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    document.getElementById("game-name").textContent = data.name;
                    document.getElementById("game-description").textContent = data.description;
                    document.getElementById("game-release-date").textContent = data.release_date;
                    document.getElementById("game-reviews").textContent = data.reviews;
                    document.getElementById("game-image").src = data.image_url;

                    modal.style.display = "flex";
                })
                .catch(error => console.error("Error fetching game details:", error));
            });
        });
    }

    // Adjuntar eventos de clic al cargar la página
    attachGameDetailLinks();

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 
        
        const search = document.getElementById("search").value.trim();
        const platform = document.getElementById("platform").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const minPrice = document.getElementById("min_price").value.trim();
        const maxPrice = document.getElementById("max_price").value.trim();
        const orderByPrice = document.getElementById("order_by_price").value;

        if (minPrice && (isNaN(minPrice) || parseFloat(minPrice) < 0)) {
            alert("The minimum price must be a positive number.");
            return;
        }
        if (maxPrice && (isNaN(maxPrice) || parseFloat(maxPrice) < 0)) {
            alert("The maximum price must be a positive number.");
            return;
        }

        if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
            alert("The minimum price must be less than the maximum price.");
            return;
        }

        const url = new URL(form.action);
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (platform) params.append("platform", platform);
        if (genre) params.append("genre", genre);
        if (minPrice) params.append("min_price", minPrice);
        if (maxPrice) params.append("max_price", maxPrice);
        if (orderByPrice) params.append("order_by_price", orderByPrice);
        url.search = params.toString();

        fetch(url, {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        .then(response => response.json())  
        .then(data => {
            gamesList.innerHTML = "";

            if (data.games.length > 0) {    
                data.games.forEach(game => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <a href="#" class="game-detail-link" data-game-id="${game.id}">
                            <img src="${game.image_url}" alt="${game.name}">
                            <h2>${game.name}</h2>
                            <p>${game.genre}</p>
                            <p>${game.platform}</p>
                            <p>${game.price} $</p>
                        </a>`;
                    gamesList.appendChild(li);
                });
                // Llamar a la función para adjuntar eventos después de actualizar la lista
                attachGameDetailLinks();
            } else {
                gamesList.innerHTML = "<p>No games found.</p>";
            }
        })
        .catch(error => console.error("Error fetching games:", error));
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Cerrar el modal si se hace clic fuera del contenido del modal
    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
