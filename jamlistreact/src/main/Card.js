import React from "react";
import { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import LinesEllipsis from 'react-lines-ellipsis'


const moving_anim = keyframes`
0% {
    background-position: 0 0;
}

50% {
    background-position: 100% 0%;
}
100% {
    background-position: 200% 0%;
    
}
`


const CardContainer = styled.div`
z-index: 0;
width: 95%;
height: 20%;
display: flex;
max-height: 5em;
flex-flow: row nowrap;
background-color: ${({selected}) => selected ? "rgb(25,25,25)" : "var(--main-color)"};


justify-content: space-between;
align-items: center;
margin-bottom: 1em;
padding: 0.5em;
box-shadow: 0 8px 20px 0 rgba(0,0,0,0.25);
transition: ease-in-out 0.2s;



&:hover {
    box-shadow: 0 8px 20px 0 rgba(0,0,0,0.5);
}

`;


const Song = styled.div`
display: flex;
flex-flow: row nowrap;
justify-content: flex-start;
align-items: center;
`;

const Thumbnail = styled.img`
overflow: hidden;
min-width:3em;
min-height:3em;
max-width:3em;
max-height:3em;
margin-right: 5px;
`;




const SongInfo = styled.div`
display: flex;
text-align: left;
flex-direction: column;
margin: 0;
padding: 0.2em;
`;

const Title = styled.h4`
font-weight: bold;
margin: 0;
overflow: hidden;

`;

const Info = styled.h4`
font-weight: normal;
margin: 0;
`;

const Votes = styled.div`
font-weight: ${({selected}) => selected ? "bold" : "normal" };
font-size: ${({selected}) => selected ? "2em" : "1.5em" };
margin: 0;
margin-right:5px;
justify-self: end;
font-family: 'Lobster', cursive;


${({selected}) => selected ?
` 
background-image: linear-gradient(90deg, rgba(55,255,172,1) 0%, rgba(3,245,255,1) 11%, rgba(180,1,255,1) 34%, rgba(255,0,0,1) 55%, rgba(255,209,0,1) 79%, rgba(55,255,172,1) 100%);
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  `
  : 
  ""
}
animation: ${moving_anim} 2s linear infinite;
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

const baseurl = 'http://localhost:5000'
const Card = ({ song, votes, voted, userid, loadQueue }) => {
    

    
    const [imgsrc, setImgsrc] = useState(song.album_arts[0].link);
    const TextElement = useRef(0);

    function OnError() {
        setImgsrc(song.album_arts[1].link);
    }


    const DoVote = async (link) => {
        //console.log("Casting vote");
        await fetch(baseurl + '/api/vote/', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({payload: link, user: userid}) // body data type must match "Content-Type" header
        }).then((response)=> {
            loadQueue();
           // console.log(response.json);
        })
        
        //return response.json(); // parses JSON response into native JavaScript objects
    }
    function truncate(text, maxlength) {
        if (text.length > maxlength) {
            return text.slice(0, maxlength) + "..."
        }
        else {
            return text;
        }
    }
    function secondsFormatted(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        let time = "";
        if (hours > 0) {
            time = hours + ":"
            if (minutes < 10) time += "0"
        }
        time += minutes + ":" + remainingSeconds.toString().padStart(2, '0');
        return time
    }
    


    function getInfoString() {
        return truncate(`${song.isExplicit ? '🅴 •' : ''}  ${song.artists.join(' & ')} • ${secondsFormatted(song.duration_seconds)}`, 35);
    }


    return (
        <CardContainer onClick={(event) => DoVote(song)} selected={voted}>
            <Song>
            <Thumbnail referrerpolicy="no-referrer" src={imgsrc} alt="" onError={() => OnError()} />

            <SongInfo ref={TextElement}>
                <Title>
                <LinesEllipsis text={song.title} basedOn='letters'/>
                 </Title>
                <Info>
                <LinesEllipsis text={getInfoString()} basedOn='letters'/>
                </Info>
            </SongInfo>
            </Song>
            <Votes selected={voted}>
                {votes.length}
            </Votes>

        </CardContainer>
    );
}

export default Card;

/* <VoteGroup>
            <h5>{song.votes} </h5>
            <VoteButton onClick={() => DoVote(link, 1)}><span role="img" aria-label="Upvote">👍</span></VoteButton>

            <VoteButton onClick={() => DoVote(link, -1)}><span role="img" aria-label="Downvote">👎</span></VoteButton>
            </VoteGroup>
          
             */