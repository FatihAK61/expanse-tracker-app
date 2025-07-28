import { AuthProvider } from '@/context/authContext'
import { Stack } from 'expo-router'

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(modals)/profileModal' options={{ presentation: 'modal' }} />
            <Stack.Screen name='(modals)/walletModal' options={{ presentation: 'modal' }} />
            <Stack.Screen name='(modals)/transactionModal' options={{ presentation: 'modal' }} />
            <Stack.Screen name='(modals)/searchModal' options={{ presentation: 'modal' }} />
        </Stack>
    )
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <StackLayout />
        </AuthProvider>
    )
}