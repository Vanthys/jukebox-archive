import React, { useState } from "react";
import styled from "styled-components";

const RSTContainer = styled.div`
display: flex;
flex-flow: row no-wrap;
overflow: hidden;
max-height: 4em;
width:auto;
margin-left: 0;
padding: 0.1em;
transition: ease-in-out 0.2s;
&:hover {
    background-color: rgb(25,25,25);
}
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
white-space: nowrap;
overflow: hidden;
`;

const Thumbnail = styled.img`
overflow: hidden;
min-width:3em;
min-height:3em;
max-width:3em;
max-height:3em;

`;

function ResultCard(props){
    const [imgsrc, setImgsrc] = useState(props.payload.album_arts[0].link);
    
    function OnError(){
        setImgsrc(props.payload.album_arts[1].link);
    }
    
    function truncate(text, maxlength){
        if(text.length>maxlength){
            return text.slice(0, maxlength) + "..."
        }
        else{
            return text;
        }
    }
    function getInfoString(){
        return truncate(`${props.payload.isExplicit ? 'E •' : ''}  ${props.payload.artists.join(' & ')} •  ${props.payload.album}`, 43);
    }

console.log(props);
return (
<RSTContainer onClick={(event) => props.onClick(props.payload)}>
<Thumbnail referrerpolicy="no-referrer" src={imgsrc} alt="" onError={() => OnError()} > 
</Thumbnail>
<SongInfo>
    <Title>
    {props.payload.title}
    </Title>
    <Info>
    {getInfoString()}
    </Info>
</SongInfo>
</RSTContainer>
);
}

export default ResultCard;