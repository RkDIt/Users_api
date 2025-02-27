// Fetch user data from localStorage and handle cases where it's null
const userData = JSON.parse(localStorage.getItem("selectedUser")) || {};

if (userData.image) {
  document.getElementById("userAvatar").src = userData.image;
  document.getElementById("userAvatarSmall").src = userData.image;
}

if (userData.name) {
  document.getElementById("userName").textContent = userData.name;
}

if (userData.username) {
  document.getElementById("userUsername").textContent = "@" + userData.username;
}

// Logout function
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("selectedUser");
    window.location.href = "./index.html"; // Redirect to login/home
  });
}

let count = 1;
let userObj = [];

fetch("./data_json/posts.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Original Data:", data);

    data.forEach((post) => {
      post.image = `https://picsum.photos/id/${count}/1920/1080`;
      count++;

      if (userData.id === post.userId) {
        userObj.push({
          postid: post.id,
          title: post.title,
          caption: post.body,
          img: post.image,
          avatar: userData.image,
          name: userData.name,
        });
      }
    });

    console.log("Updated Data with Images:", data);
    console.log("User's Posts (Matching IDs):", userObj);

    postList();
  })
  .catch((error) => console.error("Error fetching posts:", error));



  function postList() {
    const postContainer = document.getElementById("allPosts");
  
    if (!postContainer) {
      console.error("No posts to display");
      return;
    }
  
    // Clear previous posts before appending new ones
    postContainer.innerHTML = "";
  
    userObj.forEach((post) => {
      // Create the post div
      const postDiv = document.createElement("div");
      postDiv.classList.add(
        "bg-white",
        "shadow-md",
        "rounded-lg",
        "p-4",
        "mb-4",
        "border",
        "border-gray-200",
        "mt-5"
      );
  
      // **Top Section: User Info + Ellipsis Button**
      const topSection = document.createElement("div");
      topSection.classList.add("flex", "items-center", "justify-between", "mb-2");
  
      // User Info (Profile + Name)
      const userInfo = document.createElement("div");
      userInfo.classList.add("flex", "items-center");
  
      // Profile Image
      const profileImg = document.createElement("img");
      profileImg.classList.add("w-[55px]", "h-[55px]", "rounded-full", "mr-3");
      profileImg.src = userData.image;
      profileImg.alt = "User Avatar";
  
      // Name & Username
      const nameContainer = document.createElement("div");
  
      const name = document.createElement("h2");
      name.classList.add("text-gray-900", "font-semibold", "text-m", "flex", "items-center");
      name.textContent = userData.name;
  
      const username = document.createElement("p");
      username.classList.add("text-gray-500", "text-xs");
      username.textContent = "@" + userData.username;
  
      nameContainer.appendChild(name);
      nameContainer.appendChild(username);
  
      userInfo.appendChild(profileImg);
      userInfo.appendChild(nameContainer);
  
      // **Dropdown Button & Menu (Ellipsis)**
      const ellipsisContainer = document.createElement("div");
      ellipsisContainer.classList.add("relative", "inline-block");
  
      // Ellipsis Button
      const ellipsisBtn = document.createElement("button");
      ellipsisBtn.classList.add("text-gray-500", "hover:text-gray-700");
      ellipsisBtn.innerHTML = `<i class="fas fa-ellipsis-h fa-xl"></i>`;
  
      // Dropdown Menu
      const dropdownMenu = document.createElement("ul");
      dropdownMenu.classList.add(
        "hidden",
        "absolute",
        "top-full",
        "right-0",  
        "mt-2",
        "w-40",
        "h-20",
        "bg-white",
        "border",
        "border-gray-300",
        "rounded-lg",
        "shadow-lg",
        "z-10"  
      );
      dropdownMenu.innerHTML = `
        <li class="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
            <i class="fas fa-edit"></i> Edit Post
        </li>
        <li class="px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-gray-100 cursor-pointer">
            <i class="fas fa-trash-alt"></i> Delete Post
        </li>
      `;
  
      // Append button and dropdown inside the ellipsis container
      ellipsisContainer.appendChild(ellipsisBtn);
      ellipsisContainer.appendChild(dropdownMenu);
  
      // Toggle dropdown on click
      ellipsisBtn.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevents event from bubbling up
        
        // Close all other dropdowns before opening this one
        document.querySelectorAll("ul.absolute").forEach(menu => {
          if (menu !== dropdownMenu) {
            menu.classList.add("hidden");
          }
        });
  
        dropdownMenu.classList.toggle("hidden"); // Toggle current dropdown
      });
  
      // Close dropdown when clicking outside
      document.addEventListener("click", (event) => {
        if (!ellipsisContainer.contains(event.target)) {
          dropdownMenu.classList.add("hidden");
        }
      });
  
      // Append User Info & Dropdown Button to Top Section
      topSection.appendChild(userInfo);
      topSection.appendChild(ellipsisContainer); // Ensure ellipsis stays aligned
  



      // **Main Content Container (Post)**
      const contentContainer = document.createElement("div");
      contentContainer.classList.add("ml-12"); // Same margin as the profile image width
  
      //(Caption)
      const postText = document.createElement("p");
      postText.classList.add("text-gray-800", "text-m", "mb-4");
      postText.textContent = post.caption;
  
      //Image
      const img = document.createElement("img");
      img.classList.add("w-full", "rounded-lg", "border", "border-gray-300");
      img.src = post.img;
      img.alt = "Post Image";
  
      // Reactions Bar (Icons)
      const reactionsDiv = document.createElement("div");
      reactionsDiv.classList.add(
        "mb-4",
        "flex",
        "justify-left",
        "text-gray-500",
        "text-sm",
        "mt-4",
        "gap-4"
      );
  
      const comments = document.createElement("span");
      comments.innerHTML = `<i class="far fa-comment fa-xl"></i> 23`;
  
      const likes = document.createElement("span");
      likes.innerHTML = `<i class="far fa-heart fa-xl"></i> 143`;
  
      reactionsDiv.appendChild(comments);
      reactionsDiv.appendChild(likes);
  
      // Append caption and image inside the aligned container
      contentContainer.appendChild(postText);
      contentContainer.appendChild(img);
      contentContainer.appendChild(reactionsDiv);
  
      // Append everything to postDiv
      postDiv.appendChild(topSection); // Adds User Info + Ellipsis Button
      postDiv.appendChild(contentContainer); // Ensures alignment
  
      // Append postDiv to the main container
      postContainer.appendChild(postDiv);
    });
  }
  

