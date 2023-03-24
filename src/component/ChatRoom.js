import React, { useState } from 'react'
import { over } from 'stompjs'
import SockJS from 'sockjs-client'
import '../cssFiles/ChatRoom.css'


var stompClient=null;
var screenWidth = window.innerWidth;
const ChatRoom = () => {


    const [userData,setUserData]=useState({
        username:"",
        recievername:"",
        connected:false,
        message:""
    })
    const [tab,setTab]=useState(screenWidth?"USERS":"CHATROOM");
    
    const [publicChats,setPublicChats]=useState([]);
    const [privateChats,setPrivateChats]=useState(new Map("",[]));

    const handelUserName=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username":value}); 
    }

    const handelpublicMessage=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message":value}); 
    }
    const handelprivateMessage=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message":value}); 
    }

    const registerUser=()=>{
        
        let Sock=new SockJS('http://localhost:8080/ws');
        stompClient=over(Sock);
        stompClient.connect({},onConnectted,onErrer);
          
    }
    const onConnectted=()=>{
        setUserData({...userData,"connected":true}); 
        stompClient.subscribe('/chatroom/public',onPublicMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private',onPrivateMessageReceived); 
        userJoin();
    }

    const userJoin=()=>{

        let chatMessage={
            senderName:userData.username,
            status:'JOIN'
        };
        stompClient.send('/app/message',{},JSON.stringify(chatMessage));
    }

    const onErrer=()=>{
        console.log("errer not connected in web soket")
    }
    const onPublicMessageReceived=(payload)=>{
        let payloadData=JSON.parse(payload.body);
        switch(payloadData.status)
        {
            case "JOIN":
                if(!privateChats.get(payloadData.senderName))
                {
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break

            case "MESSAGE":
                publicChats.push(payloadData);
                console.log(publicChats);
                setPublicChats([...publicChats]);
                break        
        }
    }
    const onPrivateMessageReceived=(payload)=>{
        let payloadData=JSON.parse(payload.body);
        console.log("payloadData-"+payloadData+" ,-setUserData-"+userData);

        if(privateChats.get(payloadData.senderName))
        {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }
        else
        {
            let list=[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }

        
    }
   

    const sendPublicMessage=()=>{
        if(stompClient)
        {
            let chatMessage={
                senderName:userData.username,
                message:userData.message,
                status:"MESSAGE"
            };
            stompClient.send('/app/message',{},JSON.stringify(chatMessage));
            setUserData({...userData,"message":""}); 


        }
    }
    const sendPrivateMessage=()=>{
        if(stompClient)
        {
            let chatMessage={
                senderName:userData.username,
                message:userData.message,
                receiverName:tab,
                status:"MESSAGE"
            };
            if(userData.username!==tab)
            {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send('/app/privatemessage',{},JSON.stringify(chatMessage));
            setUserData({...userData,"message":""}); 

        }
    }
    const tabhandel=(value)=>{
        setTab(value.name);
        console.log(value.name);
    }

const Header=()=>{
    return(
        <div>
             <div className='header' >
                <div style={{"padding":"1%"}}>
                <label className='profil'>
                    <label className='profil-body'> 
                        {userData.username.charAt(0)}
                    </label>
                </label>
                <label style={{"color":"red"}}>{userData.username}</label>
                </div>
                <a>Hi happy to chat  with friends</a>
             </div>
        </div>
    )
}
const BodyLeft=()=>{
    return(
        <div>
            <div className='body-left'>
                    <div>
                        <a  onClick={(e)=>{tabhandel({name:"CHATROOM"})}}>
                            <li className='body-left-users'>chatroom</li><br />
                        </a>
                        {[...privateChats.keys()].map(
                            (name,index)=>(
                               <div>
                               
                                <div key={index}>
                                <a  onClick={(e)=>{tabhandel( {name})}} >
                                    <li className='body-left-users'>{name}</li>
                                   </a>
                                </div>
                                <br />
                                </div>
                            )
                        )}
                    </div>
                </div>
        </div>
    )
}
const BodyRight=()=>{
    return(
        <div>
            <div className='body-right'>
                    
                    <div className='chat-room'>
                    {tab==="CHATROOM"?
                    <div>
                       <div className='chat-room-header'>
                        <label >
                            {screenWidth<500?<button onClick={()=>{setTab("USERS")}}>back</button>:<></>}
                        </label>
                        <label className='profil'>
                            <label className='profil-body'> 
                              {tab.charAt(0)}
                            </label>
                        </label>
                        <label style={{"color":"red"}}>{tab}</label>  
                        </div>

                        <div className='chat-room-body'>
                        {publicChats.map(
                            (chat,index)=>(
                                <div  key={index}  style={{"padding":"1%"}}>
                                    {chat.senderName===userData.username?
                                    <div>
                                        <div  style={{"display": "flex","justify-content":"flex-end"}} >
                                        <div style={{"width":"80%"}}>
                                        <div className='my-chating'>
                                        {chat.message}
                                        </div>
                                        </div>
                                        </div>
                                    </div>
                                    :
                                    <div style={{"width":"80%"}} >
                                    <div className='other-chating' >
                                      <label style={{"color":"red"}}> {chat.senderName} </label> <br />
                                      <label >{chat.message}</label>
                                    </div>
                                    </div>
                                    }
                                </div>
                            )
                        )}
                        </div>
                        <div className='chat-room-footer'>
                        <input type='text' value={userData.message} onChange={handelpublicMessage} placeholder='enter message' className='chat-room-footer-text' />
                        <button type='button' onClick={sendPublicMessage} className='chat-room-footer-sendButton'>send</button>
                        </div> 
                    </div>
                    :
                    <div>
                        <div className='chat-room-header'>
                        <label>
                            {screenWidth<500?<button onClick={()=>{setTab("USERS")}}>back</button>:<></>}
                        </label>
                        <label className='profil'>
                        <label className='profil-body'> 
                           {tab.charAt(0)}
                        </label>
                        </label>
                        <label style={{"color":"red"}}>{tab}</label>  
                        </div>
                        <div className='chat-room-body'>
                        {[...privateChats.get(tab)].map(
                            (chat,index)=>(
                                <div  key={index}  style={{"padding":"10px"}}>
                                    {chat.senderName===userData.username?
                                    <div  style={{"display": "flex","justify-content":"flex-end"}} >
                                        <div style={{"width":"80%"}}>
                                        <div className='my-chating'>
                                        <label>{chat.message}</label>
                                        </div>
                                        </div>
                                    </div>
                                    :
                                    <div style={{"width":"80%"}} >
                                    <div className='other-chating' >
                                     <label>{chat.message}</label>
                                    </div>
                                    
                                    </div>
                                    }
                                </div>
                            )
                        )}
                        </div>
                        <div className='chat-room-footer'>
                        <input type='text' value={userData.message} onChange={handelprivateMessage} placeholder='enter message' className='chat-room-footer-text' />
                        <button type='submit' onClick={sendPrivateMessage} className='chat-room-footer-sendButton'>send</button>
                        </div> 
                    </div>
                    }
                    
                    
                    </div>
                    </div>
            
        </div>
    )
}


  return (
    <div>
        { userData.connected?
         <div>
            <div className='main'>
                {/* header */}
                  {Header()}
                {/* body left */}
                {/* {BodyLeft()} */}
               {/* body right */}
               {screenWidth<500?
               <div>{tab==="USERS"?BodyLeft():BodyRight()}</div>
               :
               <div>
                { BodyLeft() }
                <div>{tab==="USERS"?<></>:BodyRight()}</div>

                {/* {BodyRight()} */}
                </div>
                
                }
                
            </div>
         </div>
         :
         <div style={{"textAlign":"center"}}>
            <h1>connect and chat with your friends</h1>
             <input id="user-name"  placeholder='Enter the user name' defaultValue={userData.username} onChange={handelUserName}/>
             <button type='button' onClick={registerUser} >connect</button>
         </div>   
        }
    </div>
  )
}

export default ChatRoom