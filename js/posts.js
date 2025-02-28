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

function deletePost(postId) {
  const postIndex = userObj.findIndex((post) => post.postid === postId);
  if (postIndex !== -1) {
    userObj.splice(postIndex, 1);
    postList();
  }
}

function addDeleteListeners() {
  document.querySelectorAll(".delete-post").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function () {
      const postId = parseInt(this.getAttribute("data-postid"), 10);
      deletePost(postId);
    });
  });
}

function editPost(postId) {
  console.log("Editing post with ID:", postId);

  const postIndex = userObj.findIndex((post) => post.postid === postId);
  if (postIndex === -1) {
    console.error("Post not found");
    return;
  }

  const originalCaption = userObj[postIndex].caption;

  const newCaption = prompt("Edit your caption:", originalCaption);

  if (newCaption !== null && newCaption.trim() !== "") {
    userObj[postIndex].caption = newCaption;
    postList(); // Refresh post list with updated caption
  }
}

function addEditListeners() {
  document.querySelectorAll(".edit-post").forEach((editBtn) => {
    editBtn.addEventListener("click", function () {
      const postId = parseInt(this.getAttribute("data-postid"), 10);
      editPost(postId);
    });
  });
}

function postList() {
  const postContainer = document.getElementById("allPosts");
  if (!postContainer) {
    console.error("No posts to display");
    return;
  }
  postContainer.innerHTML = "";

  if (userObj.length === 0) {
    const noPostMessage = document.createElement("p");
    noPostMessage.classList.add("text-gray-500", "text-center", "mt-4");
    noPostMessage.textContent = "No posts to show. Add a new post!";
    postContainer.appendChild(noPostMessage);
    return;
  }

  userObj.forEach((post) => {
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

    const topSection = document.createElement("div");
    topSection.classList.add("flex", "items-center", "justify-between", "mb-2");

    const userInfo = document.createElement("div");
    userInfo.classList.add("flex", "items-center");

    const profileImg = document.createElement("img");
    profileImg.classList.add("w-[55px]", "h-[55px]", "rounded-full", "mr-3");
    profileImg.src = userData.image;
    profileImg.alt = "User Avatar";

    const nameContainer = document.createElement("div");
    const name = document.createElement("h2");
    name.classList.add("text-gray-900", "font-semibold", "text-m");
    name.textContent = userData.name;
    const username = document.createElement("p");
    username.classList.add("text-gray-500", "text-xs");
    username.textContent = "@" + userData.username;

    nameContainer.appendChild(name);
    nameContainer.appendChild(username);

    userInfo.appendChild(profileImg);
    userInfo.appendChild(nameContainer);

    const ellipsisContainer = document.createElement("div");
    ellipsisContainer.classList.add("relative", "inline-block");

    const ellipsisBtn = document.createElement("button");
    ellipsisBtn.classList.add("text-gray-500", "hover:text-gray-700");
    ellipsisBtn.innerHTML = `<i class="fas fa-ellipsis-h fa-xl"></i>`;

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add(
      "hidden",
      "absolute",
      "top-full",
      "right-0",
      "mt-2",
      "w-40",
      "bg-white",
      "border",
      "border-gray-300",
      "rounded-lg",
      "shadow-lg",
      "z-10"
    );
    dropdownMenu.innerHTML = `
        <li class="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer edit-post" data-postid="${post.postid}">
            <i class="fas fa-edit"></i> Edit Post
        </li>
        <li class="px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-gray-100 cursor-pointer delete-post" data-postid="${post.postid}">
            <i class="fas fa-trash-alt"></i> Delete Post
        </li>
      `;

    ellipsisContainer.appendChild(ellipsisBtn);
    ellipsisContainer.appendChild(dropdownMenu);

    ellipsisBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      document.querySelectorAll("ul.absolute").forEach((menu) => {
        if (menu !== dropdownMenu) {
          menu.classList.add("hidden");
        }
      });
      dropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (!ellipsisContainer.contains(event.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });

    topSection.appendChild(userInfo);
    topSection.appendChild(ellipsisContainer);

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("ml-12");

    const postText = document.createElement("p");
    postText.classList.add("text-gray-800", "text-m", "mb-4", "post-caption"); // Add post-caption class
    postText.textContent = post.caption;

    const img = document.createElement("img");
    img.classList.add("w-full", "rounded-lg", "border", "border-gray-300");
    img.src = post.img;
    img.alt = "Post Image";

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

    const comments = document.createElement("button");
    comments.classList.add(
      "flex",
      "items-center",
      "gap-1",
      "text-gray-500",
      "hover:text-gray-700"
    );
    comments.setAttribute("data-postid", post.postid);
    comments.innerHTML = `<i class="far fa-comment fa-xl"></i> 23`;

    comments.addEventListener("click", () => showComments(post.postid));

    const likes = document.createElement("span");
    likes.innerHTML = `<i class="far fa-heart fa-xl"></i> 143`;
    reactionsDiv.appendChild(comments);
    reactionsDiv.appendChild(likes);

    contentContainer.appendChild(postText);
    contentContainer.appendChild(img);
    contentContainer.appendChild(reactionsDiv);

    postDiv.appendChild(topSection);
    postDiv.appendChild(contentContainer);

    postContainer.appendChild(postDiv);
  });

  addDeleteListeners();
  addEditListeners();
}

function newPost() {
  const captionInput = document.getElementById("inputCaption");
  if (!captionInput) {
    console.error("Caption input not found");
    return;
  }

  const captionText = captionInput.value.trim();
  if (captionText === "") {
    alert("Caption cannot be empty!");
    return;
  }

  // Generate a new post ID
  const newPostId = userObj.length > 0 ? userObj[0].postid + 1 : 1;

  // Generate a random image using picsum.photos
  const newImage = `https://picsum.photos/id/${Math.floor(
    Math.random() * 100
  )}/1920/1080`;

  const newPost = {
    postid: newPostId,
    title: "New Post", // Placeholder title
    caption: captionText,
    img: newImage,
    avatar: userData.image,
    name: userData.name,
  };

  // Add the new post at the beginning of the list
  userObj.unshift(newPost);

  // Clear the input field after posting
  captionInput.value = "";

  // Refresh the post list
  postList();
}

//comments
const userComments = {};

// Fetch comments and organize them by postId
fetch("./data_json/comments.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((comment) => {
      if (!userComments[comment.postId]) {
        userComments[comment.postId] = [];
      }
      userComments[comment.postId].push({
        id: comment.id,
        name: comment.name,
        email: comment.email,
        comment: comment.body,
      });
    });

    console.log("Organized User Comments by Post ID:", userComments);
  })
  .catch((error) => console.error("Error fetching comments:", error));
function showComments(postId) {
  const filteredComments = userComments[postId] || [];

  if (filteredComments.length === 0) {
    alert("No comments available for this post.");
    return;
  }

  // Select up to 5 random comments
  const selectedComments = filteredComments
    .sort(() => 0.5 - Math.random()) // Shuffle comments
    .slice(0, 5); // Pick the first 5

  // Create modal HTML
  const modalHtml = `
      <div id="commentsModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
          <div class="max-h-60 overflow-y-auto space-y-4">
            ${selectedComments
              .map((comment) => {
                const emailPrefix = comment.email.split("@")[0]; // Extract text before '@'
                return `
              <div class="p-3 border rounded-lg shadow-sm bg-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-lg">
                    ${emailPrefix.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">${emailPrefix}</p>
                    <p class="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <p class="text-gray-700 mt-2">${comment.comment}</p>
              </div>
            `;
              })
              .join("")}
          </div>
          <button onclick="closeModal()" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    `;

  // Append modal to body
  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeModal() {
  document.getElementById("commentsModal").remove();
}
