import React from "react";
import {useState} from "react";
import styled from "styled-components";

const CardContainer = styled.div`
z-index: -1;
width: 95%;
height: 20%;
display: flex;
max-height: 5em;
flex-flow: row nowrap;
background-color: var(--main-color);
justify-content: flex-start;
align-items: center;
margin-bottom: 1em;
padding: 0.5em;
box-shadow: 0 8px 20px 0 rgba(0,0,0,0.25);
transition: ease-in-out 0.2s;

&:hover {
    box-shadow: 0 8px 20px 0 rgba(0,0,0,0.5);
}

`;




export const Thumbnail = styled.img`
overflow: hidden;
min-width:3em;
min-height:3em;
max-width:3em;
max-height:3em;

`;
const SongInfo = styled.div`
display: flex;
text-align: left;
flex-direction: column;
margin: 0;
padding: 0.2em;
max-width: 70%;
`;

const Title = styled.h4`
font-weight: bold;
margin: 0;
`;
//overflow: hidden;

const Info = styled.h4`
font-weight: normal;
margin: 0;
`;



const VoteButton = styled.button`
background-color: white;
height: 4em;
width: 4em;
background-color: var(--main-color);
border-radius: 1em;
border: 2px solid rgb(187, 232, 252, 0);
transition: ease-in-out 0.2s;

&:hover{
    background-color: #ededed;
}

&:active{
    border: 2px solid rgb(187, 232, 252, 0.5);
}
`;

const VoteGroup = styled.div`
align-self: flex-end;
display: flex;
flex-direction: column;
&>* {
    margin: 0.5em 0.5em 0.5em 0.5em;
}

`;


function Card(props){
    
    const [imgsrc, setImgsrc] = useState(props.payload.album_arts[0].link);
    
    function OnError(){
        setImgsrc(props.payload.album_arts[1].link);
    }
    

    const DoVote = async(link, type) => {
        let vote = {
            target : link,
            vote : type
        }

        const response = await fetch('http://localhost:3001/api/vote/', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(vote) // body data type must match "Content-Type" header
          });
          return response.json(); // parses JSON response into native JavaScript objects
    }
    function truncate(text, maxlength){
        if(text.length>maxlength){
            return text.slice(0, maxlength) + "..."
        }
        else{
            return text;
        }
    }
    function secondsFormatted(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        let time = "";
        if (hours > 0){
            time = hours + ":" 
            if(minutes < 10) time += "0"
        }
        time+= minutes + ":" + remainingSeconds.toString().padStart(2,'0');
        return time
    }    
       

    function getInfoString(){
        return truncate(`${props.payload.isExplicit ? '🅴 •' : ''}  ${props.payload.artists.join(' & ')} • ${secondsFormatted(props.payload.duration_seconds)}`, 35);
    }

    return (
        <CardContainer>
            <Thumbnail referrerpolicy="no-referrer" src={imgsrc} alt="" onError={() => OnError()}/>
         
            <SongInfo>
    <Title>
    {truncate(props.payload.title, 60)}
    </Title>
    <Info>
    {getInfoString()}
    </Info>
</SongInfo>
            {/* <VoteGroup>
            <h5>{props.payload.votes} </h5>
            <VoteButton onClick={() => DoVote(props.link, 1)}><span role="img" aria-label="Upvote">👍</span></VoteButton>

            <VoteButton onClick={() => DoVote(props.link, -1)}><span role="img" aria-label="Downvote">👎</span></VoteButton>
            </VoteGroup>
          
             */}
        </CardContainer>
    );
}

export default Card;