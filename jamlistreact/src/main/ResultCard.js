import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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
flex: 1;
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

export const Thumbnail = styled.img`
overflow: hidden;
min-width:3em;
min-height:3em;
max-width:3em;
max-height:3em;
`;

function ResultCard({payload, onClick}){

    
    const [imgsrc, setImgsrc] = useState(false);
    useEffect(()=>{
        if(payload){
            setImgsrc(payload.album_arts[0].link)
        }
        setImageIsLoading(true);
        
    },[payload])
    
    const [isImageLoading, setImageIsLoading] = useState(true);

  // Function to handle image load
  function handleImageLoad() {
    setImageIsLoading(false);
    };

    function OnError(){

        setImgsrc(payload?.album_arts[1]?.link ?? "none.png");
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
        return truncate(`${payload.isExplicit ? '🅴 •' : ''}  ${payload.artists.join(' & ')} •  ${payload.album}`, 43);
    }

//console.log(props);
return (
<RSTContainer onClick={(event) => payload ? onClick(payload): null}>
{((!imgsrc))
?   (<Skeleton height={"3em"} width={"3em"}/>) 
:   (<Thumbnail referrerpolicy="no-referrer" src={imgsrc} alt="" onError={() => OnError()} style={{display: isImageLoading ? 'none' : 'block'}} onLoad={() => handleImageLoad()}/>)
}
{imgsrc && isImageLoading && (<Skeleton height={"3em"} width={"3em"}/>) }
<SongInfo>
    <Title>
    
    {payload ? truncate(payload.title, 36) : <Skeleton/>}
    </Title>
    <Info>
    {payload ? getInfoString() : <Skeleton/>}
    </Info>
</SongInfo>
</RSTContainer>
);
}

export default ResultCard;