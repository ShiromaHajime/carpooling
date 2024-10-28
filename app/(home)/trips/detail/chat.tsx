
import { IconSendMessage } from '@/components/icons/Icons';
import { InputStyled } from '@/components/inputs/InputStyled';
import { getMessagesByTrip, sendMessage } from '@/services/message';
import { RoomMessage } from '@/types/types';
import { GlobalContext } from '@/utils/Provider';
import { parseUrlParams } from '@/utils/utils';
import { useToast } from "@/components/Toast";
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';

export default function ChatScreen() {
    const context = useContext(GlobalContext)
    const { idTrip } = useLocalSearchParams<{ idTrip: string }>()
    console.log("idTrip");
    console.log(idTrip);
    const { toast } = useToast();

    const idUser = context.user.id
    const username = context.user.username

    // const obtenerIDAleatorio = () => Math.floor(Math.random() * 5) + 1;
    // const obtenerNombreAleatorio = () => ['fedevalle', 'pabloperez', 'anacastro', 'luismartinez', 'mariagomez', 'josegarcia', 'carlafernandez', 'davidlopez', 'monicacruz', 'jorgerodriguez'][Math.floor(Math.random() * 10)];
    // const idUser = useMemo(() => { return obtenerIDAleatorio() }, [])
    // const username = useMemo(() => { return obtenerNombreAleatorio() }, [])
    // console.log('mi user: ' + username);

    const [messages, setMessages] = useState<RoomMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const messageRef = useRef('')
    const flatListRef = useRef<FlatList<RoomMessage> | null>(null);
    const scrollToEndFlatlist = () => {
        setTimeout(() => {
            if (!flatListRef.current) return
            flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
    }

    const socket = useMemo(() => {
        const s = io('http://192.168.0.176:5000', {
            query: { user_id: idUser?.toString() }
        })
        if (!s) toast('Error al conectarse al chat', 'destructive', 1500, 'top', false)
        return s;
    }, [idUser]);

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            const { error, messages } = await getMessagesByTrip(idTrip)
            setLoading(false)
            if (error) toast('Error al recibir los mensajes', 'destructive', 1500, 'top', false)
            setMessages(messages)
        }
        getMessages()
    }, [])
    useEffect(() => {
        if (idTrip) socket.emit('join_room', { username, room: idTrip });
    }, [idTrip])

    useEffect(() => {
        socket.on('message', (msg: RoomMessage) => {
            setMessages((prev: any) => [...prev, msg]);
            scrollToEndFlatlist()
        });
        return () => {
            socket.off('connect');
            socket.off('message');
        };

    }, []);

    const leaveRoom = () => {
        socket.emit('leave_room', { username, room: idTrip });
    };

    const sendMessageDB = async (msg: RoomMessage) => {
        const { res, error } = await sendMessage(msg)
        if (error) {
            toast('Hubo un error enviando el mensaje', 'destructive', 1200, 'top')
            return
        }
    }

    const handleSendMessage = () => {
        if (!idUser || !username || !messageRef.current) return
        const msg: RoomMessage = {
            id_user: idUser,
            username: username,
            message: messageRef.current,
            room: parseUrlParams(idTrip),
        }
        messageRef.current = ''
        socket.emit('message', msg);
        sendMessageDB(msg)
        scrollToEndFlatlist()
    };


    const SystemMessage = ({ message }: { message: RoomMessage }) => {

        return (
            <View className={`bg-[#ebeaec] dark:bg-[#0e2212] ml-10 rounded-xl mt-3 p-3`}>
                <Text className='text-muted-foreground' >{message.username} {message.message}</Text>
            </View>
        )
    }

    const MyMessage = ({ message }: { message: RoomMessage }) => {

        return (
            <View className="bg-primary ml-10 rounded-xl mt-3 p-3">
                <Text className='text-accent dark:text-foreground font-medium' >{message.username}</Text>
                <Text className='text-muted dark:text-foreground'>{message.message}</Text>
                <Text className='text-sm text-[#a1a1a1] dark:text-[#cacaca]'>{message.sendedTime}</Text>
            </View>
        )
    }

    const OtherMessage = ({ message }: { message: RoomMessage }) => {
        return (
            <View className="bg-slate-100 dark:bg-secondary mr-10 rounded-xl mt-3 p-3">
                <Text className='text-foreground font-medium ' >{message.username}</Text>
                <Text className='text-foreground'>{message.message}</Text>
                <Text className='text-sm text-[#a1a1a1]'>{message.sendedTime}</Text>
            </View>
        )
    }
    const Message = ({ message }: { message: RoomMessage }) => {
        if (message.isSystem) return (<SystemMessage message={message} />)
        if (message.id_user == idUser) return (<MyMessage message={message} />)
        if (message.id_user != idUser) return (<OtherMessage message={message} />)
    }

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
        <View className='flex items-center justify-center bg-background max-h-svh p-6 py-12 '>
            <View className='bg-card border border-border min-w-full h-full p-5 my-6 rounded-xl'>
                {(loading) && (<ActivityIndicator size="large" />)}
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
    )
}