async function postdata(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

const heroImages = [
  "/forest.jpg",
  "/land-img2.png",
  "/Taj-Mahal.jpg",
  "/beach.jpg",  
    "/road.jpg",
    "/street.jpg",
    "/mountain.jpg",
    "/hero-img3.jpg"
];

const heroImage = document.getElementById("hero-image");

// Preload images
heroImages.forEach((src) => {
    const img = new Image();
    img.src = src;
});

let currentImage = 0;

setInterval(() => {
    heroImage.style.opacity = "0";

    setTimeout(() => {
        currentImage++;

        if (currentImage >= heroImages.length) {
            currentImage = 0;
        }

        heroImage.src = heroImages[currentImage];
        heroImage.style.opacity = "1";
    }, 1500);

}, 6000);


let travelcard = document.getElementById("tlist");
let travelsdata = [];

// Detect and Update button clicked
travelcard.addEventListener("click", async (event) => {
  let card = event.target.closest(".card");

  if (!card) return;

  let id = card.id;

  if (event.target.classList.contains("deletebtn")) {
    let answer = confirm("Are you sure you want to delete this travel?");

    if (answer) {
      const del = await postdata(`/api/deletetravel/${id}`, {});
      if (del.success) {
        alert("Deleted Successfully");
        fetchdata();
      }
    }
  } else if (event.target.classList.contains("updatebtn")) {
    let currentTravel = travelsdata.find((element) => element._id === id);

    const currcity = currentTravel.city;
    const currdesc = currentTravel.desc;
    const currimage = currentTravel.image;

    let updatedata = document.querySelector("#editTravel .modal-content");

    updatedata.innerHTML = `<div class="modal-header">
    <h5 class="modal-title">Edit Travel</h5>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="modal"
    ></button>
  </div>

  <div class="modal-body">
    <form class="p-2">

      <div class="form-group mb-3">
        <label for="upcity" class="form-label fw-semibold">City</label>
        <input
          class="form-control rounded-3"
          id="upcity"
          type="text"
          name="city"
          placeholder="Enter destination name..."
          value="${currcity}"
        />
      </div>

      <div class="form-group mb-3">
        <label for="updesc" class="form-label fw-semibold">
          Description
        </label>
        <textarea
          id="updesc"
          class="form-control rounded-3"
          rows="5"
          name="desc"
          placeholder="Enter your experience..."
        >${currdesc}</textarea>
      </div>
      <div class="form-group mb-3">
        <label for="upimg" class="form-label fw-semibold">
          Image Url
        </label>
        <input
          id="upimg"
          class="form-control rounded-3"
          name="upimg"
          placeholder="Paste a URL..."
          value="${currimage || ""}"
        />
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>

        <button
          id="upbtn"
          class="btn btn-success"
          type="submit"
        >
          Save Changes
        </button>
      </div>

    </form>
  </div>
`;
    const editModalElement = document.getElementById("editTravel");
    const editModal = new bootstrap.Modal(editModalElement);
    editModal.show();

    //Update Travel

    let btn = document.getElementById("upbtn");

    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      let city = document.getElementById("upcity").value;
      let desc = document.getElementById("updesc").value;
      let image = document.getElementById("upimg").value;

      if (city && desc) {
        let a = await postdata(`/api/updatetravel/${id}`, {
          city,
          desc,
          image,
        });

        if (a.success) {
          alert("Updated Successfully!!");
          const editModalElement = document.getElementById("editTravel");
          const editModal = bootstrap.Modal.getInstance(editModalElement);

          editModal.hide();
          fetchdata();
        }
      } else {
        alert("City and Description Must not be Empty....");
      }
    });
  }
});

//gettravel

function displayTravels(travels) {
  travelcard.innerHTML = `<div class="row g-4"></div>`;

  travels.forEach((element) => {
    let card = `
          <div class="col-12 col-md-6 col-lg-4">
            <div id="${element._id}" class="card travel-card h-100">

              <div class="travel-card-image">
                <img
                  src="${element.image || "/no-img.png"}"
                  alt="${element.city}"
                >

                <span class="travel-category">City Explore</span>

                <h5 class="travel-city">
          <i class="bi bi-geo-alt-fill"></i>
          ${element.city}
               </h5>
              </div>

              <div class="card-body">

                <p class="travel-description">
                  ${element.desc}
                </p>

                <div class="travel-card-footer">
                  <div>
                    <a class="btn btn-sm btn-outline-success updatebtn">Edit</a>
                    <a class="btn btn-sm btn-outline-danger deletebtn">Delete</a>
                  </div>

                </div>

              </div>
            </div>
          </div>
        `;

    travelcard.querySelector(".row").innerHTML += card;
  });
}

const fetchdata = () => {
  travelcard.innerHTML = "";

  const gettravel = postdata("/api/gettravel").then((gettravel) => {
    if (gettravel.success) {
      travelsdata = gettravel.travels;

      let name = gettravel.name.toLowerCase();
      name = name.charAt(0).toUpperCase() + name.slice(1);

      document.querySelector(".profile-name").textContent = name;
      document.querySelector(".profile-avatar").textContent = name[0];

      const count = gettravel.travels.length;

      if (count) {
        document.getElementById("memoryCount").innerHTML =
          `<i class="bi bi-compass"></i>
                ${count} ${count === 1 ? "Memory" : "Memories"} Saved`;
        displayTravels(gettravel.travels);
      } else {
        document.getElementById("memoryCount").innerHTML =
          `<i class="bi bi-compass"></i>
    No Memories Saved`;
        travelcard.innerHTML = `
                      <div class="empty-state">
                        <div class="empty-state-icon">
                          <i class="bi bi-camera"></i>
                        </div>

                        <h3>No travel memories yet</h3>

                        <p>Start adding your journeys and memories here.</p>

                        <a href="#add-travel" class="btn">
                          + Add Your First Memory
                        </a>
                      </div>
                    `;
      }
    } else {
      alert("Please Login first");
    }
  });
};

fetchdata();

// Add new travel
let submit = document.getElementById("btn");

submit.addEventListener("click", async (event) => {
  event.preventDefault();

  let city = document.getElementById("city").value;
  let desc = document.getElementById("desc").value;
  let image = document.getElementById("image").value;

  if (city && desc) {
    let a = await postdata("/api/addtravel", {
      city,
      desc,
      image,
    });

    if (a.success) {
      alert("New Memory added");

      document.getElementById("city").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("image").value = "";

      fetchdata();
    }
  } else {
    alert("City and Description must not be Empty");
  }
});

//logout
const logout = document.getElementById("logout");

logout.addEventListener("click", async (event) => {
  event.preventDefault();
  let a = await postdata("/logout");

  if (a.success) {
    alert("Logout Successful");
    window.location.href = "/login";
  }
});

let searchform = document.getElementById("ssosar");

searchform.addEventListener("submit", async (event) => {
  event.preventDefault();
  let search = document.getElementById("search").value;

  let res = await postdata("/api/gettravel", { search });
  travelcard.innerHTML = "";

  if (res.success) {
    travelsdata = res.travels;
    const count = res.travels.length;

    if (count) {
      document.getElementById("memoryCount").innerHTML =
        `<i class="bi bi-compass"></i>
        
        ${count} ${count === 1 ? "Memory" : "Memories"} Saved`;
      displayTravels(res.travels);
    } else {
      document.getElementById("memoryCount").innerHTML =
        `<i class="bi bi-compass"></i>
    Search Result Not Found`;
    }
    document.getElementById("memories").scrollIntoView({
      behavior: "smooth",
    });
    document.getElementById("showAllBtn").classList.remove("d-none");
  } else {
    alert("Please Login First...");
  }

  let showAllBtn = document.getElementById("showAllBtn");

  showAllBtn.addEventListener("click", () => {
    document.getElementById("search").value = "";
    fetchdata();
     document.getElementById("showAllBtn").classList.add("d-none");

    document.getElementById("memories").scrollIntoView({
      behavior: "smooth",
    });
  });
});
