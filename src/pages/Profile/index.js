import FormData from 'form-data';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    Platform,
    ScrollView,
    Alert,
    TouchableHighlight,
    Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Background from '~/components/Background';
import { signOut } from '~/store/modules/auth/actions';
import { updateProfileRequest } from '~/store/modules/user/actions';
import {
    Container,
    Title,
    Form,
    FormInput,
    SubmitButton,
    Separator,
    LogoutButton,
} from './styles';
import api from '~/services/api';
import { Textarea } from 'native-base';

export default function Profile() {
    const dispatch = useDispatch();

    const profile = useSelector(state => state.user.profile);

    const emailRef = useRef();
    const oldPasswordRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [image, setImage] = useState('');

    useEffect(() => {
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
    }, [profile]);

    function handleSubmit() {
        dispatch(
            updateProfileRequest({
                name,
                email,
                oldPassword,
                password,
                confirmPassword,
            })
        );
    }

    function handleLogout() {
        dispatch(signOut());
    }

    function pickImage() {
        ImagePicker.showImagePicker(
            {
                title: 'Escolha a Imagem',
                maxHeight: 500,
                maxWidth: 700,
            },
            res => {
                if (!res.didCancel) {
                    setImage({
                        uri: res.uri,
                        base64: res.data,
                        fileName: res.fileName,
                        type: res.type,
                    });
                }
            }
        );
    }

    async function updateIdAvatar(avatar_id) {
        await api.put('/users/avatar', {
            avatar_id,
        });

        handleSubmit();
        setModalVisible(false);
        setImage('');
    }

    async function save() {
        const formData = new FormData();

        formData.append('file', {
            name: image.fileName,
            uri: image.uri,
            type: image.type,
        });

        const response = await api.post('files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        updateIdAvatar(response.data.id);
    }

    const clickHandler = () => {
        setModalVisible(true);
    };

    return (
        <Background>
            <Container>
                <Title>Meu perfil</Title>
                <View style={styles.imageContainer}>
                    {profile.avatar !== null && (
                    <Image source={{uri: profile.avatar.url}} style={styles.image} />
                    )}
                </View>
                <SubmitButton onPress={clickHandler} style={{width: '85%', marginLeft: 30}}>
                    Atualizar foto
                </SubmitButton>
                <Form>
                    <FormInput
                        icon="person-outline"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Nome completo"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current.focus}
                        value={name}
                        onChangeText={setName}
                    />
                    <FormInput
                        icon="mail-outline"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Digite seu e-mail"
                        ref={emailRef}
                        returnKeyType="next"
                        onSubmitEditing={() => oldPasswordRef.current.focus()}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Separator />

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Sua senha atual"
                        ref={oldPasswordRef}
                        returnKeyType="send"
                        onSubmitEditing={() => passwordRef.current.focus()}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />

                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Sua nova senha"
                        ref={passwordRef}
                        returnKeyType="send"
                        onSubmitEditing={() =>
                            confirmPasswordRef.current.focus()
                        }
                        value={password}
                        onChangeText={setPassword}
                    />
                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Confirmacao de senha"
                        ref={confirmPasswordRef}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <SubmitButton onPress={handleSubmit}>
                        Atualizar perfil
                    </SubmitButton>
                    <LogoutButton onPress={handleLogout}>Sair</LogoutButton>
                </Form>
            </Container>
            <Modal animationType="slide" transparent visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Altere sua foto</Text>
                        <Form>
                            <View style={styles.passwordContainer}>
                                <View style={styles.imageContainer2}>
                                    <Image source={image} style={styles.image2} />
                                </View>
                                <TouchableOpacity onPress={pickImage} style={styles.openButton}>
                                    <Text style={styles.textStyle}>Escolha uma foto</Text>
                                </TouchableOpacity>
                                <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: '#2196F3',
                            }}
                            onPress={() => {
                                save();
                            }}
                        >
                            <Text style={styles.textStyle}>Salvar</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{
                                ...styles.closedButton,
                                backgroundColor: 'red',
                            }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Cancelar</Text>
                        </TouchableHighlight>
                            </View>
                        </Form>
                        
                    </View>
                </View>
            </Modal>
        </Background>
    );
}

Profile.navigationOptions = {
    tabBarLabel: 'Meu perfil',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={20} color={tintColor} />
    ),
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 120,
        height: 120,
        
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 60
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'center',
        borderRadius: 50
    },
    button: {
        marginTop: 30,
        padding: 10,
        backgroundColor: '#4286f4',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        // alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: '60%',
        width: '90%',
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10
    },
    closedButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    imageContainer2: {
        width: '100%',
        height: 150,
        
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 20
    },
    image2: {
        width: 500,
        height: 150,
        resizeMode: 'center',
        borderRadius: 20,
        alignSelf: 'center',
    },
});
