
import { Button } from '@/components/Button';
import { InputStyled } from '@/components/inputs/InputStyled';
import { GlobalContext } from '@/utils/Provider';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import io from 'socket.io-client';



export default function ChatScreen() {
    const router = useRouter();
    const context = useContext(GlobalContext)
    const [user, setUser] = useState(context?.state);
    const [idRecipient, setIdRecipient] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [input, setInput] = useState('');
    const id = context?.state.id

    const socket = useMemo(() => {
        const s = io('http://192.168.0.176:5000', {
            query: { user_id: id?.toString() }
        })
        return s;
    }, [id]);


    useEffect(() => {
        socket.on('message', msg => {
            setMessages((prev: any) => [...prev, msg]);
        });

        return () => {
            socket.off('message'); // Limpiar el evento al desmontar
        };

    }, []);

    const sendMessage = () => {
        const messageData = {
            recipient_id: idRecipient.toString(), // ID del usuario al que se envía el mensaje
            message: input
        };
        socket.emit('message', messageData);
        setInput('');
    };

    const ItemMessage = ({ item }: { item: string }) => {
        return (
            <View className='bg-sky-400 rounded mt-2 p-2'>
                <Text>{item}</Text>
            </View>
        )
    }

    return (
        <View className='flex items-center justify-center max-h-screen p-6 pt-12 pb-24 bg-slate-400'>
            <View>
                <Text>Sesion con id: {id}</Text>

                <Text>Enviar mensaje a id: </Text>
                <TextInput value={idRecipient} onChangeText={setIdRecipient}
                    className='bg-gray-400'
                />
            </View>
            <View className='bg-slate-200 w-screen p-5'>

                <FlatList
                    data={messages}
                    renderItem={({ item }) => <ItemMessage item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Text className="text-md font-medium mb-2 text-slate-700"
                >Mensaje:</Text>
                <InputStyled
                    className=""
                    setValueInput={setInput}
                    placeholder="Ingrese un mensaje"
                />
                <Button label="Enviar mensaje" variant={'secondary'} onPress={sendMessage} />
            </View>
        </View>
    )
}