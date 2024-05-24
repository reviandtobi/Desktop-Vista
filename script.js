document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('context-menu');
    const uploadBackground = document.getElementById('upload-background');
    const appItems = document.getElementById('appItems');

    // Function to update time and date
    function updateTimeAndDate() {
        const now = new Date();
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');

        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString();
        
        timeElement.textContent = timeString;
        dateElement.textContent = dateString;
    }

    // Check if background image is saved in local storage
    const savedBackground = localStorage.getItem('background');
    if (savedBackground) {
        desktop.style.backgroundImage = `url(${savedBackground})`;
        desktop.style.backgroundSize = 'cover';
        desktop.style.backgroundPosition = 'center';
    }

    desktop.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        const posX = event.pageX;
        const posY = event.pageY;
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let x = posX;
        let y = posY;

        // Check if context menu goes off screen horizontally
        if (posX + menuWidth > windowWidth) {
            x = windowWidth - menuWidth;
        }

        // Check if context menu goes off screen vertically
        if (posY + menuHeight > windowHeight) {
            y = windowHeight - menuHeight;
        }

        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = 'flex';
    });

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    uploadBackground.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            desktop.style.backgroundImage = `url(${e.target.result})`;
            desktop.style.backgroundSize = 'cover';
            desktop.style.backgroundPosition = 'center';
            // Save background image to local storage
            localStorage.setItem('background', e.target.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    // Delete app functionality
    function deleteApp(appElement) {
        const appName = appElement.getAttribute('data-name');
        const apps = JSON.parse(localStorage.getItem('apps')) || [];
        const updatedApps = apps.filter(app => app.name !== appName);
        localStorage.setItem('apps', JSON.stringify(updatedApps));
        appElement.remove();
    }

    // Add event listener to app items for right-click
    appItems.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        const appElement = event.target.closest('img');
        const posX = event.pageX;
        const posY = event.pageY;
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let x = posX;
        let y = posY;

        // Check if context menu goes off screen horizontally
        if (posX + menuWidth > windowWidth) {
            x = windowWidth - menuWidth;
        }

        // Check if context menu goes off screen vertically
        if (posY + menuHeight > windowHeight) {
            y = windowHeight - menuHeight;
        }

        contextMenu.innerHTML = `<label onclick="deleteApp(this.parentElement.parentElement)">Delete</label>`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = 'flex';
    });

    // Battery Status
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryStatus() {
                const batteryElement = document.getElementById('battery');
                const batteryLevel = Math.floor(battery.level * 100);
                let batteryIcon = '';

                if (battery.charging) {
                    if (batteryLevel <= 20) {
                        batteryIcon = 'battery_charging_20';
                    } else if (batteryLevel <= 30) {
                        batteryIcon = 'battery_charging_30';
                    } else if (batteryLevel <= 50) {
                        batteryIcon = 'battery_charging_50';
                    } else if (batteryLevel <= 60) {
                        batteryIcon = 'battery_charging_60';
                    } else if (batteryLevel <= 80) {
                        batteryIcon = 'battery_charging_80';
                    } else {
                        batteryIcon = 'battery_charging_full';
                    }
                } else {
                    if (batteryLevel <= 10) {
                        batteryIcon = 'battery_alert';
                    } else if (batteryLevel <= 20) {
                        batteryIcon = 'battery_1_bar';
                    } else if (batteryLevel <= 30) {
                        batteryIcon = 'battery_2_bar';
                    } else if (batteryLevel <= 40) {
                        batteryIcon = 'battery_3_bar';
                    } else if (batteryLevel <= 50) {
                        batteryIcon = 'battery_4_bar';
                    } else if (batteryLevel <= 60) {
                        batteryIcon = 'battery_5_bar';
                    } else if (batteryLevel <= 80) {
                        batteryIcon = 'battery_6_bar';
                    } else {
                        batteryIcon = 'battery_full';
                    }
                }

                batteryElement.innerHTML = `<span class="material-symbols-rounded">${batteryIcon}</span>`;
            }

            // Initial update
            updateBatteryStatus();

            // Update on battery status changes
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    } else {
        console.error("Battery API is not supported in this browser.");
    }

    // Update time and date every second
    updateTimeAndDate();
    setInterval(updateTimeAndDate, 1000);
});

// Drag and drop functionality
function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

const appItems = document.getElementById('appItems');

appItems.addEventListener('dragover', (event) => {
    event.preventDefault();
});

appItems.addEventListener('drop', (event) => {
    event.preventDefault();
    const appId = event.dataTransfer.getData('text/plain');
    const appElement = document.getElementById(appId);
    appItems.appendChild(appElement);
});