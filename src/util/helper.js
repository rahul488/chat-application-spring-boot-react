export const getUsers=(userId) => ({
    publish:"/app/users/"+userId,
    subscribe:"/topic/users"
})
export const getSelectedChats=() => ({
    publish:"/app/user/chat",
    subscribe:"/topic/start-chat"
})
export const sendOrReceiveMessage=(chatId)=>({
    publish:"/app/message/send",
    subscribe:`/topic/receive/${chatId}`
})
export const getMessages=()=>({
    publish:`/app/user/messages`,
    subscribe:`/topic/all-messages`
})

//user related APIS
const BASEURL = "http://localhost:8080/"
export const  CREATE_USER = BASEURL+"signup";
export const LOGIN_USER = BASEURL+"login"
