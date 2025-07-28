import { useAuth } from '@/context/authContext'
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { TransactionType, WalletType } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { orderBy, where } from '@firebase/firestore'
import { expenseCategories, transactionTypes } from '@/constants/data'
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService'
import * as Icons from 'phosphor-react-native'

import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import Header from '@/components/ui/Header'
import BackButton from '@/components/ui/BackButton'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import useFetchData from '@/hooks/useFetchData'
import Input from '@/components/ui/Input'


const TransactionModal = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    const {
        data: wallets,
        error: walletError,
        loading: walletLoading,
    } = useFetchData<WalletType>('wallets', [
        where('uid', '==', user?.uid),
        orderBy('created', 'desc')
    ]);

    const [transaction, setTransaction] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description: '',
        category: '',
        date: new Date(),
        image: null,
        walletId: ''
    })

    type paramType = {
        id?: string;
        type: string;
        amount: string;
        date: string;
        description?: string;
        category?: string;
        image?: any;
        uid?: string;
        walletId: string;
    }
    const oldTransaction: paramType = useLocalSearchParams();

    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || transaction.date;
        setTransaction({ ...transaction, date: currentDate });
        setShowDatePicker(Platform.OS == 'ios' ? true : false);
    };

    useEffect(() => {
        if (oldTransaction?.id) {
            setTransaction({
                type: oldTransaction?.type,
                amount: Number(oldTransaction.amount),
                description: oldTransaction.description || '',
                category: oldTransaction.category || '',
                date: new Date(oldTransaction.date),
                walletId: oldTransaction.walletId,
                image: oldTransaction?.image,
            });
        }
    }, [])

    const onSubmit = async () => {
        const { type, amount, description, category, date, walletId, image } = transaction;

        if (!walletId || !date || !amount || (type == 'expense' && !category)) {
            Alert.alert('Transaction', 'Please fill all the fields.')
            return;
        }

        let transactionData: TransactionType = {
            type, amount, description, category, date, walletId, image: image ? image : null, uid: user?.uid
        }

        if (oldTransaction?.id) transactionData.id = oldTransaction.id;
        setLoading(true);
        const res = await createOrUpdateTransaction(transactionData);
        setLoading(false);

        if (res.success) {
            router.back();
        } else {
            Alert.alert('Transaction', res.msg);
        }
    }

    const onDelete = async () => {
        if (!oldTransaction?.id) return;

        setLoading(true);
        const res = await deleteTransaction(oldTransaction?.id, oldTransaction?.walletId);
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
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel', onPress: () => console.log('Canceled.') },
                { text: 'Delete', onPress: () => onDelete(), style: 'destructive' },
            ]);
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title={oldTransaction?.id ? 'Update Transaction' : 'New Transaction'}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }} />

                <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Type</Typo>
                        <Dropdown
                            style={styles.dropdownContainer}
                            activeColor={colors.neutral700}
                            selectedTextStyle={styles.dropdownSelectedText}
                            itemTextStyle={styles.dropDownItemText}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            iconStyle={styles.dropdownIcon}
                            data={transactionTypes}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={transaction.type}
                            onChange={item => {
                                setTransaction({ ...transaction, type: item.value })
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Wallet</Typo>
                        <Dropdown
                            style={styles.dropdownContainer}
                            activeColor={colors.neutral700}
                            selectedTextStyle={styles.dropdownSelectedText}
                            itemTextStyle={styles.dropDownItemText}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            iconStyle={styles.dropdownIcon}
                            data={wallets.map((wallet) => ({
                                label: `${wallet?.name} ($${wallet.amount})`,
                                value: wallet?.id,
                            }))}
                            maxHeight={300}
                            placeholder={'Select Wallet'}
                            placeholderStyle={styles.dropdownPlaceholder}
                            labelField="label"
                            valueField="value"
                            value={transaction.walletId}
                            onChange={item => {
                                setTransaction({ ...transaction, walletId: item.value || '' })
                            }}
                        />
                    </View>

                    {
                        transaction.type == 'expense' && (
                            <View style={styles.inputContainer}>
                                <Typo color={colors.neutral200}>Expense Category</Typo>
                                <Dropdown
                                    style={styles.dropdownContainer}
                                    activeColor={colors.neutral700}
                                    selectedTextStyle={styles.dropdownSelectedText}
                                    itemTextStyle={styles.dropDownItemText}
                                    itemContainerStyle={styles.dropdownItemContainer}
                                    containerStyle={styles.dropdownListContainer}
                                    iconStyle={styles.dropdownIcon}
                                    data={Object.values(expenseCategories)}
                                    maxHeight={300}
                                    placeholder={'Select Category'}
                                    placeholderStyle={styles.dropdownPlaceholder}
                                    labelField="label"
                                    valueField="value"
                                    value={transaction.category}
                                    onChange={item => {
                                        setTransaction({ ...transaction, category: item.value || '' })
                                    }}
                                />
                            </View>
                        )
                    }

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Date</Typo>
                        {
                            !showDatePicker && (
                                <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                                    <Typo size={14}>
                                        {(transaction.date as Date).toLocaleDateString()}
                                    </Typo>
                                </Pressable>
                            )
                        }

                        {
                            showDatePicker && (
                                <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                                    <DateTimePicker
                                        themeVariant='dark'
                                        value={transaction.date as Date}
                                        textColor={colors.white}
                                        mode='date'
                                        display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                                        onChange={onDateChange}
                                    />
                                    {
                                        Platform.OS == 'ios' && (
                                            <TouchableOpacity style={styles.dataPickerButton} onPress={() => setShowDatePicker(false)}>
                                                <Typo size={15} fontWeight={'500'}>Ok</Typo>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Amount</Typo>
                        <Input keyboardType='numeric' value={transaction.amount?.toString()}
                            onChangeText={(val) => setTransaction({ ...transaction, amount: Number(val.replace(/[^0-9]/g, '')) })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo color={colors.neutral200}>Description</Typo>
                            <Typo color={colors.neutral500} size={14}>(optional)</Typo>
                        </View>
                        <Input value={transaction.description}
                            multiline
                            containerStyle={{
                                flexDirection: 'row',
                                height: verticalScale(100),
                                alignItems: 'flex-start',
                                paddingVertical: 15
                            }}
                            onChangeText={(val) => setTransaction({ ...transaction, description: val })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo color={colors.neutral200}>Receipt</Typo>
                            <Typo color={colors.neutral500} size={14}>(optional)</Typo>
                        </View>
                        <ImageUpload
                            onClear={() => setTransaction({ ...transaction, image: null })}
                            file={transaction.image}
                            onSelect={(file) => setTransaction({ ...transaction, image: file })}
                            placeholder='Upload Image' />
                    </View>


                </ScrollView>
            </View>

            <View style={styles.footer}>
                {
                    oldTransaction?.id && !loading && (
                        <Button onPress={showDeleteAlert} style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15 }}>
                            <Icons.Trash color={colors.white} size={verticalScale(24)} weight='bold' />
                        </Button>
                    )
                }
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={'700'}>{oldTransaction?.id ? 'Update' : 'Submit'}</Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default TransactionModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        gap: spacingY._20,
        paddingVertical: spacingY._15,
        paddingBottom: spacingY._40
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._5
    },
    dateInput: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    inputContainer: {
        gap: spacingY._10
    },
    iosDatePicker: {},
    iosDropdown: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: verticalScale(14),
        borderWidth: 1,
        color: colors.white,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    androidDropdown: {
        height: verticalScale(54),
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: verticalScale(14),
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        color: colors.white,
    },
    dateInputx: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    dataPickerButton: {
        backgroundColor: colors.neutral700,
        alignSelf: 'flex-end',
        padding: spacingY._7,
        marginRight: spacingX._7,
        paddingHorizontal: spacingY._15,
        borderRadius: radius._10
    },
    dropdownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    dropDownItemText: {
        color: colors.white
    },
    dropdownSelectedText: {
        color: colors.white,
        fontSize: verticalScale(14)
    },
    dropdownListContainer: {
        backgroundColor: colors.neutral900,
        borderRadius: radius._15,
        borderCurve: 'continuous',
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5
    },
    dropdownPlaceholder: {
        color: colors.white
    },
    dropdownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7
    },
    dropdownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral300
    }
})
