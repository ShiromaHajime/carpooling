
import { Button } from '@/components/Button';
import { InputStyled } from '@/components/inputs/InputStyled';
import { RoomMessage } from '@/types/types';
import { GlobalContext } from '@/utils/Provider';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import io from 'socket.io-client';



export default function ChatScreen() {
    const router = useRouter();
    const context = useContext(GlobalContext)
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const id = context?.state.id
    const username = context?.state.username

    const socket = useMemo(() => {
        const s = io('http://192.168.0.176:5000', {
            query: { user_id: id?.toString() }
        })
        return s;
    }, [id]);


    useEffect(() => {
        socket.on('message', (msg: RoomMessage) => {
            console.log('recibe msg');
            console.log(msg);
            setMessages((prev: any) => [...prev, msg]);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
        };

    }, []);

    const joinRoom = () => {
        socket.emit('join_room', { username, room });
    };

    const leaveRoom = () => {
        socket.emit('leave_room', { username, room });
    };

    const sendMessage = () => {
        if (!id || !username || !message) return
        const msg: RoomMessage = {
            id_user: id,
            username: username,
            message: message,
            room: room,
        }
        socket.emit('message', msg);
        setMessage('');
    };


    const SystemMessage = ({ message }: { message: string }) => {

        return (
            <View className={`bg-[#ebeaec] ml-10 rounded-xl mt-2 p-3`}>
                <Text className='text-muted-foreground' >{message}</Text>
            </View>
        )
    }

    const MyMessage = ({ message }: { message: RoomMessage }) => {
        return (
            <View className={`bg-[#ebeaec] ml-10 rounded-xl mt-2 p-3`}>
                <Text className='text-muted-foreground' >{message.username}</Text>
                <Text>{message.message}</Text>
            </View>
        )
    }

    const OtherMessage = ({ message }: { message: RoomMessage }) => {
        return (
            <View className={`bg-[#25324b] mr-10 rounded-xl mt-2 p-3`}>
                <Text className='text-muted-foreground' >{message.username}</Text>
                <Text className='text-slate-100'>{message.message}</Text>
            </View>
        )
    }
    const Message = ({ message }: { message: RoomMessage }) => {
        if (!message.id_user) return (<SystemMessage message={message} />)
        if (message.id_user == id) return (<MyMessage message={message} />)
        if (message.id_user != id) return (<OtherMessage message={message} />)
        return (
            <View className={`bg-[#ebeaec] ml-10 rounded-xl mt-2 p-3`}>
                <Text>{message.username} con id: </Text>
                <Text>{message.id_user?.toString()} dice:</Text>
                <Text>{message.message}</Text>
            </View>
        )
    }

    return (
        <View className='flex items-center justify-center max-h-screen mt-32 mb-32 p-6 pt-12 pb-24 '>
            <View>
                <Text>Sesion con id: {id}</Text>

                <TextInput
                    placeholder="Room"
                    value={room}
                    onChangeText={setRoom}
                    style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
                />
                <Button label="Join Room" onPress={joinRoom} />
                <Button label="Leave Room" onPress={leaveRoom} />
            </View>
            <View className='bg-[#9ab7e8] min-w-full h-auto p-5 rounded-xl'>
                <View>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <Message message={item} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View className='mt-4' />
                    <InputStyled
                        className=""
                        setValueInput={setMessage}
                        placeholder="Ingrese un mensaje"
                    />
                    <View className='mt-2' />

                    <Button label="Enviar mensaje" variant={'secondary'} onPress={sendMessage} />
                </View>
            </View>
        </View>
    )
}