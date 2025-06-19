document.addEventListener('DOMContentLoaded', function() {
    const priorityIcon = document.getElementById('priorityIcon');
    const priorityWidget = document.getElementById('priorityWidget');
    const priorityClose = document.getElementById('priorityClose');
    const priorityRefresh = document.getElementById('priorityRefresh');
    const userFormSubmit = document.getElementById('userFormSubmit');
    const priorityBody = document.getElementById('priorityBody');
    const priorityFooter = document.querySelector('.priority-footer');
    const priorityUserForm = document.getElementById('priorityUserForm');
    const prioritySend = document.querySelector('.priority-send');
    const priorityInput = document.querySelector('.priority-input');
    const priorityMessageClose = document.getElementById('priorityMessageClose');
    const priorityMessageBox = document.getElementById('priorityMessageBox');

    let sessionId = null;
    let userName = '';
    let userEmail = '';

    function generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    function clearChat() {
        priorityBody.innerHTML = '';
        sessionId = generateSessionId();
        console.log('New session ID:', sessionId);
        const initialMessage = document.createElement('div');
        initialMessage.classList.add('priority-message', 'bot');
        initialMessage.innerHTML = `
            <div class="message-icon">P</div>
            <div class="message-content">Hello! How can I help you today?</div>
        `;
        priorityBody.appendChild(initialMessage);
    }

    priorityIcon.addEventListener('click', function() {
        priorityWidget.style.display = 'flex';
        sessionId = generateSessionId();
        console.log('New session ID:', sessionId);
    });

    priorityClose.addEventListener('click', function() {
        priorityWidget.style.display = 'none';
    });

    priorityMessageClose.addEventListener('click', function() {
        priorityMessageBox.style.display = 'none';
    });

    priorityRefresh.addEventListener('click', clearChat);

    userFormSubmit.addEventListener('click', function() {
        userName = document.getElementById('visitorName').value.trim();
        userEmail = document.getElementById('visitorEmail').value.trim();

        if (userName && userEmail) {
            console.log('Visitor Details:', { userName, userEmail });
            priorityUserForm.style.display = 'none';
            priorityBody.style.display = 'flex';
            priorityFooter.style.display = 'flex';
        } else {
            alert('Please fill in all fields.');
        }
    });

    prioritySend.addEventListener('click', async function() {
        const message = priorityInput.value.trim();
        if (message) {
            addMessageToChat('You', message);
            priorityInput.value = '';

            const companyName = "Pri0r1ty Ai";
            const companySector = "AI-Technology";
            const chatTime = new Date().toISOString();

            try {
                const response = await fetch('https://pri0r1ty.app.n8n.cloud/webhook/f2922acd-3bfe-4f06-8120-6fba1d4497cf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        sessionId: sessionId,
                        userName: userName,
                        userEmail: userEmail,
                        companyName: companyName,
                        companySector: companySector,
                        chatTime: chatTime
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Success:', data);
                const outputMessage = data.output || "No response output.";
                addMessageToChat('Pri0r1ty', outputMessage);
            } catch (error) {
                console.error('Error:', error);
                addMessageToChat('System', "There was an error sending your message.");
            }
        }
    });

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('priority-message', sender === 'You' ? 'user' : 'bot');

        const iconElement = document.createElement('div');
        iconElement.classList.add('message-icon');
        iconElement.textContent = sender === 'You' ? 'Y' : 'P';

        const contentElement = document.createElement('div');
        contentElement.classList.add('message-content');
        contentElement.textContent = message;

        if (sender === 'You') {
            messageElement.appendChild(contentElement);
            messageElement.appendChild(iconElement);
        } else {
            messageElement.appendChild(iconElement);
            messageElement.appendChild(contentElement);
        }

        priorityBody.appendChild(messageElement);
        priorityBody.scrollTop = priorityBody.scrollHeight;
    }
});
