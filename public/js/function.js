//dropdown buttonn ko
const settingsIcon = document.getElementById('settings-icon');
        const dropdownContent = document.querySelector('.dropdown-content');
        let isDropdownFixedOpen = false;

        // Show dropdown on hover
        settingsIcon.addEventListener('mouseenter', function () {
            if (!isDropdownFixedOpen) {
                dropdownContent.style.display = 'block';
            }
        });

        // Hide dropdown on mouse leave (if not fixed open)
        settingsIcon.addEventListener('mouseleave', function () {
            if (!isDropdownFixedOpen) {
                dropdownContent.style.display = 'none';
            }
        });

        // Keep dropdown open on click
        settingsIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            isDropdownFixedOpen = !isDropdownFixedOpen;
            dropdownContent.style.display = isDropdownFixedOpen ? 'block' : 'none';
        });

        // Close dropdown if clicking outside
        document.addEventListener('click', function (event) {
            if (!dropdownContent.contains(event.target) && !settingsIcon.contains(event.target)) {
                dropdownContent.style.display = 'none';
                isDropdownFixedOpen = false;
            }
        });



        //sectioning------------------------------------------------------------------------
function showContent(contentId) {
    // Hide all content sections (related to the core memories content only)
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        content.style.display = 'none'; // Hide all '.content' sections
    });

    // Show the selected content
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.style.display = 'block'; // Show the selected section
    }

    // Remove active class from all links
    const links = document.querySelectorAll('.link');
    links.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to the clicked link
    const activeLink = Array.from(links).find(link => link.href.includes(`#${contentId}`));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function toggleContainers() {
    var friendsContainer = document.getElementById("friendscontainer");
    var coreMemories = document.getElementById("CoreMemories");
    var timelineInfo = document.getElementById("timelineInfo");

    // Check if CoreMemories is currently visible or not
    if (coreMemories && coreMemories.style.display === "block") {
        friendsContainer.style.display = "none"; // Hide friendsContainer when CoreMemories is visible
    } else {
        friendsContainer.style.display = "flex"; // Show friendsContainer when CoreMemories is hidden
    }


}
function showTimeline() {
    // Get the timelineInfo element by its ID or class
    const timelineInfo = document.getElementById('timelineInfo'); // Adjust the selector as needed

    // Always show the timelineInfo
    if (timelineInfo) {
        timelineInfo.style.display = "block";
    }
}

// Example of a function to show CoreMemories and hide friendsContainer
function showCoreMemories() {
    var coreMemories = document.getElementById("CoreMemories");
    var friendsContainer = document.getElementById("friendscontainer");

    coreMemories.style.display = "block";  // Show CoreMemories
    friendsContainer.style.display = "none"; // Hide friendsContainer
}

// Example of a function to hide CoreMemories and show friendsContainer
function hideCoreMemories() {
    var coreMemories = document.getElementById("CoreMemories");
    var friendsContainer = document.getElementById("friendscontainer");

    coreMemories.style.display = "none";   // Hide CoreMemories
    friendsContainer.style.display = "flex"; // Show friendsContainer
}

function hideBothContainers() {
    var friendsContainer = document.getElementById("friendscontainer");
    var coreMemories = document.getElementById("CoreMemories");

    // Hide friendsContainer
    if (friendsContainer) {
        friendsContainer.style.display = "none";
    }

    // Hide CoreMemories
    if (coreMemories) {
        coreMemories.style.display = "none";
    }
}

function hidepostingdiv() {
    const iconsContainer = document.querySelector('.postingdiv');
    if (iconsContainer) {
        iconsContainer.style.display = 'none'; // Hide the icons
    }
}





function showContent(contentId) {
    // Hide all sections
    const sections = document.querySelectorAll('.centerContainer');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(contentId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}



//--------------------------messeages-------------------
// Function to toggle the chat container visibility
function toggleChat() {
    var chatContainer = document.getElementById('chat-container');
    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
        chatContainer.style.display = 'block';
    } else {
        chatContainer.style.display = 'none';
    }
}

// Function to close the chat container (hide completely)
function closeChat() {
    var chatContainer = document.getElementById('chat-container');
    chatContainer.style.display = 'none';
}

// Function to minimize the chat container (collapse the chat but keep header)
function minimizeChat() {
    var chatBox = document.getElementById('chat-box');
    var inputBox = document.getElementById('input-box');
    
    // Toggle visibility of chat box and input box for minimize
    if (chatBox.style.display === 'none') {
        chatBox.style.display = 'block';
        inputBox.style.display = 'flex';
    } else {
        chatBox.style.display = 'none';
        inputBox.style.display = 'none';
    }
}

// Add keydown event listener for "Enter" key
document.getElementById("user-input").addEventListener("keydown", function(event) {
    console.log("Key pressed: " + event.key); // Add this for debugging
    if (event.key === "Enter") {
        console.log("Enter key detected"); // Confirm Enter key is detected
        event.preventDefault(); // Prevent default form submission (if any)
        sendMessage();
    }
});

// Function to send the message
function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") {
        return; // Don't send empty messages
    }

    // Display user message
    displayMessage(userInput, "user-message");

    // Get bot response
    const botResponse = getBotResponse(userInput);
    
    // Display bot response after a short delay (for realism)
    setTimeout(() => {
        displayMessage(botResponse, "bot-message");
    }, 500);

    // Clear the input after sending
    document.getElementById("user-input").value = "";
}

// Function to display a message in the chat box
function displayMessage(message, className) {
    const chatBox = document.getElementById("chat-box");
    
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = message;
    
    chatBox.appendChild(messageDiv);
    
    // Scroll chat to the bottom when new message is added
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to get the bot response based on user input
function getBotResponse(input) {
    input = input.toLowerCase();
    
    if (input.includes('yow') || input.includes('hello') || input.includes('hi')) {
        return "Ayo, musta!!";
    } else if (input.includes('anyong')) {
        return "Hi, kamusta ka?";
    } else if (input.includes('how are you')) {
        return "I'm just a bot, but I'm doing well! How about you?";
    } else {
        return "Sorry, I don't understand that.";
    }
}


