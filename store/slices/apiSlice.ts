import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Définir l'URL de base de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            // Ajouter des headers si nécessaire (token, etc.)
            const token = localStorage.getItem('authToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Chat', 'Message', 'User'],
    endpoints: (builder) => ({
        // Récupérer tous les chats
        getChats: builder.query<Chat[], void>({
            query: () => '/chats',
            providesTags: ['Chat'],
        }),

        // Récupérer un chat par ID
        getChat: builder.query<Chat, string>({
            query: (chatId) => `/chats/${chatId}`,
            providesTags: (result, error, chatId) => [{ type: 'Chat', id: chatId }],
        }),

        // Créer un nouveau chat
        createChat: builder.mutation<Chat, { initialMessage: Message }>({
            query: (data) => ({
                url: '/chats',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Chat'],
        }),

        // Envoyer un message
        sendMessage: builder.mutation<Message, { chatId: string; content: string; role: 'user' | 'assistant' }>({
            query: ({ chatId, ...data }) => ({
                url: `/chats/${chatId}/messages`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { chatId }) => [{ type: 'Chat', id: chatId }],
        }),

        // Obtenir une réponse de l'assistant (streaming ou non)
        getAssistantResponse: builder.mutation<Message, { chatId: string; messageContent: string }>({
            query: ({ chatId, messageContent }) => ({
                url: `/chats/${chatId}/assistant`,
                method: 'POST',
                body: { message: messageContent },
            }),
            invalidatesTags: (result, error, { chatId }) => [{ type: 'Chat', id: chatId }],
        }),

        // Supprimer un chat
        deleteChat: builder.mutation<void, string>({
            query: (chatId) => ({
                url: `/chats/${chatId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Chat'],
        }),

        // Mettre à jour un message
        updateMessage: builder.mutation<Message, { chatId: string; messageId: number; content: string }>({
            query: ({ chatId, messageId, content }) => ({
                url: `/chats/${chatId}/messages/${messageId}`,
                method: 'PATCH',
                body: { content },
            }),
            invalidatesTags: (result, error, { chatId }) => [{ type: 'Chat', id: chatId }],
        }),
    }),
});

export const {
    useGetChatsQuery,
    useGetChatQuery,
    useCreateChatMutation,
    useSendMessageMutation,
    useGetAssistantResponseMutation,
    useDeleteChatMutation,
    useUpdateMessageMutation,
} = apiSlice;

