 let addToy = false;

 document.addEventListener("DOMContentLoaded", () => {
   const addBtn = document.querySelector("#new-toy-btn");
   const toyFormContainer = document.querySelector(".container");
   addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
   });

    const toyCollection = document.getElementById("toy-collection");

   //Function to fetch the toy objects and render them to the DOM
     function fetchToys() {
     fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => renderToy(toy));
      })
      .catch((error) => {
        console.error("Error fetching toys:", error);
      });
   }

   //Function to render a single toy card to the DOM
    function renderToy(toy) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" alt="${toy.name}" class="toy-avatar">
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
     toyCollection.appendChild(cardDiv);

     //Add an event listener to the like button
    const likeBtn = cardDiv.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      increaseLikes(toy);
    });
   }

    // Function to handle increasing likes for a toy
    function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        const toyCard = toyCollection.querySelector(`[data-id="${updatedToy.id}"]`);
        const likeP = toyCard.querySelector("p");
        likeP.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => {
        console.error("Error updating likes:", error);
      });
   }

    //Event listener for submitting new toy form
    const toyForm = document.querySelector(".add-toy-form");
    toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;
    const likes = 0;

    const newToy = { name, image, likes };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        renderToy(createdToy);
        event.target.reset();
      })
      .catch((error) => {
        console.error("Error adding new toy:", error);
      });
  });

    // Fetch toys when page is loaded
     fetchToys();

 });