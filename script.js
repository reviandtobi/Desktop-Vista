document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('context-menu');
    const bottomBarMenu = document.getElementById('bottom-bar-menu');
    const appMenu = document.getElementById('app-menu');
    const uploadBackground = document.getElementById('upload-background');
    const bottomBar = document.getElementById('bottom-bar');
    const appItems = document.getElementById('app-items');

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

    bottomBar.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        bottomBarMenu.style.display = 'flex';
        bottomBarMenu.style.left = `${event.pageX}px`;
        bottomBarMenu.style.top = `${event.pageY}px`;
    });

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
        bottomBarMenu.style.display = 'none';
        appMenu.style.display = 'none';
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

    // Add App functionality
    document.getElementById('add-app').addEventListener('click', () => {
        const appUrl = prompt('Enter the URL of the app:');
        if (appUrl) {
            const link = document.createElement('a');
            link.href = appUrl;
            link.rel = 'icon';
            document.head.appendChild(link);

            link.onload = () => {
                const faviconUrl = link.href;
                const appIcon = document.createElement('img');
                appIcon.src = faviconUrl;
                appIcon.width = 40;
                appIcon.height = 40;
                appIcon.classList.add('app-icon');
                appIcon.dataset.url = appUrl;
                appItems.appendChild(appIcon);
                document.head.removeChild(link);
            };

            link.onerror = () => {
                alert('Failed to fetch the favicon.');
                document.head.removeChild(link);
            };
        }
    });

    appItems.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('app-icon')) {
            appMenu.style.display = 'flex';
            appMenu.style.left = `${event.pageX}px`;
            appMenu.style.top = `${event.pageY}px`;
            appMenu.dataset.targetApp = event.target.src;
        }
    });

    document.getElementById('remove-app').addEventListener('click', () => {
        const targetApp = appMenu.dataset.targetApp;
        if (targetApp) {
            const appIcon = [...appItems.children].find(app => app.src === targetApp);
            if (appIcon) {
                appItems.removeChild(appIcon);
            }
        }
    });
});