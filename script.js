document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('context-menu');
    const uploadBackground = document.getElementById('upload-background');
    const addAppButton = document.getElementById('add-app');
    const appFormContainer = document.getElementById('app-form-container');
    const appForm = document.getElementById('app-form');
    const appItems = document.querySelector('.app-items');

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
        contextMenu.style.display = 'flex';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
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

    // Add app button event listener
    addAppButton.addEventListener('click', () => {
        appFormContainer.style.display = 'block';
    });

    // Close form when clicking outside
    document.addEventListener('click', (event) => {
        if (event.target === appFormContainer) {
            appFormContainer.style.display = 'none';
        }
    });

    appForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const appName = document.getElementById('app-name').value;
        const appLink = document.getElementById('app-link').value;
        const favicon = await fetchFavicon(appLink);

        const appIcon = document.createElement('img');
        appIcon.src = favicon;
        appIcon.alt = appName;
        appIcon.title = appName;
        appIcon.width = 40;
        appIcon.height = 40;
        appIcon.style.cursor = 'pointer';
        appIcon.addEventListener('click', () => {
            window.open(appLink, '_blank');
        });

        appItems.appendChild(appIcon);
        appForm.reset();
        appFormContainer.style.display = 'none';

        // Save to local storage
        const apps = JSON.parse(localStorage.getItem('apps')) || [];
        apps.push({ name: appName, link: appLink, favicon: favicon });
        localStorage.setItem('apps', JSON.stringify(apps));
    });

    // Fetch favicon
    async function fetchFavicon(url) {
        const response = await fetch(`https://favicongrabber.com/api/grab/${url}`);
        const data = await response.json();
        return data.icons[0].src || 'default-favicon.png';
    }

    // Load apps from local storage
    const savedApps = JSON.parse(localStorage.getItem('apps')) || [];
    savedApps.forEach(app => {
        const appIcon = document.createElement('img');
        appIcon.src = app.favicon;
        appIcon.alt = app.name;
        appIcon.title = app.name;
        appIcon.width = 40;
        appIcon.height = 40;
        appIcon.style.cursor = 'pointer';
        appIcon.addEventListener('click', () => {
            window.open(app.link, '_blank');
        });

        appItems.appendChild(appIcon);
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