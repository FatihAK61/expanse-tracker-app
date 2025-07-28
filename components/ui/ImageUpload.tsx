import { ImageUploadProps } from '@/types'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors, radius } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import { getFilePath } from '@/services/imageService'

import * as ImagePicker from 'expo-image-picker'
import * as Icons from 'phosphor-react-native'
import Typo from '../Typo'

const ImageUpload = ({ file = null, onSelect, onClear, containerStyle, imageStyle, placeholder = '' }: ImageUploadProps) => {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        })

        if (!result.canceled) {
            onSelect(result.assets[0]);
        }
    }
    return (
        <View>
            {
                !file && (
                    <TouchableOpacity onPress={pickImage} style={[styles.inputContainer, containerStyle && containerStyle]}>
                        <Icons.UploadSimple color={colors.neutral200} />
                        {placeholder && <Typo size={15}>{placeholder}</Typo>}
                    </TouchableOpacity>
                )
            }
            {
                file && (
                    <View style={[styles.image, imageStyle && imageStyle]}>
                        <Image
                            style={{ flex: 1 }}
                            source={getFilePath(file)}
                            contentFit='cover'
                            transition={100}
                        />
                        <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
                            <Icons.XCircle size={verticalScale(24)} weight='fill' color={colors.white} />
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    )
}

export default ImageUpload

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: colors.neutral700,
        borderWidth: 1,
        borderColor: colors.neutral500,
        borderStyle: 'dashed',
        borderRadius: radius._15,
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: verticalScale(54)
    },
    image: {
        height: scale(150),
        width: scale(150),
        borderRadius: radius._15,
        borderCurve: 'continuous',
        overflow: 'hidden'
    },
    deleteIcon: {
        position: 'absolute',
        top: scale(6),
        right: scale(6),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 10,
        borderRadius: 50,
    }
})