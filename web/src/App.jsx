import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AppLayout from "./layouts/AppLayout";
import AppRoutes from "./routes";
import { HealthProvider } from "./context/HealthContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export default function App() {
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            PushNotifications.requestPermissions().then(result => {
                if (result.receive === 'granted') {
                    PushNotifications.register();
                }
            });

            PushNotifications.addListener('registration', (token) => {
                console.log('Push registration success, token: ' + token.value);
                // We would typically send this token to our backend here
            });

            PushNotifications.addListener('registrationError', (error) => {
                console.error('Error on registration: ' + JSON.stringify(error));
            });

            PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push received: ' + JSON.stringify(notification));
            });

            PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                console.log('Push action performed: ' + JSON.stringify(notification));
            });
        } else {
            // Ask for web push notification permission if supported
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <HealthProvider>
                        <AppLayout>
                            <AppRoutes />
                        </AppLayout>
                    </HealthProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}