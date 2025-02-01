import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <Provider store={store}>
      {/* Expo Router gère automatiquement la navigation via le dossier app/ */}
      <Slot />
    </Provider>
  );
} 