import React, { useState } from 'react';
import {
    Left,
    Right,
    Body,
    Button,
    Icon,
    View,
    List,
    ListItem,
    Thumbnail,
    Text,
    Content,
    Card,
    CardItem,
    Form,
    Textarea,
} from 'native-base';
import {
    Image,
    Modal,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import api from '~/services/api';

// eslint-disable-next-line react/prop-types
export default function Posts({ data, a }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [hours, setHours] = useState('');
    const [message, setMessage] = useState('');
    const profile = useSelector(state => state.user.profile);

    async function loadAvailable(animal) {
        const response = await api.get(`notifications/${animal.id}`);

        setHours(response.data);

        setModalVisible(true);
    }

    async function handleSubmit(idAnimal) {
        await api.post('notifications', {
            mensagem: message,
            idAnimal,
        });
        setMessage('');
        setModalVisible(!modalVisible);

        alert('Comentário enviado!');
    }

    async function updatePost(idAnimal) {
        await api.put(`animals/${idAnimal}`);

        alert('Post atualizado!');
    }

    function showAlert(id) {
        Alert.alert(
            'O status desse post serà atualizado.',
            'Tem certeza que deseja continuar?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => updatePost(id) },
            ]
        );
    }

    const Home = ({ hours }) => (
        <Content>
            <Text>Comentários</Text>
            <List>
                {hours.map((
                    blog // eslint-disable-next-line no-underscore-dangle
                ) => (
                    <ListItem key={blog._id} thumbnail>
                        <Right style={{ width: '90%', marginLeft: -30 }}>
                            <CardItem>
                                <Thumbnail
                                    style={{
                                        width: 35,
                                        height: 35,
                                    }}
                                    source={{
                                        uri: blog.avatar
                                            ? blog.avatar
                                            : `https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png`,
                                    }}
                                />
                                <Body>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {blog.name_user}
                                    </Text>
                                    <Text note>
                                        {format(
                                            new Date(blog.createdAt),
                                            'dd-MM-yyyy H:mm'
                                        )}
                                    </Text>
                                </Body>
                            </CardItem>
                            <Left style={{ marginLeft: -80 }}>
                                <Text note style={{ fontSize: 15 }}>
                                    {blog.content}
                                </Text>
                            </Left>
                        </Right>
                    </ListItem>
                ))}
            </List>
        </Content>
    );

    return (
        <Content>
            <Card>
                <CardItem>
                    <Left>
                    {data.user.avatar !== null && (
                        <Thumbnail
                            source={{
                                uri: data.user.avatar.url
                                    ? data.user.avatar.url
                                    : `https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png`,
                            }}
                        />
                    )}
                    {data.user.avatar === null && (
                        <Thumbnail
                            source={{
                                uri: `https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png`,
                            }}
                        />
                    )}
                        <Body>
                            <Text>{data.user.name}</Text>
                            <Text note>
                                {format(
                                    new Date(data.created_at),
                                    'dd-MM-yyyy H:mm'
                                )}
                            </Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Text>{data.description}</Text>
                </CardItem>
                {data.avatar2 !== null && (
                    <CardItem cardBody>
                        <Image
                            source={{
                                uri: data.avatar2.url
                                    ? data.avatar2.url
                                    : `https://images.wagwalkingweb.com/media/training_guides/force-fetch/hero/How-to-Train-Your-Dog-to-Force-Fetch.jpg`,
                            }}
                            style={{ height: 200, width: null, flex: 1 }}
                        />
                    </CardItem>
                )}
                {profile.id === data.user.id && (
                    <CardItem>
                        <Text style={{ color: 'red' }}>Animal Encontrado?</Text>
                        <Button
                            transparent
                            onPress={() => {
                                showAlert(data.id);
                            }}
                        >
                            <Icon
                                name="checkmark-circle-outline"
                                style={{ color: 'green' }}
                            />
                        </Button>
                    </CardItem>
                )}
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon type="FontAwesome" name="thumbs-up" />
                            <Text>12</Text>
                        </Button>
                    </Left>
                    <Left>
                        <Button
                            transparent
                            onPress={() => {
                                loadAvailable(data);
                            }}
                        >
                            <Icon type="FontAwesome" name="comments" />
                            <Text>Comentários</Text>
                        </Button>
                    </Left>
                </CardItem>
                <Modal animationType="slide" transparent visible={modalVisible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Home hours={hours} />
                            <Form>
                                <View style={styles.passwordContainer}>
                                    <Textarea
                                        rowSpan={2}
                                        bordered
                                        placeholder="Escreva um Comentario"
                                        style={{
                                            width: '85%',
                                            backgroundColor: '#D3D3D3',
                                            marginLeft: 20,
                                            borderRadius: 20,
                                        }}
                                        value={message}
                                        onChangeText={setMessage}
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleSubmit(data.id)}
                                    >
                                        <Icon
                                            type="FontAwesome"
                                            name="paper-plane"
                                            style={{
                                                paddingTop: 12,
                                                paddingLeft: 3,
                                                color: 'blue',
                                                width: 77,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Form>

                            <TouchableHighlight
                                style={{
                                    ...styles.openButton,
                                    backgroundColor: '#2196F3',
                                }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Fechar</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </Card>
        </Content>
    );
}

const styles = StyleSheet.create({
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
    passwordContainer: {
        flexDirection: 'row',
        // borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 5,
    },
});
