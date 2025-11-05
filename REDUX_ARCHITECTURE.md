# Architecture Redux de Rubberduck

## Structure

```
store/
├── index.ts                 # Configuration du store Redux
├── ReduxProvider.tsx        # Provider React pour Redux
└── slices/
    ├── chatSlice.ts        # Gestion de l'état des chats
    ├── uiSlice.ts          # Gestion de l'état de l'UI
    └── apiSlice.ts         # RTK Query pour les appels API
```

## État Global

### Chat State (`chatSlice`)
- `chats`: Object contenant tous les chats indexés par ID
- `currentChatId`: ID du chat actuellement ouvert
- `isTyping`: Indicateur de saisie de l'assistant
- `messageIdCounter`: Compteur pour générer des IDs uniques

### UI State (`uiSlice`)
- `isSidebarOpen`: État de la sidebar gauche
- `isRightSidebarOpen`: État de la sidebar droite
- `theme`: Thème de l'application ('light' | 'dark')
- `isSending`: Indicateur d'envoi en cours

## Hooks Personnalisés

### `useChatRedux()`
Hook principal pour interagir avec l'état des chats :

```typescript
const {
    chats,              // Tous les chats
    currentChatId,      // ID du chat actuel
    isTyping,           // État de typing
    isSending,          // État d'envoi
    createChat,         // Créer un nouveau chat
    addMessage,         // Ajouter un message
    getChat,            // Récupérer un chat par ID
    setCurrentChatId,   // Définir le chat actuel
    generateMessageId,  // Générer un ID unique
    setIsTyping,        // Définir l'état typing
    setIsSending,       // Définir l'état sending
} = useChatRedux();
```

### `useChatSendRedux()`
Hook pour gérer l'envoi de messages avec intégration API :

```typescript
const handleSend = useChatSendRedux();

// Utilisation
handleSend("Mon message"); // Gère automatiquement la création de chat ou l'ajout au chat existant
```

## API Integration (RTK Query)

### Endpoints Disponibles

- `useGetChatsQuery()` - Récupérer tous les chats
- `useGetChatQuery(chatId)` - Récupérer un chat spécifique
- `useCreateChatMutation()` - Créer un nouveau chat
- `useSendMessageMutation()` - Envoyer un message
- `useGetAssistantResponseMutation()` - Obtenir une réponse de l'assistant
- `useDeleteChatMutation()` - Supprimer un chat
- `useUpdateMessageMutation()` - Mettre à jour un message

### Exemple d'utilisation

```typescript
import { useGetAssistantResponseMutation } from '@/store/slices/apiSlice';

const [getAssistantResponse, { isLoading }] = useGetAssistantResponseMutation();

try {
    const response = await getAssistantResponse({
        chatId: 'chat-id',
        messageContent: 'Hello!',
    }).unwrap();
    
    console.log(response);
} catch (error) {
    console.error('Erreur API:', error);
}
```

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
OPENAI_API_KEY=your_api_key_here
```

## Actions Redux

### Chat Actions

- `createChat({ chatId, initialMessage })` - Créer un nouveau chat
- `addMessage({ chatId, message })` - Ajouter un message à un chat
- `setCurrentChatId(chatId)` - Définir le chat actuel
- `setIsTyping(boolean)` - Activer/désactiver l'indicateur de typing
- `incrementMessageId()` - Incrémenter le compteur de messages
- `deleteChat(chatId)` - Supprimer un chat
- `updateMessage({ chatId, messageId, content })` - Mettre à jour un message

### UI Actions

- `toggleSidebar()` - Basculer la sidebar gauche
- `toggleRightSidebar()` - Basculer la sidebar droite
- `setTheme('light' | 'dark')` - Changer le thème
- `setIsSending(boolean)` - Définir l'état d'envoi

## Migration depuis ChatContext

Les composants ont été migrés de `ChatContext` vers Redux pour :

1. **Meilleure gestion d'état** : Redux offre des outils de debugging puissants
2. **Intégration API** : RTK Query simplifie les appels API
3. **Performance** : Sélecteurs optimisés et memoization automatique
4. **DevTools** : Redux DevTools pour inspecter l'état et les actions

## Prochaines Étapes

1. Implémenter le backend API
2. Connecter les endpoints RTK Query aux vrais endpoints
3. Ajouter la persistance de l'état (redux-persist)
4. Implémenter le streaming pour les réponses de l'assistant
5. Ajouter l'authentification et la gestion des utilisateurs

