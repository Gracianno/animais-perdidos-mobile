import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    margin-bottom: 15px;
    padding: 20px;
    border-radius: 4px;
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    opacity: ${props => (props.past ? 0.6 : 1)};
`;

export const Left = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Avatar = styled.Image`
    width: 80px;
    height: 100px;
    border-radius: 15px;
`;
export const Info = styled.View`
    margin-left: 15px;
`;

export const Name = styled.Text`
    margin-right: 80px;
    font-weight: bold;
    font-size: 14px;
    color: #333;
`;

export const Time = styled.Text`
    margin-right: 80px;
    color: #333;
    font-size: 13px;
    margin-top: 4px;
    font-weight: bold;
`;

export const Desc = styled.Text`
    color: #4B0082;
    font-size: 15px;
    margin-top: 4px;
`;
