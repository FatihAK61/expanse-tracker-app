import { useAuth } from '@/context/authContext'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import { WalletType } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import * as Icons from 'phosphor-react-native'

import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import Header from '@/components/ui/Header'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'

const WalletModal = () => {
    const { user, updateUserData } = useAuth();
    const [wallet, setWallet] = useState<WalletType>({
        name: "",
        image: null
    })
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const oldWallet: { name: string, image: string, id: string } = useLocalSearchParams();

    useEffect(() => {
        if (oldWallet?.id) {
            setWallet({
                name: oldWallet.name,
                image: oldWallet.image
            });
        }
    }, [])

    const onSubmit = async () => {
        let { name, image } = wallet;
        if (!name.trim() || !image) {
            Alert.alert('New Wallet', 'Please fill the name and choose an image.')
            return;
        }

        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        }

        if (oldWallet?.id) data.id = oldWallet?.id
        setLoading(true);
        const res = await createOrUpdateWallet(data)
        setLoading(false);
        if (res.success) {
            router.back();
        } else {
            Alert.alert('Update Error', res.msg);
        }
    }

    const onDelete = async () => {
        if (!oldWallet?.id) return;

        setLoading(true);
        const res = await deleteWallet(oldWallet?.id);
        setLoading(false);

        if (res.success) {
            router.back();
        } else {
            Alert.alert('Delete Error', res.msg);
        }
    }

    const showDeleteAlert = () => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this wallet? \nThis action will remove all the transactions related to this wallet.',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => console.log('Canceled.') },
                { text: 'Delete', onPress: () => onDelete(), style: 'destructive' },
            ]);
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title={oldWallet?.id ? 'Update Wallet' : 'New Wallet'}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }} />

                <ScrollView contentContainerStyle={styles.form}>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Name</Typo>
                        <Input
                            placeholder='Example Name'
                            value={wallet.name}
                            onChangeText={(val) => setWallet({ ...wallet, name: val })} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet Icon</Typo>
                        <ImageUpload
                            onClear={() => setWallet({ ...wallet, image: null })}
                            file={wallet.image}
                            onSelect={file => setWallet({ ...wallet, image: file })}
                            placeholder='Upload Image' />
                    </View>

                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    oldWallet?.id && !loading && (
                        <Button onPress={showDeleteAlert} style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15 }}>
                            <Icons.Trash color={colors.white} size={verticalScale(24)} weight='bold' />
                        </Button>
                    )
                }
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={'700'}>{oldWallet?.id ? 'Update Wallet' : 'Add Wallet'}</Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default WalletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingY._20
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._10
    },
    inputContainer: {
        gap: spacingY._10
    }
})