import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router';
import { colors, spacingY } from '@/constants/theme';
import { orderBy, where } from '@firebase/firestore';
import { TransactionType } from '@/types';

import useFetchData from '@/hooks/useFetchData';
import ModalWrapper from '@/components/ModalWrapper';
import Header from '@/components/ui/Header';
import BackButton from '@/components/ui/BackButton';
import Input from '@/components/ui/Input';
import TransactionList from '@/components/ui/TransactionList';


const SearchModal = () => {
    const { user, updateUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const constraints = [
        where('uid', '==', user?.uid),
        orderBy('date', 'desc')
    ]

    const {
        data: allTransactions,
        error,
        loading: transactionsLoading
    } = useFetchData<TransactionType>('transactions', constraints)


    const filteredTransactions = allTransactions.filter((t) => {
        if (search.length > 1) {
            if (t.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
                t.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
                t.description?.toLowerCase()?.includes(search?.toLowerCase())) {
                return true;
            }
            return false;
        }
        return true;
    });


    return (
        <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
            <View style={styles.container}>
                <Header title='Search' leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }} />

                <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                        <Input
                            placeholder='Search...'
                            placeholderTextColor={colors.neutral400}
                            value={search}
                            containerStyle={{ backgroundColor: colors.neutral800 }}
                            onChangeText={(val) => setSearch(val)}
                        />
                    </View>
                    <View style={styles.transactionContainer}>
                        <TransactionList
                            loading={transactionsLoading}
                            data={filteredTransactions}
                            emptyListMessage='No transactions match your search term.'
                        />
                    </View>

                </ScrollView>
            </View>
        </ModalWrapper>
    )
}

export default SearchModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingY._20
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    inputContainer: {
        gap: spacingY._10
    },
    transactionContainer: {
        marginTop: spacingY._15
    }
})