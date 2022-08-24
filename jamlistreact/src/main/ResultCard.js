import React, { useState } from "react";
import styled from "styled-components";

const RSTContainer = styled.div`
display: flex;
flex-flow: row no-wrap;
margin: 0;
padding: 1em;
`;
const RSLContainer = styled.div`
display: flex;
flex-flow: column no-wrap;
margin: 0;
padding: 1em;
`;

const Title = styled.h4`
font-weight: bold;

`;
const Info = styled.h4`
font-weight: normal;
`;

const Thumbnail = styled.img`
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
    
    function getInfoString(){
        return `${props.payload.isExplicit ? 'E' : ''} • ${props.payload.artists.join(' & ')} •  ${props.payload.album}`
    }


return (
<RSTContainer>
<Thumbnail referrerpolicy="no-referrer" src={imgsrc} alt={props.payload.album} onError={() => OnError()} > 
</Thumbnail>
<RSLContainer>
    <Title>
    {props.payload.title}
    </Title>
    <Info>
    {getInfoString()}
    </Info>
</RSLContainer>
</RSTContainer>
);
}

export default ResultCard;