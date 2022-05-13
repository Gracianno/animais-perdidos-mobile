import { Alert } from 'react-native';
import { takeLatest, call, put, all, delay } from 'redux-saga/effects';

import api from '~/services/api';
import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
    try {
        const { email, password } = payload;

        const response = yield call(api.post, 'sessions', {
            email,
            password,
        });

        const { token, user } = response.data;

        api.defaults.headers.Authorization = `Bearer ${token}`;

        yield delay(3000);
        yield put(signInSuccess(token, user));

        // history.push('/dashboard');
    } catch (err) {
        Alert.alert(
            'Falha na autenticacao',
            'Houve um erro no login, verifique seus dados '
        );
        yield put(signFailure());
    }
}

export function* signUp({ payload }) {
    try {
        const { name, email, password } = payload;
        yield call(api.post, 'users', {
            name,
            email,
            password,
        });

        Alert.alert('Usuário cadastrados com sucesso.', 'Faça login no app.');

        // history.push('/');
    } catch (err) {
        Alert.alert(
            'Falha no cadastro',
            'Houve um erro no cadastro, verifique seus dados'
        );
        yield put(signFailure());
    }
}

export function setToken({ payload }) {
    if (!payload) return;

    const { token } = payload.auth;

    if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }
}

export default all([
    takeLatest('persist/REHYDRATE', setToken),
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
