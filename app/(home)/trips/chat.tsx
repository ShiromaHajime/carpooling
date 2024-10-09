
import { Button } from '@/components/Button';
import { InputStyled } from '@/components/inputs/InputStyled';
import { MessageData } from '@/types/types';
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
        socket.on('message', (msg: MessageData) => {
            console.log('recibe msg');
            console.log(msg);
            setMessages((prev: any) => [...prev, msg]);
        });

        return () => {
            socket.off('message'); // Limpiar el evento al desmontar
        };

    }, []);

    const sendMessage = () => {
        const messageData = {
            sender_id: id?.toString(),
            recipient_id: idRecipient.toString(), // ID del usuario al que se envía el mensaje
            message: input
        };
        socket.emit('message', messageData);
        if (id != idRecipient) {
            setMessages((prev: any) => [...prev, messageData]);
        }

        setInput('');
    };

    const ItemMessage = ({ message, idUser }: { message: MessageData, idUser: number }) => {

        let stylesOwnMessage = 'bg-[#ebeaec] ml-10'
        let stylesViewOtherMessage = 'bg-[#25324b] mr-10'
        let stylesTextOtherMessage = 'text-slate-100'

        let viewStyle = (idUser == message.sender_id) ? stylesOwnMessage : stylesViewOtherMessage
        let textStyle = (idUser == message.sender_id) ? '' : stylesTextOtherMessage
        return (
            <View className={`${viewStyle} rounded-xl mt-2 p-3`}>
                <Text className={textStyle}>{message.message}</Text>
            </View>
        )
    }

    return (
        <View className='flex items-center justify-center max-h-screen p-6 pt-12 pb-24 '>
            <View>
                <Text>Sesion con id: {id}</Text>

                <Text>Enviar mensaje a id: </Text>
                <TextInput value={idRecipient} onChangeText={setIdRecipient}
                    className='bg-gray-400'
                />
            </View>
            <View className='bg-[#9ab7e8] min-w-full h-auto p-5 rounded-xl'>
                <View>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <ItemMessage message={item} idUser={id} />}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Text className="text-md font-medium mb-2 text-slate-700">Mensaje:</Text>
                    <InputStyled
                        className=""
                        setValueInput={setInput}
                        placeholder="Ingrese un mensaje"
                    />
                    <Button label="Enviar mensaje" variant={'secondary'} onPress={sendMessage} />
                </View>
            </View>
        </View>
    )
}