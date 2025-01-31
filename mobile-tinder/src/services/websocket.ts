import * as SecureStore from 'expo-secure-store';

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private typingHandlers: ((data: any) => void)[] = [];
  private onlineStatusHandlers: ((data: any) => void)[] = [];

  async connect() {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      // Utilisez la même IP que votre backend
      this.ws = new WebSocket(`ws://192.168.1.41:3001?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connecté');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message reçu:', data);

        switch (data.event) {
          case 'receive_message':
            this.messageHandlers.forEach(handler => handler(data));
            break;
          case 'user_typing':
            this.typingHandlers.forEach(handler => handler(data));
            break;
          case 'online_status':
            this.onlineStatusHandlers.forEach(handler => handler(data));
            break;
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket erreur:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket déconnecté');
        // Tenter de se reconnecter après un délai
        setTimeout(() => this.connect(), 5000);
      };
    } catch (error) {
      console.error('Erreur de connexion WebSocket:', error);
    }
  }

  sendMessage(matchId: string, content: string, receiverId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket non connecté');
      return;
    }

    this.ws.send(JSON.stringify({
      event: 'send_message',
      match_id: matchId,
      content,
      receiver_id: receiverId
    }));
  }

  sendTyping(matchId: string, receiverId: string, isTyping: boolean) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      event: 'user_typing',
      match_id: matchId,
      receiver_id: receiverId,
      is_typing: isTyping
    }));
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onTyping(handler: (data: any) => void) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  onOnlineStatus(handler: (data: any) => void) {
    this.onlineStatusHandlers.push(handler);
    return () => {
      this.onlineStatusHandlers = this.onlineStatusHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService(); 