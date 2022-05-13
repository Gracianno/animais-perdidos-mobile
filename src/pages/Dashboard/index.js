import React, { useEffect, useState } from 'react';

import { Icon, Form, Textarea } from 'native-base';
import { withNavigationFocus } from 'react-navigation';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    Modal,
    TouchableHighlight,
    RefreshControl,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ActionButton from 'react-native-action-button';
import { Container, List } from './styles';

import Background from '~/components/Background';
import Posts from '~/components/Appointment';
import api from '~/services/api';

// eslint-disable-next-line react/prop-types
function Dashboard({ isFocused, navigation }) {
    const [posts, setPosts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    async function loadPosts() {
        const response = await api.get('animals');
        setPosts(response.data);
        setRefreshing(false);
    }

    async function loadPosts2() {
        const response = await api.get('animals/user');
        setPosts(response.data);
        setRefreshing(false);
    }

    function pickImage() {
        ImagePicker.showImagePicker(
            {
                title: 'Escolha a Imagem',
                maxHeight: 600,
                maxWidth: 800,
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

    const clickHandler = () => {
        setModalVisible(true);
    };

    useEffect(() => {
        if (isFocused) {
            loadPosts();
        }
    }, [isFocused]);

    async function save() {
        const formData = new FormData();

        if (image !== null && image !== '') {
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

            // eslint-disable-next-line no-use-before-define
            handleSubmit(response.data.id);
        } else {
            // eslint-disable-next-line no-use-before-define
            handleSubmit(null);
        }
    }

    async function handleSubmit(avatarId) {
        await api.post('animals', {
            description,
            avatar_id: avatarId,
        });

        setPosts('');
        setImage('');
        setModalVisible(!modalVisible);

        loadPosts();

        alert('Post enviado!');
    }

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    return (
        <Background>
            <Container>
                <List
                    data={posts}
                    a={navigation}
                    keyExtractor={item => String(item.id)}
                    // eslint-disable-next-line prettier/prettier
                    renderItem={({ item }) => (
                        <Posts data={item} a={navigation.navigate} />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    {/* Inner options of the action button */}
                    {/* Icons here
             https://infinitered.github.io/ionicons-version-3-search/
           */}
                    <ActionButton.Item
                        buttonColor="#9b59b6"
                        title="Minhas postagens"
                        onPress={loadPosts2}
                    >
                        <Icon
                            name="person-outline"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor="#3498db"
                        title="Todas as postagens"
                        onPress={loadPosts}
                    >
                        <Icon
                            name="layers-outline"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor="#1abc9c"
                        title="Nova postagem"
                        onPress={clickHandler}
                    >
                        <Icon
                            name="create-outline"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                </ActionButton>
            </Container>
            <Modal animationType="slide" transparent visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Novo Post</Text>
                        <Form>
                            <View style={styles.passwordContainer}>
                                <Textarea
                                    rowSpan={8}
                                    bordered
                                    placeholder="Escreva a descrição"
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#D3D3D3',
                                        marginLeft: 0,
                                        borderRadius: 20,
                                    }}
                                    value={description}
                                    onChangeText={setDescription}
                                />
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={image}
                                        style={styles.image}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={styles.openButton}
                                >
                                    <Text style={styles.textStyle}>
                                        Escolha uma foto
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Form>
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: '#2196F3',
                            }}
                            onPress={() => {
                                save();
                            }}
                        >
                            <Text style={styles.textStyle}>Enviar</Text>
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
                </View>
            </Modal>
        </Background>
    );
}

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 70,
        height: 70,
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
        height: '80%',
        width: '90%',
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    closedButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
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
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: 'white',
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 20,
    },
    image: {
        width: 300,
        height: 150,
        resizeMode: 'center',
        alignSelf: 'center',
    },
});

export default withNavigationFocus(Dashboard);
