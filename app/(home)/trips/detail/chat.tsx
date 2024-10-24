
import { Button } from '@/components/buttons/Button';
import { IconSendMessage } from '@/components/icons/Icons';
import { InputStyled } from '@/components/inputs/InputStyled';
import { RoomMessage, Trip } from '@/types/types';
import { GlobalContext } from '@/utils/Provider';
import { parseUrlParams } from '@/utils/utils';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

export default function ChatScreen() {
    const context = useContext(GlobalContext)
    const { idTrip } = useLocalSearchParams<{ idTrip: string }>()
    console.log("idTrip");
    console.log(idTrip);

    const idUser = context?.user.id
    const username = context?.user.username
    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const messageRef = useRef('')
    const flatListRef = useRef<FlatList<RoomMessage> | null>(null);

    const socket = useMemo(() => {
        const s = io('http://192.168.0.176:5000', {
            query: { user_id: idUser?.toString() }
        })
        if (!s) console.warn('error al conectarse al servidor');
        return s;
    }, [idUser]);

    useEffect(() => {
        if (idTrip) socket.emit('join_room', { username, room: idTrip });
    }, [idTrip])

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

    const leaveRoom = () => {
        socket.emit('leave_room', { username, idTrip });
    };

    const handleSendMessage = () => {
        if (!idUser || !username || !messageRef.current) return
        const msg: RoomMessage = {
            id_user: idUser,
            username: username,
            message: messageRef.current,
            room: parseUrlParams(idTrip),
        }
        socket.emit('message', msg);

        messageRef.current = ''
        setTimeout(() => {
            if (!flatListRef.current) return
            flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
    };


    const SystemMessage = ({ message }: { message: any }) => {

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
        if (message.id_user == idUser) return (<MyMessage message={message} />)
        if (message.id_user != idUser) return (<OtherMessage message={message} />)
    }

    console.log('renderall');

    const InputMessage = () => {
        const [value, setValue] = useState(messageRef.current);
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
        <View className='flex items-center justify-center bg-background max-h-svh p-6 pt-12 pb-24 '>
            <View className='mt-12'>
                {/* <Text className='text-foreground'>Sesion con id: {idUser}</Text> */}
                <View className='flex flex-row'>
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