let userLogin = [];

fetch("./data_json/users.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((user) => {
      let gender = Math.random() < 0.5 ? "male" : "female";
      let avatarUrl = `https://i.pravatar.cc/150?u=${user.id}`;

      userLogin.push({
        id: user.id,
        name: user.name,
        gender: gender,
        avatar: avatarUrl,
        username:user.username,
      });
    });

    logAva();
    
    
})
.catch((error) => console.error("Error fetching users:", error));




function logAva() {
  const usersContainer = document.getElementById("users");
  if (!usersContainer) {
    console.error("Element with id 'users' not found!");
    return;
  }

  usersContainer.innerHTML = "";
  usersContainer.classList.add("grid", "grid-cols-5", "gap-20");

  userLogin.forEach((user, index) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "gap-3",
      "p-2",
      "rounded-lg",
      "transition-all",
      "duration-300",
      "hover:scale-110",
      "hover:cursor-pointer",
      "opacity-0", // Start hidden
      "translate-y-10" // Start lower
    );

    // Add a base delay to ensure even the first item animates smoothly
    const baseDelay = 200; // Adjust this to control when the first item starts animating
    setTimeout(() => {
      userDiv.classList.add("opacity-100", "translate-y-0"); // Animate in
      userDiv.classList.remove("opacity-0", "translate-y-10");
    }, baseDelay + index * 100); // Apply delay

    const img = document.createElement("img");
    img.src = user.avatar;
    img.alt = user.name;
    img.classList.add(
      "w-30",
      "h-30",
      "rounded-full",
      "transition-all",
      "duration-300",
      "hover:shadow-lg",
      "hover:shadow-black/50"
    );

    img.addEventListener("click", open);

    const name = document.createElement("h1");
    name.textContent = user.name;
    name.classList.add(
      "text-white",
      "text-lg",
      "font-semibold",
      "drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]"
    );

    userDiv.appendChild(img);
    userDiv.appendChild(name);
    usersContainer.appendChild(userDiv);

    name.addEventListener("click", open);
  });
}

function open(event) {
    const heading = document.getElementById("heading");
    const img = event.target;
    const userDiv = img.parentElement; // Get the parent div
    const userName = userDiv.querySelector("h1"); // Select the name element
    const usersContainer = document.getElementById("users");

    // Find user details in the userLogin array
    const selectedUser = userLogin.find(user => user.avatar === img.src);

    if (!selectedUser) {
        console.error("User data not found!");
        return;
    }

    // Clear previous local storage data
    localStorage.removeItem("selectedUser");

    // Save new user details to localStorage
    localStorage.setItem("selectedUser", JSON.stringify({
        id: selectedUser.id,
        name: selectedUser.name,
        image: selectedUser.avatar,
        username:selectedUser.username,
    }));

    // Clear heading text
    heading.textContent = " ";

    // Hide everything except the selected user's avatar
    Array.from(usersContainer.children).forEach((child) => {
        if (child !== userDiv) {
            child.style.transition = "opacity 0.3s";
            child.style.opacity = "0";
        }
    });

    // Hide only the selected user's name
    userName.style.transition = "opacity 0.3s";
    userName.style.opacity = "0";

    // Apply zoom and fade animation to the clicked avatar
    img.classList.add("animate-zoom-fade");

    // Redirect after animation
    setTimeout(() => {
        window.location.href = "./userPosts.html";
    }, 500); // Delay to match animation duration
}
