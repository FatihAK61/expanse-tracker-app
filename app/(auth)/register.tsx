import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';

import ScreenWrapper from '../../components/ScreenWrapper';
import BackButton from '@/components/ui/BackButton';
import Typo from '@/components/Typo';
import Input from '@/components/ui/Input';
import * as Icons from 'phosphor-react-native';
import Button from '@/components/ui/Button';


const Register = () => {
    const { register: registerUser } = useAuth();
    const emailRef = useRef("");
    const nameRef = useRef("");
    const passwordRef = useRef("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert('Sign up', 'Please fill all the fields.')
            return;
        }
        setLoading(true);
        const res = await registerUser(emailRef.current, passwordRef.current, nameRef.current);

        setLoading(false);

        if (!res.success) {
            Alert.alert('Sign up', res.msg);
        }
    }
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={26} />

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={'800'}>Let's</Typo>
                    <Typo size={30} fontWeight={'800'}>Get Started.</Typo>
                </View>

                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>Create an account to track your expenses.</Typo>

                    <Input
                        onChangeText={(val) => { nameRef.current = val }}
                        placeholder='Enter your name'
                        icon={<Icons.User size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                    />

                    <Input
                        onChangeText={(val) => { emailRef.current = val }}
                        placeholder='Enter your e-mail'
                        icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                    />

                    <Input
                        onChangeText={(valp) => { passwordRef.current = valp }}
                        placeholder='Enter your password'
                        secureTextEntry
                        icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                    />

                    <Button loading={loading} onPress={handleSubmit} >
                        <Typo size={22} color={colors.black} fontWeight={'700'}>Sign Up</Typo>
                    </Button>
                </View>

                <View style={styles.footer}>
                    <Typo size={15}>Already have an account ?</Typo>
                    <TouchableOpacity onPress={() => router.navigate('/(auth)/login')}>
                        <Typo size={15} fontWeight={'700'} color={colors.primary}>Login</Typo>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: '500',
        color: colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        color: colors.text,
        fontSize: verticalScale(15)
    }
})