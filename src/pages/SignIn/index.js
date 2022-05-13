import React, { useRef, useState } from 'react';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Background from '~/components/Background';
import logo from '~/assets/7c89d878-f2ee-4c39-9880-c5f66be68ebe_200x200.png';

import {
    Container,
    Form,
    FormInput,
    SubmitButton,
    SignLink,
    SignLinkText,
} from './styles';

import { signInRequest } from '~/store/modules/auth/actions';

// eslint-disable-next-line react/prop-types
export default function SignIn({ navigation }) {
    const dispatch = useDispatch();
    const passWordRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const loading = useSelector(state => state.auth.loading);

    function handleSubmit() {
        dispatch(signInRequest(email, password));
    }

    return (
        <Background>
            <Container>
                <Image source={logo} />

                <Form>
                    <FormInput
                        icon="mail-outline"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Digite seu e-mail"
                        returnKeyType="next"
                        onSubmitEditing={() => passWordRef.current.focus()}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <FormInput
                        icon="lock-outline"
                        secureTextEntry
                        placeholder="Sua senha secreta"
                        ref={passWordRef}
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <SubmitButton loading={loading} onPress={handleSubmit}>
                        Acessar
                    </SubmitButton>
                </Form>

                <SignLink onPress={() => navigation.navigate('SignUp')}>
                    <SignLinkText>Criar conta gratuita</SignLinkText>
                </SignLink>
            </Container>
        </Background>
    );
}
