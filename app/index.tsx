import { Image, StyleSheet, Text, View } from 'react-native'
import { colors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react';

const Index = () => {
    //const router = useRouter();
    //useEffect(() => {
    //    setTimeout(() => {
    //        router.push('/(auth)/welcome')
    //    }, 1000)
    //}, [])
    return (
        <View style={styles.container}>
            <Image style={styles.logo} resizeMode='contain' source={require('../assets/images/splashImage.png')} />
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutral900,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: '20%',
        aspectRatio: 1
    }
})
