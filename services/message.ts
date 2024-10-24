import { API_URL } from "@/constants/const";
import { MessageRes, RoomMessage } from "@/types/types";
import axios from "axios";


const parseToRoomMessages = (messages: any): RoomMessage[] => {

    return messages.map((message: any) => {
        return {
            id_user: message.id_user,
            username: message.username,
            room: message.room,
            message: message.message,
            isSystem: message.is_system || false,
            sendedTime: message.sendedTime
        };
    });
}

export const getMessagesByTrip = async (idTrip: string): Promise<{ error: string, messages: RoomMessage[] }> => {
    try {
        const response = await axios.get(`${API_URL}/messages/${idTrip}`);
        const messages = parseToRoomMessages(response.data)
        return { error: '', messages: messages }
    } catch (error) {
        return { error: 'api error', messages: [] }
    }
}

interface Success {
    error: '',
    res: MessageRes
}
interface Fail {
    error: string,
    res: undefined
}
export const sendMessage = async (message: RoomMessage): Promise<Success | Fail> => {

    const body = {
        user_id: message.id_user,
        trip_id: message.room,
        message: message.message
    }
    try {
        const response = await axios.post(`${API_URL}/messages`, body);
        return { error: '', res: response.data }
    } catch (error) {
        return { error: 'api error', res: undefined }
    }
}