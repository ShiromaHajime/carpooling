
import { Button } from '@/components/buttons/Button';
import { IconSendMessage } from '@/components/icons/Icons';
import { InputStyled } from '@/components/inputs/InputStyled';
import { RoomMessage } from '@/types/types';
import { GlobalContext } from '@/utils/Provider';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';



export default function ChatScreen() {
    const router = useRouter();
    const context = useContext(GlobalContext)
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const id = context?.user.id
    const username = context?.user.username
    const messageRef = useRef('')
    const flatListRef = useRef<FlatList<RoomMessage> | null>(null);

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

            setTimeout(() => {
                if (!flatListRef.current) return
                flatListRef.current.scrollToEnd({ animated: true });
            }, 100);

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

    const handleSendMessage = () => {
        if (!id || !username || !messageRef.current) return
        const msg: RoomMessage = {
            id_user: id,
            username: username,
            message: messageRef.current,
            room: room,
        }
        socket.emit('message', msg);

        messageRef.current = ''
        setTimeout(() => {
            if (!flatListRef.current) return
            flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
    };


    const SystemMessage = ({ message }: { message: string }) => {

        return (
            <View className={`bg-[#ebeaec] dark:bg-[#0e2212] ml-10 rounded-xl mt-3 p-3`}>
                <Text className='text-muted-foreground' >{message}</Text>
            </View>
        )
    }

    const MyMessage = ({ message }: { message: RoomMessage }) => {
        return (
            <View className="bg-primary ml-10 rounded-xl mt-3 p-3">
                <Text className='text-accent dark:text-foreground font-medium' >{message.username}</Text>
                <Text className='text-muted dark:text-foreground'>{message.message}</Text>
            </View>
        )
    }

    const OtherMessage = ({ message }: { message: RoomMessage }) => {
        return (
            <View className="bg-slate-100 dark:bg-secondary mr-10 rounded-xl mt-3 p-3">
                <Text className='text-foreground font-medium ' >{message.username}</Text>
                <Text className='text-foreground'>{message.message}</Text>
            </View>
        )
    }
    const Message = ({ message }: { message: RoomMessage }) => {
        if (!message.id_user) return (<SystemMessage message={message} />)
        if (message.id_user == id) return (<MyMessage message={message} />)
        if (message.id_user != id) return (<OtherMessage message={message} />)
    }

    console.log('renderall');

    const InputMessage = () => {
        const [value, setValue] = useState(messageRef.current);
        console.log("messageinput");
        console.log(messageRef.current);
        const handleMessage = (message: string) => {
            setValue(message)
            messageRef.current = message
        }
        return (
            <InputStyled
                valueInput={value}
                setValueInput={handleMessage}
                placeholder="Ingrese un mensaje"
            />
        )
    }
    return (
        <View className='flex items-center justify-center bg-background max-h-svh mb-32 p-6 pt-12 pb-24 '>
            <View className='mt-12'>
                <Text className='text-foreground'>Sesion con id: {id}</Text>

                <TextInput
                    className='bg-secondary'
                    placeholder="Room"
                    value={room}
                    onChangeText={setRoom}
                    style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
                />
                <View className='flex flex-row'>
                    <Button label="Join Room" onPress={joinRoom} />
                    <Button label="Leave Room" onPress={leaveRoom} />
                </View>
            </View>
            <View className='bg-card border border-border min-w-full h-auto p-5 my-6 rounded-xl'>
                <View>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={({ item }) => <Message message={item} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View className='mt-4 flex flex-row justify-center items-center gap-3' >
                        <View className='flex-1'>
                            <InputMessage />
                        </View>
                        <TouchableOpacity onPress={handleSendMessage} className='bg-primary p-[12px] rounded-lg'>
                            <IconSendMessage />
                        </TouchableOpacity>
                    </View>
                    <View className='mt-2' />


                </View>
            </View>
        </View>
    )
}