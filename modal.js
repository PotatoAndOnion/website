// Function to open post modal
function openModal() {
    document.getElementById("postModal").style.display = "block";
  };
  
  // Close the modal when clicking on the close button (x)
  document.querySelector(".postClose").addEventListener("click", function() {
    document.getElementById("postModal").style.display = "none";
  });
  
  // Close the modal when clicking outside of it
  window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("postModal")) {
        document.getElementById("postModal").style.display = "none";
    }
  });
  
  // Open modal when clicking on "Post" link in navbar
  document.getElementById("openPostModal").addEventListener("click", function(event) {
    event.preventDefault(); 
    console.log("testing");
    openModal();
});





// Function to open settings modal
function openSettingsModal() {
  document.getElementById("settingsModal").style.display = "block";
};

// Close the modal when clicking on the close button (x)
document.querySelector(".settingsClose").addEventListener("click", function() {
  document.getElementById("settingsModal").style.display = "none";
});

// Close the modal when clicking outside of it
window.addEventListener("click", function(event) {
  if (event.target === document.getElementById("settingsModal")) {
      document.getElementById("settingsModal").style.display = "none";
  }
});

// Open modal when clicking on "Post" link in navbar
document.getElementById("openSettingModal").addEventListener("click", function(event) {
  event.preventDefault(); 
  console.log("testing");
  openSettingsModal();
});



// Function to open post update modal
function openUpdateModal() {
  document.getElementById("updateModal").style.display = "block";
};

// Close the modal when clicking on the close button (x)
document.getElementById("updateClose").addEventListener("click", function() {
  document.getElementById("updateModal").style.display = "none";
});

// Close the modal when clicking outside of it
window.addEventListener("click", function(event) {
  if (event.target === document.getElementById("updateModal")) {
      document.getElementById("updateModal").style.display = "none";
  }
});