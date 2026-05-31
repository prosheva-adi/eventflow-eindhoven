import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './useAuth';

export function useNotifications() {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user?.userId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                console.log("WebSocket connected for user:", user.userId);
                client.subscribe(`/user/topic/notifications`, (message) => {
                    const notification = JSON.parse(message.body);
                    setNotifications(prev => [notification, ...prev]);
                });
            },
            onDisconnect: () => console.log("WebSocket disconnected"),
            onStompError: (frame) => console.error("STOMP error:", frame),
        });

        client.activate();
        return () => client.deactivate();
    }, [user?.userId]);

    const clearNotifications = () => setNotifications([]);

    return { notifications, clearNotifications };
}